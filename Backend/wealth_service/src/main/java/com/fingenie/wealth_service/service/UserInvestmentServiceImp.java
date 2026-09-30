package com.fingenie.wealth_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fingenie.wealth_service.dto.DepositRequestDTO;
import com.fingenie.wealth_service.dto.UserInvestmentRequestDTO;
import com.fingenie.wealth_service.dto.UserInvestmentResponseDTO;
import com.fingenie.wealth_service.dto.UserResponseDTO;
import com.fingenie.wealth_service.dto.WithdrawRequestDTO;
import com.fingenie.wealth_service.entity.Account;
import com.fingenie.wealth_service.entity.Investment;
import com.fingenie.wealth_service.entity.Transaction;
import com.fingenie.wealth_service.entity.UserInvestment;
import com.fingenie.wealth_service.repository.InvestmentRepository;
import com.fingenie.wealth_service.repository.UserInvestmentRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;

@Service
public class UserInvestmentServiceImp implements IUserInvestmentService {

	private final UserInvestmentRepository userInvestmentRepo;
	private final InvestmentRepository investmentRepo;

	public UserInvestmentServiceImp(UserInvestmentRepository userInvestmentRepo, InvestmentRepository investmentRepo) {
		this.userInvestmentRepo = userInvestmentRepo;
		this.investmentRepo = investmentRepo;
	}

	@Autowired
	RestTemplate rt;

	@Autowired
	private HttpServletRequest request;

	@Override
	public UserInvestmentResponseDTO addUserInvestment(UserInvestmentRequestDTO dto) {

		if (dto.getAmount() <= 0) {
			throw new RuntimeException("Amount must be greater than 0");
		}

		Investment investment = investmentRepo.findById(dto.getInvestmentId())
				.orElseThrow(() -> new RuntimeException("Investment not found"));

		Account acc = getAccount(dto.getAccountId());

		WithdrawRequestDTO withdto = new WithdrawRequestDTO();
		withdto.setAccountId(dto.getAccountId());
		withdto.setAmount(dto.getAmount());

		Transaction tr = withdrawAmount(withdto);

		UserInvestment entity = new UserInvestment();
		entity.setAccountId(dto.getAccountId());
		entity.setUserId(acc.getUserId());
		entity.setAmount(dto.getAmount());
		entity.setInvestment(investment);

		UserInvestment saved = userInvestmentRepo.save(entity);

		return convertToDTO(saved);
	}

	@Override
	public UserInvestmentResponseDTO updateUserInvestment(Long id, UserInvestmentRequestDTO dto) {

		UserInvestment existing = userInvestmentRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("UserInvestment not found"));

		if (dto.getAmount() <= 0) {
			throw new RuntimeException("Amount must be greater than 0");
		}

		existing.setAmount(dto.getAmount());

