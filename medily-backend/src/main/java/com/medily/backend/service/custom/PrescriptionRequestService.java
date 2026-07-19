package com.medily.backend.service.custom;

import com.medily.backend.dto.prescription.PrescriptionCreateRequestDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestCreateDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestResponseDTO;

import java.util.List;

public interface PrescriptionRequestService {
    PrescriptionRequestResponseDTO sendRequest(Integer patientUserId, PrescriptionRequestCreateDTO request);
    List<PrescriptionRequestResponseDTO> getRequestsByPatient(Integer patientUserId);
    List<PrescriptionRequestResponseDTO> getRequestsByPharmacy(Integer pharmacyUserId);
    PrescriptionRequestResponseDTO updateStatus(Integer requestId, String status);
    public void respondToRequest(Integer requestId, boolean available);
}