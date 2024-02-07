package com.silver.amazingchatapp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

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
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiExceptionResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e){
        StringBuilder errorsMessage = new StringBuilder();
        e.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errorsMessage.append(fieldName).append(" "). append(errorMessage).append(" | ");
        });
        errorsMessage.delete(errorsMessage.lastIndexOf("|") - 1, errorsMessage.lastIndexOf("|") + 2);

        ApiExceptionResponse response = ApiExceptionResponse
                .builder()
                .httpStatus(HttpStatus.BAD_REQUEST)
                .message(errorsMessage.toString())
                .zonedDateTime(ZonedDateTime.now())
                .build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
