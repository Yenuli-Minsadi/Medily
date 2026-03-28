package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.medical.MedicalRecordRequestDTO;
import com.medily.backend.dto.medical.MedicalRecordResponseDTO;
import com.medily.backend.entity.*;
import com.medily.backend.repository.*;
import com.medily.backend.service.custom.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    public MedicalRecordResponseDTO createRecord(Long doctorUserId, MedicalRecordRequestDTO request) {
        Doctor doctor = doctorRepository.findByUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        MedicalRecord record = new MedicalRecord();
        record.setDoctor(doctor);
        record.setPatient(patient);
        record.setDiagnosis(request.getDiagnosis());
        record.setNotes(request.getNotes());

        return mapToResponse(medicalRecordRepository.save(record));
    }

    @Override
    public List<MedicalRecordResponseDTO> getRecordsByPatient(Long patientUserId) {
        Patient patient = patientRepository.findByUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return medicalRecordRepository.findByPatientId(Long.valueOf(patient.getPatientId()))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private MedicalRecordResponseDTO mapToResponse(MedicalRecord r) {
        MedicalRecordResponseDTO dto = new MedicalRecordResponseDTO();
        dto.setId(Long.valueOf(r.getRecordId()));
        dto.setPatientName(r.getPatient().getUser().getFullName());
        dto.setDoctorName(r.getDoctor().getUser().getFullName());
        dto.setDiagnosis(r.getDiagnosis());
        dto.setNotes(r.getNotes());
        return dto;
    }
}