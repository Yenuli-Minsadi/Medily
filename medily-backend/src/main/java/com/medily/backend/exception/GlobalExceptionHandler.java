package com.medily.backend.exception;

import com.medily.backend.util.APIResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handles custom app exceptions
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<APIResponse<String>> handleCustomException(CustomException e) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(APIResponse.error(e.getMessage()));
    }

    // Handles null pointer exceptions
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<APIResponse<String>> handleNullPointerException(NullPointerException e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(APIResponse.error("Something went wrong. Please try again."));
    }

    // Handles validation exceptions (@Valid failures)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIResponse<String>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(APIResponse.error(message));
    }

    // Handles all other exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse<String>> handleGenericException(Exception e) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(APIResponse.error(e.getMessage()));
    }
}