package com.medily.backend.service.custom;

import com.medily.backend.dto.pharmacy.PharmacyRequestDTO;
import com.medily.backend.dto.pharmacy.PharmacyResponseDTO;

import java.util.List;

public interface PharmacyService {
    PharmacyResponseDTO completeProfile(Integer userId, PharmacyRequestDTO request);
    PharmacyResponseDTO getPharmacyByUserId(Integer userId);
    List<PharmacyResponseDTO> getAllPharmacies();
    public List<PharmacyResponseDTO> getNearbyPharmaciesSorted(Double patientLat, Double patientLng, Integer maxResponseMinutes);
}