package com.medily.backend.service.custom;

import com.medily.backend.dto.prescription.PrescriptionCreateRequestDTO;
import com.medily.backend.dto.prescription.PrescriptionResponseDTO;

import java.util.List;

public interface PrescriptionService {
    PrescriptionResponseDTO createPrescription(Long doctorUserId, PrescriptionCreateRequestDTO request);
    List<PrescriptionResponseDTO> getPrescriptionsByPatient(Long patientUserId);
    List<PrescriptionResponseDTO> getPrescriptionsByDoctor(Long doctorUserId);
    PrescriptionResponseDTO getPrescriptionById(Long id);
}