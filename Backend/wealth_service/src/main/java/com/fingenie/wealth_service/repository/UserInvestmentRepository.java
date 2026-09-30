package com.fingenie.wealth_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import com.fingenie.wealth_service.entity.UserInvestment;
@Repository
public interface UserInvestmentRepository extends JpaRepository<UserInvestment, Long> {

    List<UserInvestment> findByUserId(Long userId);

    List<UserInvestment> findByInvestmentId(Long investmentId);
    @Modifying
    void deleteByInvestmentId(Long investmentId);
    void deleteByUserId(Long userId);
}