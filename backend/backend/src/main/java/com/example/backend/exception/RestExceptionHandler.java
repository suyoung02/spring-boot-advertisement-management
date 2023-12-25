package com.example.backend.exception;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.enums.OurHttpCode;

@RestController
@ControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(value = InvalidAccountException.class)
    public ResponseEntity<ApiError> handleInvalidAccountException(InvalidAccountException e) {
        String errorMessage = e.getMessage();
        ApiError error = new ApiError(OurHttpCode.BAD_REQUEST.getCode(), errorMessage, new Date());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthenticationException(AuthenticationException e) {
        String errorMessage = "Invalid username or password";
        ApiError error = new ApiError(OurHttpCode.BAD_REQUEST.getCode(), errorMessage, new Date());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError> handleBindException(BindException e) {
        String errorMessage = "Invalid request";
        if (e.getBindingResult().hasErrors())
            errorMessage = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        ApiError error = new ApiError(OurHttpCode.BAD_REQUEST.getCode(), errorMessage, new Date());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
