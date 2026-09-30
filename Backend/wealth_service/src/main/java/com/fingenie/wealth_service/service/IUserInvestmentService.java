package com.fingenie.wealth_service.service;

import java.util.List;

import com.fingenie.wealth_service.dto.UserInvestmentRequestDTO;
import com.fingenie.wealth_service.dto.UserInvestmentResponseDTO;
import com.fingenie.wealth_service.entity.UserInvestment;

public interface IUserInvestmentService {
	
	UserInvestmentResponseDTO addUserInvestment(UserInvestmentRequestDTO dto);
	UserInvestmentResponseDTO updateUserInvestment(Long id, UserInvestmentRequestDTO dto); 
	UserInvestmentResponseDTO getUserInvestmentById(Long Id); 
    List<UserInvestmentResponseDTO> getUserInvestmentByUserId(Long userId);
    List<UserInvestmentResponseDTO> getUserInvestmentByInvestmentId(Long investmentId);
    List<UserInvestmentResponseDTO> getAllUserInvestment();
    void closeInvestmentById(Long id);
    void closeInvestmentByInvestmentId(Long id);
    void closeInvestmentByUserId(Long id);
    
        
}