package com.example.backend.exception;

public class InvalidAccountException extends IllegalArgumentException {
    public InvalidAccountException() {
        super("Invalid username or password");
    }

    public InvalidAccountException(String message) {
        super(message);
    }
}
