package com.fingenie.banking_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fingenie.banking_service.DTO.DepositRequestDTO;
import com.fingenie.banking_service.DTO.TransferDTO;
import com.fingenie.banking_service.DTO.WithdrawRequestDTO;
import com.fingenie.banking_service.entity.Account;
import com.fingenie.banking_service.entity.Transaction;
import com.fingenie.banking_service.exception.AccountFrozenException;
import com.fingenie.banking_service.exception.AccountNotFoundException;
import com.fingenie.banking_service.exception.InsufficientBalanceException;
import com.fingenie.banking_service.exception.TransactionAlreadyReversedException;
import com.fingenie.banking_service.exception.TransactionNotFoundException;
import com.fingenie.banking_service.repository.AccountRepo;
import com.fingenie.banking_service.repository.TransactionRepo;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class TransactionServiceImp implements TransactionService {

	@Autowired
	private AccountRepo accountRepo;

	@Autowired
	private TransactionRepo transactionRepo;

	@Override
	public Transaction deposit(DepositRequestDTO dto) {

		Account account = accountRepo.findById(dto.getAccountId())
				.orElseThrow(() -> new AccountNotFoundException("Account Not Found"));

		ensureActive(account);

		account.setBalance(account.getBalance() + dto.getAmount());

		accountRepo.save(account);

		Transaction transaction = new Transaction();
		transaction.setAmount(dto.getAmount());
		transaction.setType("DEPOSIT");
		transaction.setTimestamp(LocalDateTime.now());
		transaction.setToAccount(account);
		transaction.setStatus("SUCCESS");

		calculateRisk(transaction);

		return transactionRepo.save(transaction);
	}

	@Override
	public Transaction withdraw(WithdrawRequestDTO dto) {

		Account account = accountRepo.findById(dto.getAccountId())
				.orElseThrow(() -> new AccountNotFoundException("Account not found"));

		ensureActive(account);

		if (account.getBalance() < dto.getAmount()) {
			throw new InsufficientBalanceException("Insufficient Balance");
		}

		account.setBalance(account.getBalance() - dto.getAmount());

		accountRepo.save(account);

		Transaction transaction = new Transaction();
		transaction.setAmount(dto.getAmount());
		transaction.setType("WITHDRAW");
		transaction.setTimestamp(LocalDateTime.now());
		transaction.setFromAccount(account);
		transaction.setStatus("SUCCESS");

		calculateRisk(transaction);

		return transactionRepo.save(transaction);
	}

	@Override
	public Transaction transfer(TransferDTO dto) {

		Account sender = accountRepo.findById(dto.getFromAccountId())
				.orElseThrow(() -> new AccountNotFoundException("Sender Account Not Found"));

		Account receiver = accountRepo.findById(dto.getToAccountId())
				.orElseThrow(() -> new AccountNotFoundException("Receiver Account Not Found"));

		ensureActive(sender);
		ensureActive(receiver);

		if (sender.getBalance() < dto.getAmount()) {
			throw new InsufficientBalanceException("Insufficient Balance");
		}

		sender.setBalance(sender.getBalance() - dto.getAmount());
		receiver.setBalance(receiver.getBalance() + dto.getAmount());

		accountRepo.save(sender);
		accountRepo.save(receiver);

		Transaction transaction = new Transaction();
		transaction.setAmount(dto.getAmount());
		transaction.setType("TRANSFER");
		transaction.setTimestamp(LocalDateTime.now());
		transaction.setFromAccount(sender);
		transaction.setToAccount(receiver);
		transaction.setStatus("SUCCESS");

		calculateRisk(transaction);

		return transactionRepo.save(transaction);
	}

	private void ensureActive(Account account) {

		if (account.getStatus() != null && !"ACTIVE".equalsIgnoreCase(account.getStatus())) {
			throw new AccountFrozenException(
					"Account " + account.getId() + " is " + account.getStatus()
							+ " and cannot be used for transactions");
		}
	}

	private void calculateRisk(Transaction transaction) {

		double riskScore = 0;

		if (transaction.getAmount() >= 50000)
			riskScore += 20;

		if (transaction.getAmount() >= 100000)
			riskScore += 40;

		if (transaction.getTimestamp().getHour() >= 0 && transaction.getTimestamp().getHour() <= 5)
			riskScore += 20;

		if ("TRANSFER".equalsIgnoreCase(transaction.getType()))
			riskScore += 10;

		transaction.setRiskScore(riskScore);
		transaction.setFlagged(riskScore >= 50);
	}

	@Override
	public Transaction getTransactionById(Long id) {

		return transactionRepo.findById(id)
				.orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));
	}

	@Override
	public List<Transaction> getAllTransactions() {

		return transactionRepo.findAll();

	}

	@Override
	public List<Transaction> getTransactionsByAccountId(Long accountId) {

		return transactionRepo.findByFromAccountIdOrToAccountId(accountId, accountId);
	}

	@Override
	public List<Transaction> getTransactionsBetweenAccounts(Long fromAccountId, Long toAccountId) {

		return transactionRepo.findByFromAccountIdAndToAccountId(fromAccountId, toAccountId);
	}

	@Override
	public Transaction reverseTransaction(Long id) {

		Transaction original = getTransactionById(id);

		if ("REVERSED".equalsIgnoreCase(original.getStatus())) {
			throw new TransactionAlreadyReversedException("Transaction " + id + " has already been reversed");
		}

		Transaction reversal = new Transaction();
		reversal.setAmount(original.getAmount());
		reversal.setType("REVERSAL");
		reversal.setTimestamp(LocalDateTime.now());
		reversal.setStatus("SUCCESS");

		if ("DEPOSIT".equalsIgnoreCase(original.getType())) {

			Account toAccount = original.getToAccount();
			toAccount.setBalance(toAccount.getBalance() - original.getAmount());
			accountRepo.save(toAccount);
			reversal.setFromAccount(toAccount);

		} else if ("WITHDRAW".equalsIgnoreCase(original.getType())) {

			Account fromAccount = original.getFromAccount();
			fromAccount.setBalance(fromAccount.getBalance() + original.getAmount());
			accountRepo.save(fromAccount);
			reversal.setToAccount(fromAccount);

		} else if ("TRANSFER".equalsIgnoreCase(original.getType())) {

			Account sender = original.getFromAccount();
			Account receiver = original.getToAccount();

			if (receiver.getBalance() < original.getAmount()) {
				throw new InsufficientBalanceException("Receiver account has insufficient balance for reversal");
			}

			receiver.setBalance(receiver.getBalance() - original.getAmount());
			sender.setBalance(sender.getBalance() + original.getAmount());

			accountRepo.save(receiver);
			accountRepo.save(sender);

			reversal.setFromAccount(receiver);
			reversal.setToAccount(sender);
		}

		original.setStatus("REVERSED");
		transactionRepo.save(original);

		calculateRisk(reversal);

		return transactionRepo.save(reversal);
	}

	@Override
	public List<Transaction> getFlaggedTransactions() {

		return transactionRepo.findByFlaggedTrue();
	}

}