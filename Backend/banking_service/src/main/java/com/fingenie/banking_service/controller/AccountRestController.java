package com.fingenie.banking_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fingenie.banking_service.DTO.AccountDTO;
import com.fingenie.banking_service.DTO.AccountUpdateDTO;
import com.fingenie.banking_service.entity.Account;
import com.fingenie.banking_service.service.AccountServiceImp;

@RestController
@RequestMapping("/account")
public class AccountRestController {

	@Autowired
	private AccountServiceImp asi;

	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@PostMapping("/createaccount")
	public Account createAccount(@RequestBody AccountDTO accdto) {

		return asi.createAccount(accdto);

	}

	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@GetMapping("/getaccountbyid/{id}")

	public Account getAccountById(@PathVariable Long id){

		return asi.getAccountById(id);

	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping("/getallaccounts")
	public List<Account> getAllAccounts(){

		return asi.getAllAccounts();

	}

	@PreAuthorize("hasAnyRole('ADMIN','USER')")
	@GetMapping("getaccountsbyuserid/{userId}")
	public List<Account> getAccountByUserId(@PathVariable Long userId) {

		return asi.getAccountByUserId(userId);

	}

	@PreAuthorize("hasRole('USER')")
	@PutMapping("/updateaccount")
	public Account updateAccount(@RequestBody AccountUpdateDTO accountDTO) {

		return asi.updateAccount(accountDTO);

	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/deleteaccountbyid/{id}")
	public String deleteById(@PathVariable long id) {

		asi.deleteById(id);

		return "Account Deleted Successfully... With Account ID : " + id;

	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/deleteaccountbyuserid/{userId}")
	public String deleteByUserID(@PathVariable long userId) {
		asi.deleteByUserID(userId);
		return "Account Deleted Successfully...With USER ID : " + userId;
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/freezeaccountbyid/{id}")
	public Account freezeAccount(@PathVariable Long id) {

		return asi.freezeAccount(id);

	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/unfreezeaccountbyid/{id}")
	public Account unfreezeAccount(@PathVariable Long id) {

		return asi.unfreezeAccount(id);

	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping("/closeaccountbyid/{id}")
	public Account closeAccount(@PathVariable Long id) {

		return asi.closeAccount(id);

	}

}
