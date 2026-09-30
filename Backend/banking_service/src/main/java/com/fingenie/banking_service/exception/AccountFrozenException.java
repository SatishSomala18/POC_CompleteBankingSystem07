package com.fingenie.banking_service.exception;

public class AccountFrozenException extends RuntimeException {

    public AccountFrozenException(String message) {
        super(message);
    }
}
