package com.medily.backend.service.custom;

import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestCreateDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestResponseDTO;

import java.util.List;

public interface PrescriptionRequestService {
    PrescriptionRequestResponseDTO sendRequest(Long patientUserId, PrescriptionRequestCreateDTO request);
    List<PrescriptionRequestResponseDTO> getRequestsByPatient(Long patientUserId);
    List<PrescriptionRequestResponseDTO> getRequestsByPharmacy(Long pharmacyUserId);
    PrescriptionRequestResponseDTO updateStatus(Long requestId, String status);
}