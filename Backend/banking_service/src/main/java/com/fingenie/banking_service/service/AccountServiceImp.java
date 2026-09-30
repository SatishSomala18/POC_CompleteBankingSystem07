package com.fingenie.banking_service.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fingenie.banking_service.DTO.AccountDTO;
import com.fingenie.banking_service.DTO.AccountUpdateDTO;
import com.fingenie.banking_service.DTO.UserResponseDTO;
import com.fingenie.banking_service.entity.Account;
import com.fingenie.banking_service.exception.AccountFrozenException;
import com.fingenie.banking_service.exception.AccountNotFoundException;
import com.fingenie.banking_service.repository.AccountRepo;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class AccountServiceImp implements AccountService {

	@Autowired
	RestTemplate rt;

	@Autowired
	private HttpServletRequest request;

	@Autowired
	private AccountRepo accountRepo;

	@Override
	public Account createAccount(AccountDTO accdto) {

	    log.info("Creating account for userId: {}", accdto.getUserId());

	    UserResponseDTO user = getUser(accdto.getUserId());

	    boolean accountExists = accountRepo.existsByUserIdAndAccType(
	        user.getId(),
	        accdto.getAccType()
	    );

	    if (accountExists) {
	        throw new RuntimeException(
	            accdto.getAccType() + " account already exists for this user"
	        );
	    }

	    Account account = new Account();

	    account.setUserId(user.getId());
	    account.setAccHolder(user.getName());
	    account.setBalance(0.0);
	    account.setAccType(accdto.getAccType());
	    account.setStatus("ACTIVE");

	    return accountRepo.save(account);
	}

	@Override
	public Account getAccountById(Long id) {

		log.debug("Fetching account by id: {}", id);

		return accountRepo.findById(id).orElseThrow(() -> new AccountNotFoundException("Account not found"));
	}

	@Override
	public List<Account> getAllAccounts(){

		log.debug("Fetching all accounts");

		return accountRepo.findAll();
	}

	@Override
	public List<Account> getAccountByUserId(Long userId){

		log.info("Fetching accounts for userId: {}", userId);

		UserResponseDTO user = getUser(userId);

		List<Account> accounts = accountRepo.findByUserId(userId);

		if (accounts.isEmpty()) {
			log.warn("No accounts found for userId: {}", userId);
			throw new AccountNotFoundException("No Accounts not found for user");
		}

		return accounts;
	}

	@Override
	public Account updateAccount(AccountUpdateDTO accdto) {

		log.debug("Updating account with id: {}", accdto.getAccId());

		Account acc = getAccountById(accdto.getAccId());
		acc.setAccType(accdto.getAccType());

		return accountRepo.save(acc);
	}

	@Override
	public void deleteById(long id) {

		log.warn("Deleting account with id: {}", id);

		Account acc = accountRepo.findById(id).orElse(null);

		if (acc == null) {
			log.error("Account not found for deletion, id: {}", id);
			throw new AccountNotFoundException("Account not found for user");
		}

		accountRepo.deleteById(id);
	}

	@Override
	public void deleteByUserID(long userId) {

		log.warn("Deleting all accounts for userId: {}", userId);

		accountRepo.deleteByUserId(userId);
	}

	@Override
	public Account freezeAccount(Long id) {

		log.warn("Freezing account with id: {}", id);

		Account account = getAccountById(id);

		if ("CLOSED".equalsIgnoreCase(account.getStatus())) {
			throw new AccountFrozenException("Closed account cannot be frozen");
		}

		account.setStatus("FROZEN");

		return accountRepo.save(account);
	}

	@Override
	public Account unfreezeAccount(Long id) {

		log.warn("Unfreezing account with id: {}", id);

		Account account = getAccountById(id);

		if ("CLOSED".equalsIgnoreCase(account.getStatus())) {
			throw new AccountFrozenException("Closed account cannot be unfrozen");
		}

		account.setStatus("ACTIVE");

		return accountRepo.save(account);
	}

	@Override
	public Account closeAccount(Long id) {

		log.warn("Closing account with id: {}", id);

		Account account = getAccountById(id);

		account.setStatus("CLOSED");

		return accountRepo.save(account);
	}

	public UserResponseDTO getUser(Long userId) {

		String authHeader = request.getHeader("Authorization");

		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", authHeader);

		HttpEntity<String> entity = new HttpEntity<>(headers);

		String url = "http://USER-SERVICE/users/getuserbyid/" + userId;

		ResponseEntity<UserResponseDTO> response = rt.exchange(url, HttpMethod.GET, entity, UserResponseDTO.class);

		return response.getBody();
	}

	@Override
	public boolean existsByUserIdAndAccType(Long userId, String accType) {
		return accountRepo.existsByUserIdAndAccType(userId, accType);
	}
}