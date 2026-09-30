package com.fingenie.wealth_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fingenie.wealth_service.dto.InvestmentDTO;
import com.fingenie.wealth_service.entity.Investment;
import com.fingenie.wealth_service.repository.InvestmentRepository;
import com.fingenie.wealth_service.repository.UserInvestmentRepository;

@Service
public class InvestmentServiceImp implements IInvestmentService {

    private final InvestmentRepository investmentRepo;
    private final UserInvestmentRepository userInvestmentRepo;

    public InvestmentServiceImp(InvestmentRepository investmentRepo,
                                 UserInvestmentRepository userInvestmentRepo) {
        this.investmentRepo = investmentRepo;
        this.userInvestmentRepo = userInvestmentRepo;
    }


	@Override
	public Investment updateInvestment(InvestmentDTO dto, Long id) {
		
		

	    if (id == null) {
	        throw new RuntimeException("Investment ID cannot be null");
	    }

	    
	    
	    Investment existingInvestment = investmentRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException(
	                    "Investment not found with ID: " + id));

	    if (dto.getType() == null || dto.getType().isEmpty()) {
	        throw new RuntimeException("Investment type cannot be empty");
	    }

	    if (dto.getRiskLevel() == null || dto.getRiskLevel().isEmpty()) {
	        throw new RuntimeException("Risk level cannot be empty");
	    }

	    existingInvestment.setType(dto.getType());
	    existingInvestment.setRiskLevel(dto.getRiskLevel());

	    return investmentRepo.save(existingInvestment);
	}
	
	@Override
	public Investment addInvestment(InvestmentDTO dto) {

	    if (dto == null) {
	        throw new RuntimeException("Request body cannot be null");
	    }

	    if (dto.getType() == null || dto.getType().trim().isEmpty()) {
	        throw new RuntimeException("Investment type cannot be empty");
	    }

	    if (dto.getRiskLevel() == null || dto.getRiskLevel().trim().isEmpty()) {
	        throw new RuntimeException("Risk level cannot be empty");
	    }

	    Investment investment = new Investment();
	    investment.setType(dto.getType());
	    investment.setRiskLevel(dto.getRiskLevel());

	    return investmentRepo.save(investment);
	}
	
	
	@Override
	public Investment getInvestmentById(Long id) {

	    if (id == null) {
	        throw new RuntimeException("Investment ID cannot be null");
	    }

	    return investmentRepo.findById(id)
	            .orElseThrow(() -> new RuntimeException(
	                    "Investment not found with ID: " + id));
	}

	@Override
	public List<Investment> getAllInvestments() {
		return investmentRepo.findAll();
	}
	

	@Override
	public String closeInvestmentById(Long id) {

	    if (!investmentRepo.existsById(id)) {
	        throw new RuntimeException("Investment not found with ID: " + id);
	    }

	    investmentRepo.deleteById(id);
	    return ("Investment deleted successfully with ID: " + id);
	}


	public UserInvestmentRepository getUserInvestmentRepo() {
		return userInvestmentRepo;
	}
}