package com.fingenie.banking_service.service;

import java.util.List;

import com.fingenie.banking_service.DTO.AccountDTO;
import com.fingenie.banking_service.DTO.AccountUpdateDTO;
import com.fingenie.banking_service.entity.Account;

public interface AccountService {

    Account createAccount(AccountDTO accdto);

    Account updateAccount(AccountUpdateDTO accountDTO);
    
    boolean existsByUserIdAndAccType(Long userId, String accType);

    Account getAccountById(Long id);

    List<Account> getAllAccounts();

    List<Account> getAccountByUserId(Long userId);

    void deleteById(long id);

    void deleteByUserID(long userId);

    Account freezeAccount(Long id);

    Account unfreezeAccount(Long id);

    Account closeAccount(Long id);

}