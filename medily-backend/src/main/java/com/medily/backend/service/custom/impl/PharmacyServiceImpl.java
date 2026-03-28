package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.pharmacy.PharmacyRequestDTO;
import com.medily.backend.dto.pharmacy.PharmacyResponseDTO;
import com.medily.backend.entity.Pharmacy;
import com.medily.backend.entity.User;
import com.medily.backend.repository.PharmacyRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public PharmacyResponseDTO completeProfile(Long userId, PharmacyRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setUser(user);
        pharmacy.setName(request.getName());
        pharmacy.setLocation(request.getAddress());
        pharmacy.setContactNumber(request.getPhone());

        Pharmacy saved = pharmacyRepository.save(pharmacy);
        return mapToResponse(saved);
    }

    @Override
    public PharmacyResponseDTO getPharmacyByUserId(Long userId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Pharmacy profile not found"));
        return mapToResponse(pharmacy);
    }

    @Override
    public List<PharmacyResponseDTO> getAllPharmacies() {
        return pharmacyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PharmacyResponseDTO mapToResponse(Pharmacy pharmacy) {
        PharmacyResponseDTO dto = new PharmacyResponseDTO();
        dto.setId(Long.valueOf(pharmacy.getPharmacyId()));
        dto.setName(pharmacy.getName());
        dto.setAddress(pharmacy.getLocation());
        dto.setPhone(pharmacy.getContactNumber());
        return dto;
    }
}