package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.auth.AuthResponseDTO;
import com.medily.backend.dto.auth.LoginRequestDTO;
import com.medily.backend.dto.auth.RegisterRequestDTO;
import com.medily.backend.entity.User;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.security.JwtService;
import com.medily.backend.service.custom.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponseDTO register(RegisterRequestDTO request) {
        User user = new User();
        user.setFullName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.valueOf(request.getRole()));

        // Doctors start as PENDING, everyone else ACTIVE
        if (request.getRole().equals("DOCTOR")) {
            user.setAccountStatus(User.AccountStatus.PENDING);
            user.setSpecialization(request.getSpecialization());
            user.setMedicalRegNumber(request.getMedicalRegNumber());
        } else {
            user.setAccountStatus(User.AccountStatus.ACTIVE);
        }

        userRepository.save(user);
//        String token = jwtService.generateToken((UserDetails) user);
        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash() != null ? user.getPasswordHash() : "",
                        java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + user.getRole().name()))
                )
        );

        return AuthResponseDTO.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getFullName())
                .userId(user.getUserId())
                .accountStatus(user.getAccountStatus() != null
                        ? user.getAccountStatus().name() : "ACTIVE")
                .isSubscribed(user.getIsSubscribed() != null
                        ? user.getIsSubscribed() : false)
                .build();

    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() == User.Status.INACTIVE) {
            throw new RuntimeException("Your account has been deactivated. Please contact support.");
        }

        String token = jwtService.generateToken(
                new org.springframework.security.core.userdetails.User(
                        user.getEmail(),
                        user.getPasswordHash(),
                        java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + user.getRole().name()))
                )
        );

        return AuthResponseDTO.builder()
                .token(token)
                .role(user.getRole().name())
                .name(user.getFullName())
                .userId(user.getUserId())
                .accountStatus(user.getAccountStatus() != null
                        ? user.getAccountStatus().name() : "ACTIVE")
                .isSubscribed(user.getIsSubscribed() != null
                        ? user.getIsSubscribed() : false)
                .build();
    }
}