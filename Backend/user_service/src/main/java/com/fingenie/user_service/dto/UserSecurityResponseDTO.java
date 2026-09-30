package com.fingenie.user_service.dto;

import java.time.LocalDateTime;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class UserSecurityResponseDTO {
	
	private Long id;
	private String otp;
	private LocalDateTime expiryTime;
	private Long userId;

}
