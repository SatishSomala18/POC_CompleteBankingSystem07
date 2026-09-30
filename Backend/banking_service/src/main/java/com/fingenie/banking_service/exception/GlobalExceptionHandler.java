package com.fingenie.banking_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fingenie.banking_service.exception.AccountFrozenException;
import com.fingenie.banking_service.exception.TransactionAlreadyReversedException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(AccountNotFoundException.class)
        public ResponseEntity<String> handleAccountNotFoundException(
                        AccountNotFoundException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(InsufficientBalanceException.class)
        public ResponseEntity<String> handleInsufficientBalanceException(
                        InsufficientBalanceException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(TransactionNotFoundException.class)
        public ResponseEntity<String> handleTransactionNotFoundException(
                        TransactionNotFoundException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<String> handleUserNotFoundException(
                        UserNotFoundException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(AccountFrozenException.class)
        public ResponseEntity<String> handleAccountFrozenException(
                        AccountFrozenException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.FORBIDDEN);
        }

        @ExceptionHandler(TransactionAlreadyReversedException.class)
        public ResponseEntity<String> handleTransactionAlreadyReversedException(
                        TransactionAlreadyReversedException ex) {

                return new ResponseEntity<>(
                                ex.getMessage(),
                                HttpStatus.BAD_REQUEST);
        }
}