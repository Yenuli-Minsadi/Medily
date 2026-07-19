package com.medily.backend.service.custom.impl;

import com.medily.backend.service.custom.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendVerificationEmail(String toEmail, String doctorName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Medily - Account Verified ✓");
        message.setText(
            "Dear Dr. " + doctorName + ",\n\n" +
            "Congratulations! Your medical registration has been verified.\n" +
            "You can now log in to Medily and access all features.\n\n" +
            "Welcome to the Medily platform!\n\n" +
            "The Medily Team"
        );
        mailSender.send(message);
    }
}