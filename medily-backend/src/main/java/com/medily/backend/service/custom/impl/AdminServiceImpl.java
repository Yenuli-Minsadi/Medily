package com.medily.backend.service.custom.impl;

import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.AdminService;
import com.medily.backend.service.custom.EmailService;
import com.medily.backend.service.custom.NotificationService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    public void approveDoctor(Integer userId) {

    }



}
