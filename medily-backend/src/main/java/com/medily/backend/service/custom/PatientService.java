package com.medily.backend.service.custom;

import com.medily.backend.dto.patient.PatientRequestDTO;
import com.medily.backend.dto.patient.PatientResponseDTO;

import java.util.List;

public interface PatientService {
    PatientResponseDTO completeProfile(Integer userId, PatientRequestDTO request);
    PatientResponseDTO getPatientByUserId(Integer userId);
    List<PatientResponseDTO> getAllPatients();
}