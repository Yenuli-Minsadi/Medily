package com.medily.backend.service.custom.impl;

import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.AdminService;
import com.medily.backend.service.custom.EmailService;
import com.medily.backend.service.custom.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.beans.Transient;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final NotificationService notificationService;

    @Override
    public List<Map<String, Object>> getPendingDoctors() {
        return userRepository.findAll().stream().
                filter(u -> u.getRole().name().equals("DOCTOR")
                        && u.getAccountStatus() == User.AccountStatus.PENDING)
                .map(u -> Map.<String, Object>of(
                        "userId", u.getUserId(),
                        "fullName", u.getFullName(),
                        "email", u.getEmail(),
                        "specialization", u.getSpecialization() != null ? u.getSpecialization() : "",
                        "medicalRegisterNumber", u.getMedicalRegNumber() != null ? u.getMedicalRegNumber() : "",
                        "accountStatus", u.getAccountStatus().name()
                ))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void approveDoctor(Integer userId) {
        User doctor = findUser(userId);
        doctor.setAccountStatus(User.AccountStatus.ACTIVE);
        userRepository.save(doctor);

        // Send in-app notification
        notificationService.createNotification(
                doctor.getUserId(),
                "Your account has been verified! You can now access all features.",
                "VERIFICATION"
        );

        // Send email
        emailService.sendVerificationEmail(doctor.getEmail(), doctor.getFullName());
        
    }

    private User findUser(Integer userId) {
        return  userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }


}
