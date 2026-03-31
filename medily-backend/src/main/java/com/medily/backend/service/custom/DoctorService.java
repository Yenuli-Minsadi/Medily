package com.medily.backend.service.custom;

import com.medily.backend.dto.doctor.DoctorRequestDTO;
import com.medily.backend.dto.doctor.DoctorResponseDTO;

import java.util.List;

public interface DoctorService {
    DoctorResponseDTO completeProfile(Integer userId, DoctorRequestDTO request);
    DoctorResponseDTO getDoctorByUserId(Integer userId);
    List<DoctorResponseDTO> getAllDoctors();
    List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization);
}