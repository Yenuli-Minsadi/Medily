package com.medily.backend.service.custom;

import com.medily.backend.dto.prescription.PrescriptionCreateRequestDTO;
import com.medily.backend.dto.prescription.PrescriptionResponseDTO;

import java.util.List;

public interface PrescriptionService {
    PrescriptionResponseDTO createPrescription(Integer doctorUserId, PrescriptionCreateRequestDTO request);
    List<PrescriptionResponseDTO> getPrescriptionsByPatient(Integer patientUserId);
    List<PrescriptionResponseDTO> getPrescriptionsByDoctor(Integer doctorUserId);
    PrescriptionResponseDTO getPrescriptionById(Integer id);
}