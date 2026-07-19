package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.prescription.PrescriptionItemResponseDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestCreateDTO;
import com.medily.backend.dto.prescriptionrequest.PrescriptionRequestResponseDTO;
import com.medily.backend.entity.*;
import com.medily.backend.repository.*;
import com.medily.backend.service.custom.NotificationService;
import com.medily.backend.service.custom.PrescriptionRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionRequestServiceImpl implements PrescriptionRequestService {

    private final PrescriptionRequestRepository prescriptionRequestRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final PharmacyRepository pharmacyRepository;
    private final NotificationService notificationService;


    @Override
    public PrescriptionRequestResponseDTO sendRequest(Integer patientUserId, PrescriptionRequestCreateDTO request) {
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
    public List<PrescriptionRequestResponseDTO> getRequestsByPatient(Integer patientUserId) {
        Patient patient = patientRepository.findByUserUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return prescriptionRequestRepository.findByPatientPatientId(patient.getPatientId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionRequestResponseDTO> getRequestsByPharmacy(Integer pharmacyUserId) {
        Pharmacy pharmacy = pharmacyRepository.findByUserUserId(pharmacyUserId)
                .orElseThrow(() -> new RuntimeException("Pharmacy profile not found"));
        return prescriptionRequestRepository.findByPharmacyPharmacyId(pharmacy.getPharmacyId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PrescriptionRequestResponseDTO updateStatus(Integer requestId, String status) {
        PrescriptionRequest request = prescriptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(PrescriptionRequest.Status.valueOf(status));
        PrescriptionRequest saved = prescriptionRequestRepository.save(request);


        // Send notification to patient
        String pharmacyName = saved.getPharmacy().getName();
        String message;
        String type;

        if (status.equals("AVAILABLE")) {
            message = "✅ " + pharmacyName + " has your prescription ready for pickup!";
            type = "PRESCRIPTION_ACCEPTED";
        } else if (status.equals("NOT_AVAILABLE")) {
            message = "❌ " + pharmacyName + " cannot fulfill your prescription request.";
            type = "PRESCRIPTION_REJECTED";
        } else {
            message = "Your prescription request status has been updated to " + status;
            type = "PRESCRIPTION_UPDATE";
        }

        notificationService.createNotification(
                saved.getPatient().getUser().getUserId(),
                message,
                type
        );

        return mapToResponse(saved);
    }

    private PrescriptionRequestResponseDTO mapToResponse(PrescriptionRequest r) {
//        PrescriptionRequestResponseDTO dto = new PrescriptionRequestResponseDTO();
//        dto.setId(r.getRequestId());
//        dto.setPatientName(r.getPatient().getUser().getFullName());
//        dto.setPharmacyName(r.getPharmacy().getName());
//        dto.setStatus(String.valueOf(r.getStatus()));
//        dto.setPrescriptionNotes(r.getPrescription().getNotes());
//        return dto;
        PrescriptionRequestResponseDTO dto = new PrescriptionRequestResponseDTO();
        dto.setId(r.getRequestId());
        dto.setPrescriptionId(r.getPrescription().getPrescriptionId());
        dto.setPatientName(r.getPatient().getUser().getFullName());
        dto.setPharmacyName(r.getPharmacy().getName());
        dto.setStatus(r.getStatus().name());
//        dto.setNote(r.getNote());
        dto.setRequestedAt(r.getRequestedAt() != null ? r.getRequestedAt().toString() : null);
        dto.setDoctorName(r.getPrescription().getDoctor().getUser().getFullName());
        dto.setIssuedDate(r.getPrescription().getIssuedDate() != null ? r.getPrescription().getIssuedDate() : null);

        if (r.getPrescription().getItems() != null) {
            dto.setItems(r.getPrescription().getItems().stream().map(item -> {
                PrescriptionItemResponseDTO itemDTO = new PrescriptionItemResponseDTO();
                itemDTO.setId(item.getItemId());
                itemDTO.setMedicineName(item.getMedicineName());
                itemDTO.setDosage(item.getDosage());
                itemDTO.setDuration(item.getDuration());
                return itemDTO;
            }).collect(Collectors.toList()));
        }
        return dto;
    }

    @Override
    public void respondToRequest(Integer requestId, boolean available) {

        PrescriptionRequest req = prescriptionRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        req.setRespondedAt(LocalDateTime.now());

        req.setStatus(available
                ? PrescriptionRequest.Status.AVAILABLE
                : PrescriptionRequest.Status.NOT_AVAILABLE);

        prescriptionRequestRepository.save(req);
    }
}
