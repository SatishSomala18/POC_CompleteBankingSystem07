package com.fingenie.user_service.exceptions;

public class WrongPasswordException extends RuntimeException{
	
	public WrongPasswordException(String msg) {
		super(msg);
	}

}
