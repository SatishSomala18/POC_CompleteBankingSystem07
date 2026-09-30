package com.fingenie.banking_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fingenie.banking_service.DTO.AccountDTO;
import com.fingenie.banking_service.entity.Account;

public interface AccountRepo extends JpaRepository<Account, Long> {

    List<Account> findByUserId(Long userId);
    
    boolean existsByUserIdAndAccType(Long userId, String accType);
    
    void deleteByUserId(Long userId);

}