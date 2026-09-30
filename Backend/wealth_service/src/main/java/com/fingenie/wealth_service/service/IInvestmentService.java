package com.fingenie.wealth_service.service;

import java.util.List;

import com.fingenie.wealth_service.dto.InvestmentDTO;
import com.fingenie.wealth_service.entity.Investment;

public interface IInvestmentService {
	
    List<Investment> getAllInvestments();
    String closeInvestmentById(Long Id);
    Investment updateInvestment(InvestmentDTO investment,Long id);
	Investment getInvestmentById(Long id);
	Investment addInvestment(InvestmentDTO investment);
	}