		UserInvestment userinvest=userInvestmentRepo.save(existing);
		return convertToDTO(userinvest);
	}

	@Override
	public UserInvestmentResponseDTO getUserInvestmentById(Long id) {
		UserInvestment user= userInvestmentRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("UserInvestment not found with ID: " + id));
		
		return convertToDTO(user);
	}

	@Override
	public List<UserInvestmentResponseDTO> getUserInvestmentByUserId(Long userId) {
		
		
		List<UserInvestment> invests= userInvestmentRepo.findByUserId(userId);
		List<UserInvestmentResponseDTO> res=new ArrayList<>();
		for(UserInvestment user:invests) {
			res.add(convertToDTO(user));
		}
		return res;
		
		
	}

	@Override
	public List<UserInvestmentResponseDTO> getUserInvestmentByInvestmentId(Long investmentId){

		List<UserInvestment> invests= userInvestmentRepo.findByInvestmentId(investmentId);
		List<UserInvestmentResponseDTO> res=new ArrayList<>();
		for(UserInvestment user:invests) {
			res.add(convertToDTO(user));
		}
		return res;
	}

	@Override
	public List<UserInvestmentResponseDTO> getAllUserInvestment() {
		
		List<UserInvestment> invests= userInvestmentRepo.findAll();
		List<UserInvestmentResponseDTO> res=new ArrayList<>();
		for(UserInvestment user:invests) {
			res.add(convertToDTO(user));
		}
		return res;
	}

	@Override
	@Transactional
	public void closeInvestmentById(Long id) {

		UserInvestmentResponseDTO userinvest = getUserInvestmentById(id);

		DepositRequestDTO depodto = new DepositRequestDTO();

		depodto.setAmount(userinvest.getAmount());
		depodto.setAccountId(userinvest.getAccountId());
		Transaction tr = depositAmount(depodto);

		userInvestmentRepo.deleteById(id);

		return;
	}

	@Override
	@Transactional
	public void closeInvestmentByInvestmentId(Long id) {

		List<UserInvestmentResponseDTO> alluserinvestments = getUserInvestmentByInvestmentId(id);

		for (UserInvestmentResponseDTO uinvest : alluserinvestments) {
			DepositRequestDTO depodto = new DepositRequestDTO();

			depodto.setAmount(uinvest.getAmount());
			depodto.setAccountId(uinvest.getAccountId());
			Transaction tr = depositAmount(depodto);
		}

		userInvestmentRepo.deleteByInvestmentId(id);

		return;
	}

	@Override
	@Transactional
	public void closeInvestmentByUserId(Long id) {
		List<UserInvestmentResponseDTO> alluserinvestments = getUserInvestmentByUserId(id);

		for (UserInvestmentResponseDTO uinvest : alluserinvestments) {
			DepositRequestDTO depodto = new DepositRequestDTO();

			depodto.setAmount(uinvest.getAmount());
			depodto.setAccountId(uinvest.getAccountId());
			Transaction tr = depositAmount(depodto);
		}

		userInvestmentRepo.deleteByUserId(id);

	}

	private UserInvestmentResponseDTO convertToDTO(UserInvestment entity) {

		UserInvestmentResponseDTO dto = new UserInvestmentResponseDTO();

		UserResponseDTO user = getUser(entity.getUserId());

		dto.setId(entity.getId());
		dto.setInvestmentType(entity.getInvestment().getType());
		dto.setAmount(entity.getAmount());
		dto.setUserId(entity.getUserId());
		dto.setAccountId(entity.getAccountId());
		dto.setName(user.getName());

		return dto;
	}

	public Account getAccount(Long accountId) {

		String authHeader = request.getHeader("Authorization");

		HttpHeaders headers = new HttpHeaders();

		headers.set("Authorization", authHeader);

		HttpEntity<String> entity = new HttpEntity<>(headers);

		String url = "http://BANKING-SERVICE/account/getaccountbyid/" + accountId;

		ResponseEntity<Account> response = rt.exchange(url, HttpMethod.GET, entity, Account.class);

		return response.getBody();
	}

	public Transaction withdrawAmount(WithdrawRequestDTO dto) {

		String authHeader = request.getHeader("Authorization");

		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", authHeader);

		HttpEntity<WithdrawRequestDTO> entity = new HttpEntity<>(dto, headers);

		String url = "http://BANKING-SERVICE/transaction/withdraw";

		ResponseEntity<Transaction> response = rt.exchange(url, HttpMethod.POST, entity, Transaction.class);

		return response.getBody();
	}

	public Transaction depositAmount(DepositRequestDTO dto) {

		String authHeader = request.getHeader("Authorization");

		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", authHeader);

		HttpEntity<DepositRequestDTO> entity = new HttpEntity<>(dto, headers);

		String url = "http://BANKING-SERVICE/transaction/deposit";

		ResponseEntity<Transaction> response = rt.exchange(url, HttpMethod.POST, entity, Transaction.class);

		return response.getBody();
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

}