package com.fingenie.user_service.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreditProfileDTO {


    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 900, message = "Credit score must not exceed 900")
    private int creditScore;

    @Positive(message = "Monthly income must be positive")
    private double monthlyIncome;

    @NotNull(message = "User ID is required")
    private Long userId;  
}
