package com.medily.backend.service.custom;

public interface EmailService {
    public void sendVerificationEmail(String toEmail, String doctorName);
}
