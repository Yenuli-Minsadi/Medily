package com.medily.backend.service.custom;

import com.medily.backend.dto.clinic.ClinicRequestDTO;
import com.medily.backend.dto.clinic.ClinicResponseDTO;

import java.util.List;

public interface ClinicService {
    ClinicResponseDTO createClinic(ClinicRequestDTO request);
    List<ClinicResponseDTO> getAllClinics();
    ClinicResponseDTO getClinicById(Integer id);
    void deleteClinic(Integer id);
}