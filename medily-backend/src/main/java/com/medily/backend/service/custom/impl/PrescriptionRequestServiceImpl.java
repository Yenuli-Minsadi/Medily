package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestCreateDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestResponseDTO;
import com.medily.backend.entity.*;
import com.medily.backend.repository.*;
import com.medily.backend.service.custom.PrescriptionRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionRequestServiceImpl implements PrescriptionRequestService {

    private final PrescriptionRequestRepository prescriptionRequestRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final PharmacyRepository pharmacyRepository;

    @Override
    public PrescriptionRequestResponseDTO sendRequest(Long patientUserId, PrescriptionRequestCreateDTO request) {
        Patient patient = patientRepository.findByUserUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        Prescription prescription = prescriptionRepository.findById(request.getPrescriptionId())
                .orElseThrow(() -> new RuntimeException("Prescription not found"));

        Pharmacy pharmacy = pharmacyRepository.findById(request.getPharmacyId())
                .orElseThrow(() -> new RuntimeException("Pharmacy not found"));

        PrescriptionRequest prescriptionRequest = new PrescriptionRequest();
        prescriptionRequest.setPatient(patient);
        prescriptionRequest.setPrescription(prescription);
        prescriptionRequest.setPharmacy(pharmacy);
        prescriptionRequest.setStatus(PrescriptionRequest.Status.valueOf("PENDING"));

        return mapToResponse(prescriptionRequestRepository.save(prescriptionRequest));
    }

    @Override
    public List<PrescriptionRequestResponseDTO> getRequestsByPatient(Long patientUserId) {
        Patient patient = patientRepository.findByUserUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return prescriptionRequestRepository.findByPatientPatientId(Long.valueOf(patient.getPatientId()))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionRequestResponseDTO> getRequestsByPharmacy(Long pharmacyUserId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserUserId(pharmacyUserId)
                .orElseThrow(() -> new RuntimeException("Pharmacy profile not found"));
        return prescriptionRequestRepository.findByPharmacyPharmacyId(Long.valueOf(pharmacy.getPharmacyId()))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PrescriptionRequestResponseDTO updateStatus(Long requestId, String status) {
        PrescriptionRequest request = prescriptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(PrescriptionRequest.Status.valueOf(status));
        return mapToResponse(prescriptionRequestRepository.save(request));
    }

    private PrescriptionRequestResponseDTO mapToResponse(PrescriptionRequest r) {
        PrescriptionRequestResponseDTO dto = new PrescriptionRequestResponseDTO();
        dto.setId(Long.valueOf(r.getRequestId()));
        dto.setPatientName(r.getPatient().getUser().getFullName());
        dto.setPharmacyName(r.getPharmacy().getName());
        dto.setStatus(String.valueOf(r.getStatus()));
        dto.setPrescriptionNotes(r.getPrescription().getNotes());
        return dto;
    }
}