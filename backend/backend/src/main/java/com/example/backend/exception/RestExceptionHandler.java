package com.example.backend.exception;

import java.util.Date;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.enums.OurHttpCode;

@RestController
@ControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(value = InvalidAccountException.class)
    public ResponseEntity<ApiError> handleInvalidAccountException() {
        ApiError error = new ApiError(OurHttpCode.BAD_REQUEST.getCode(), "Invalid username or password", new Date());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
}
