package com.fingenie.api_gateway.filter;

import org.springframework.cloud.gateway.filter.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.*;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import reactor.core.publisher.Mono;

@Component
public class JwtFilter implements GlobalFilter {

    private final String SECRET = "5367566B59703373367639792F423F4528482B4D6251655468576D5A71347437";

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        

        
        if (path.startsWith("/auth")) {
            
            return chain.filter(exchange);
        }

     
        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");

        System.out.println("Header: " + authHeader);

       
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
           
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }


        String token = authHeader.substring(7).trim();

        

        try {
           
            Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET)))
                    .build()
                    .parseClaimsJws(token);

            System.out.println("Token valid");

        } catch (Exception e) {
            System.out.println(" Token invalid: " + e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

      
        return chain.filter(exchange);
    }
}