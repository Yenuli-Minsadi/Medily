package com.medily.backend.service.custom;

import com.medily.backend.dto.patient.PatientRequestDTO;
import com.medily.backend.dto.patient.PatientResponseDTO;

import java.util.List;

public interface PatientService {
    PatientResponseDTO completeProfile(Long userId, PatientRequestDTO request);
    PatientResponseDTO getPatientByUserId(Long userId);
    List<PatientResponseDTO> getAllPatients();
}