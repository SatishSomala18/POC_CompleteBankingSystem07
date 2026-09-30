package com.fingenie.banking_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.fingenie.banking_service.DTO.UserResponseDTO;

@FeignClient(
        name = "USER-SERVICE",
        url = "http://localhost:8081"
)


public interface UserFeignClient {

    @GetMapping("/users/{id}")
    UserResponseDTO getUserById(@PathVariable Long id);

}