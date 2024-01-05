package com.silver.amazingchatapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(value = {ApiRequestException.class})
    public ResponseEntity<ApiExceptionResponse> handleNotFoundException(ApiRequestException e){
        ApiExceptionResponse response = ApiExceptionResponse
                .builder()
                .httpStatus(HttpStatus.NOT_FOUND)
                .message(e.getMessage())
                .zonedDateTime(ZonedDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }
}
