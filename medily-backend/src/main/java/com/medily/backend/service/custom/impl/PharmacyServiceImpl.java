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

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyServiceImpl implements PharmacyService {

    private final PharmacyRepository pharmacyRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public PharmacyResponseDTO completeProfile(Integer userId, PharmacyRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Pharmacy pharmacy = new Pharmacy();
        pharmacy.setUser(user);
        pharmacy.setName(request.getName());
        pharmacy.setCity(request.getAddress());
        pharmacy.setContactNumber(request.getPhone());

        Pharmacy saved = pharmacyRepository.save(pharmacy);
        return mapToResponse(saved);
    }

    @Override
    public PharmacyResponseDTO getPharmacyByUserId(Integer userId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserUserId(userId)
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
        dto.setId(pharmacy.getPharmacyId());
        dto.setPharmacistUserId(pharmacy.getUser().getUserId());
        dto.setName(pharmacy.getName());
        dto.setAddress(pharmacy.getCity());
        dto.setPhone(pharmacy.getContactNumber());
        return dto;
    }

    // PharmacyServiceImpl.java
    @Override
    public List<PharmacyResponseDTO> getNearbyPharmaciesSorted(Double patientLat, Double patientLng, Integer maxResponseMinutes) {
        List<Pharmacy> all = pharmacyRepository.findAll();

        return all.stream()
                .filter(p -> p.getLatitude() != null && p.getLongitude() != null)
                .filter(p -> p.getAvgResponseMinutes() == null || p.getAvgResponseMinutes() <= maxResponseMinutes)
                .map(p -> {
                    PharmacyResponseDTO dto = mapToDTO(p);
                    dto.setDistanceKm(haversineKm(patientLat, patientLng, p.getLatitude(), p.getLongitude()));
                    return dto;
                })
                .sorted(Comparator.comparingDouble(PharmacyResponseDTO::getDistanceKm))
                .collect(Collectors.toList());
    }

    // Haversine formula — calculates real-world distance between two GPS points
    private double haversineKm(double lat1, double lng1, double lat2, double lng2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private PharmacyResponseDTO mapToDTO(Pharmacy p) {
        PharmacyResponseDTO dto = new PharmacyResponseDTO();
        dto.setId(p.getPharmacyId());
        dto.setName(p.getName());
        dto.setAddress(p.getCity());
        dto.setPhone(p.getContactNumber());
        dto.setLatitude(p.getLatitude());
        dto.setLongitude(p.getLongitude());
        dto.setAvgResponseMinutes(p.getAvgResponseMinutes());
        return dto;
    }
}