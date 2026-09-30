package com.fingenie.user_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreditProfileResponseDTO {
    private Long id;
    private int creditScore;
    private double monthlyIncome;
    private Long userId;
    private String riskCategory;

}
