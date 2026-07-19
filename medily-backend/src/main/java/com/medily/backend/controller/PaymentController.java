package com.medily.backend.controller;

import com.medily.backend.dto.common.ApiResponse;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    @Value("${stripe.secret.key}")
    private String stripeSecretKey;

    private final UserRepository userRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    // For patient appointment booking
    @PostMapping("/appointment/create-intent")
    public ResponseEntity<ApiResponse<Map<String, String>>> createAppointmentPaymentIntent(
            @RequestBody Map<String, Object> request) {
        try {
            int amount = (int) request.get("amount"); // in dollars
            String description = (String) request.get("description");

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount((long) amount * 100) // convert to cents
                    .setCurrency("usd")
                    .setDescription(description)
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return ResponseEntity.ok(ApiResponse.success(
                    Map.of("clientSecret", intent.getClientSecret())
            ));
        } catch (StripeException e) {
            throw new RuntimeException("Payment intent creation failed: " + e.getMessage());
        }
    }

    // For doctor subscription
    @PostMapping("/subscription/create-intent")
    public ResponseEntity<ApiResponse<Map<String, String>>> createSubscriptionIntent() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User doctor = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(777L) // $7.77 in cents
                    .setCurrency("usd")
                    .setDescription("Medily Doctor Monthly Subscription")
                    .putMetadata("doctorId", String.valueOf(doctor.getUserId()))
                    .build();

            PaymentIntent intent = PaymentIntent.create(params);
            return ResponseEntity.ok(ApiResponse.success(
                    Map.of("clientSecret", intent.getClientSecret())
            ));
        } catch (StripeException e) {
            throw new RuntimeException("Subscription intent creation failed: " + e.getMessage());
        }
    }

    // Called after successful doctor subscription payment
    @PostMapping("/subscription/confirm")
    public ResponseEntity<ApiResponse<String>> confirmSubscription() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User doctor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        doctor.setIsSubscribed(true);
        userRepository.save(doctor);
        // Update accountStatus in localStorage via response
        return ResponseEntity.ok(ApiResponse.success("Subscription activated"));
    }
}
