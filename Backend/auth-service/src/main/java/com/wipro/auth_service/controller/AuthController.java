package com.wipro.auth_service.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.wipro.auth_service.dto.AuthRequest;
import com.wipro.auth_service.dto.AuthResponse;
import com.wipro.auth_service.dto.LoginRequest;
import com.wipro.auth_service.dto.OtpRequest;
import com.wipro.auth_service.dto.RefreshTokenRequest;
import com.wipro.auth_service.dto.ResponseMessage;
import com.wipro.auth_service.entity.RefreshToken;
import com.wipro.auth_service.entity.User;
import com.wipro.auth_service.entity.UserSecurity;
import com.wipro.auth_service.exception.OtpException;
import com.wipro.auth_service.exception.RefreshTokenException;
import com.wipro.auth_service.exception.UserSecurityNotFoundException;
import com.wipro.auth_service.factory.OtpFactory;
import com.wipro.auth_service.factory.OtpGenerator;
import com.wipro.auth_service.repository.RefreshTokenRepository;
import com.wipro.auth_service.repository.UserRepo;
import com.wipro.auth_service.repository.UserSecurityRepository;
import com.wipro.auth_service.service.AuthService;
import com.wipro.auth_service.service.JwtService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/auth")
public class AuthController {

	@Autowired
	private AuthService service;

	@Autowired
	private AuthenticationManager authManager;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private UserSecurityRepository userSecurityRepo;

	@Autowired
	private RefreshTokenRepository refreshTokenRepo;

	@PostMapping("/register")
	public String register(@Valid @RequestBody AuthRequest request) {

		log.debug("Register API called for user: {}", request.getName());

		service.registerUser(request);
		return "User registered with Role " + request.getRoles();
	}

	@PostMapping("/login")
	public ResponseMessage login(@Valid @RequestBody LoginRequest request) {

		log.info("Login API called for user: {}", request.getName());

		authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword()));

		User user = userRepo.findByNameIgnoreCase(request.getName())
				.orElseThrow(() -> new RuntimeException("User not found"));

		OtpGenerator generator = OtpFactory.getOtpGenerator("FIXED");
		String otp = generator.generateOtp();
		LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(5);

		UserSecurity security = userSecurityRepo.findByUserId(user.getId());

		if (security == null) {
			security = new UserSecurity();
			security.setUser(user);
		}

		security.setOtp(otp);
		security.setExpiryTime(expiryTime);

		userSecurityRepo.save(security);

		return ResponseMessage.builder().message("OTP_REQUIRED").userId(user.getId()).build();
	}

	@PostMapping("/verify-otp")
	public AuthResponse verifyOtp(@RequestBody OtpRequest request) {

		log.warn("Verify OTP API called for userId: {}", request.getUserId());

		UserSecurity security = userSecurityRepo.findByUserId(request.getUserId());
		if (security == null) {
			throw new UserSecurityNotFoundException("Security Not Found With User Id : " + request.getUserId());
		}

		if (!security.getOtp().equals(request.getOtp())) {
			throw new OtpException("Invalid OTP");
		}

		if (security.getExpiryTime().isBefore(LocalDateTime.now())) {
			throw new OtpException("OTP expired");
		}

		User user = security.getUser();

		String token = jwtService.generateToken(user.getName(), user.getRoles());

		String refreshTokenValue = java.util.UUID.randomUUID().toString();

		RefreshToken refreshToken = refreshTokenRepo.findByUserId(user.getId());

		if (refreshToken == null) {
			refreshToken = new RefreshToken();
			refreshToken.setUser(user);
		}

		refreshToken.setToken(refreshTokenValue);
		refreshToken.setExpiryTime(LocalDateTime.now().plusDays(7));

		refreshTokenRepo.save(refreshToken);

		return AuthResponse.builder().token(token).role(user.getRoles()).refreshToken(refreshTokenValue)
				.userId(user.getId()).build();
	}

	@PostMapping("/refresh-token")
	public AuthResponse refreshToken(@RequestBody RefreshTokenRequest request) {

		log.info("Refresh token API called");

		RefreshToken refreshToken = refreshTokenRepo.findByToken(request.getRefreshToken());

		if (refreshToken == null) {
			throw new RefreshTokenException("Invalid refresh token");
		}

		if (refreshToken.getExpiryTime().isBefore(LocalDateTime.now())) {
			throw new RefreshTokenException("Refresh token expired, please login again");
		}

		User user = refreshToken.getUser();

		String token = jwtService.generateToken(user.getName(), user.getRoles());

		return AuthResponse.builder().token(token).role(user.getRoles()).refreshToken(refreshToken.getToken())
				.userId(user.getId()).build();
	}
}