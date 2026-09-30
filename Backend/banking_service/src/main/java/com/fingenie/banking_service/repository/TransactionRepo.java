package com.fingenie.banking_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fingenie.banking_service.entity.Transaction;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {

	List<Transaction> findByFromAccountIdOrToAccountId(Long fromAccountId,
			Long toAccountId);

	List<Transaction> findByFromAccountIdAndToAccountId(
			Long fromAccountId,
			Long toAccountId);

	List<Transaction> findByFlaggedTrue();

}