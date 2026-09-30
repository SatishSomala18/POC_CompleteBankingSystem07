package com.fingenie.banking_service.service;

import java.util.List;

import com.fingenie.banking_service.DTO.DepositRequestDTO;
import com.fingenie.banking_service.DTO.TransferDTO;
import com.fingenie.banking_service.DTO.WithdrawRequestDTO;
import com.fingenie.banking_service.entity.Transaction;

public interface TransactionService {

    Transaction deposit(DepositRequestDTO dto);

    Transaction withdraw(WithdrawRequestDTO dto);

    Transaction transfer(TransferDTO dto);

    Transaction getTransactionById(Long id);

    List<Transaction> getAllTransactions();

    List<Transaction> getTransactionsByAccountId(Long accountId);

    List<Transaction> getTransactionsBetweenAccounts(
            Long fromAccountId,
            Long toAccountId);

    Transaction reverseTransaction(Long id);

    List<Transaction> getFlaggedTransactions();
}