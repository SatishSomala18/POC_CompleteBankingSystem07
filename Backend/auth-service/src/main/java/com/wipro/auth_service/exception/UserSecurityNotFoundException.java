package com.wipro.auth_service.exception;

public class UserSecurityNotFoundException extends RuntimeException{
	
	public UserSecurityNotFoundException(String msg) {
		super(msg);
	}

}
