package com.fingenie.wealth_service.service;

import org.springframework.stereotype.Service;

@Service
public class EMICalculatorService {

    public double calculateEmi(double principal, double rate, int tenureMonths) {

        double monthlyRate = rate / (12 * 100);

        return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
               (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    }
}