package com.fingenie.user_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserSecurityDTO {

    @NotBlank(message = "OTP is required")
    @Pattern(regexp = "\\d{6}", message = "OTP must be 6 digits")
    private String otp;

    @NotNull(message = "Expiry minutes is required")
    @Min(value = 1, message = "Expiry minutes must be at least 1")
    private Integer expiryMinutes;

    @NotNull(message = "User ID is required")
    private Long userId;
}