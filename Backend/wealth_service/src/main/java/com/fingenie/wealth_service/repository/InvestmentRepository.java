package com.fingenie.wealth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fingenie.wealth_service.entity.Investment;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {


}
