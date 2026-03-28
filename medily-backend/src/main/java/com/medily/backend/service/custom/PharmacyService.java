package com.medily.backend.service.custom;

import com.medily.backend.dto.pharmacy.PharmacyRequestDTO;
import com.medily.backend.dto.pharmacy.PharmacyResponseDTO;

import java.util.List;

public interface PharmacyService {
    PharmacyResponseDTO completeProfile(Long userId, PharmacyRequestDTO request);
    PharmacyResponseDTO getPharmacyByUserId(Long userId);
    List<PharmacyResponseDTO> getAllPharmacies();
}