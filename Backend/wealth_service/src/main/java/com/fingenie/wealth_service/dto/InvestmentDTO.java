package com.fingenie.wealth_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class InvestmentDTO {

    private String type;
    private String riskLevel;


    public InvestmentDTO(String type, String riskLevel) {
        this.type = type;
        this.riskLevel = riskLevel;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }
}