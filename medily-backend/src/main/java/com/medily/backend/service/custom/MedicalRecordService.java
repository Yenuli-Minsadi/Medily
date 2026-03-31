package com.medily.backend.service.custom;

import com.medily.backend.dto.medical.MedicalRecordRequestDTO;
import com.medily.backend.dto.medical.MedicalRecordResponseDTO;

import java.util.List;

public interface MedicalRecordService {
    MedicalRecordResponseDTO createRecord(Integer doctorUserId, MedicalRecordRequestDTO request);
    List<MedicalRecordResponseDTO> getRecordsByPatient(Integer patientUserId);
}