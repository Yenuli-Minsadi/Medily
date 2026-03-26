package com.medily.backend.util;

public class APIResponse<T> {

    private boolean success;
    private String message;
    private T data;

    // Constructors
    // Success with data
    public APIResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    // Success without data (for delete, approve, etc...)
    public APIResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }

    // Static factory methods, used in controllers
    public static <T> APIResponse<T> success(String message, T data) {
        return new APIResponse<>(true, message, data);
    }

    public static <T> APIResponse<T> success(String message) {
        return new APIResponse<>(true, message);
    }

    public static <T> APIResponse<T> error(String message) {
        return new APIResponse<>(false, message);
    }

    // Getters
    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public T getData() { return data; }
}