package com.fingenie.api_gateway.filter;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

/* In-memory fixed-window rate limiter per client IP - no Redis/paid service required. */
@Component
public class RateLimitFilter implements GlobalFilter, Ordered {

    private static final int MAX_REQUESTS_PER_WINDOW = 100;
    private static final long WINDOW_MILLIS = 60_000;

    private final ConcurrentHashMap<String, Window> clients = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String clientIp = exchange.getRequest().getRemoteAddress() != null
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                : "unknown";

        Window window = clients.computeIfAbsent(clientIp, key -> new Window());

        if (window.isExceeded()){
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }

    private static class Window {

        private volatile long windowStart = System.currentTimeMillis();
        private final AtomicInteger count = new AtomicInteger(0);

        synchronized boolean isExceeded() {

            long now = System.currentTimeMillis();

            if (now - windowStart > WINDOW_MILLIS) {
                windowStart = now;
                count.set(0);
            }

            return count.incrementAndGet() > MAX_REQUESTS_PER_WINDOW;
        }
    }
}
