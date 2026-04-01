package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.clinic.ClinicRequestDTO;
import com.medily.backend.dto.clinic.ClinicResponseDTO;
import com.medily.backend.dto.prescription.*;
import com.medily.backend.entity.*;
import com.medily.backend.repository.*;
import com.medily.backend.service.custom.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ModelMapper modelMapper;

    @Override
    public PrescriptionResponseDTO createPrescription(Integer doctorUserId, PrescriptionCreateRequestDTO request) {
        Doctor doctor = doctorRepository.findByUserUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Prescription prescription = new Prescription();
        prescription.setDoctor(doctor);
        prescription.setPatient(patient);
        prescription.setAppointment(appointment);
        prescription.setNotes(request.getNotes());

        Prescription saved = prescriptionRepository.save(prescription);

        // Save each item linked to the prescription
        List<PrescriptionItem> items = request.getItems().stream().map(itemDTO -> {
            PrescriptionItem item = new PrescriptionItem();
            item.setPrescription(saved);
            item.setMedicineName(itemDTO.getMedicineName());
            item.setDosage(itemDTO.getDosage());
            item.setDuration(itemDTO.getDuration());
//            item.setInstructions(itemDTO.getInstructions());
            return item;
        }).collect(Collectors.toList());

        prescriptionItemRepository.saveAll(items);
        saved.setItems(items);

        return mapToResponse(saved);
    }

    @Override
    public PrescriptionResponseDTO updatePrescription(Integer id, PrescriptionCreateRequestDTO request) {
        Prescription existingPrescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        modelMapper.map(request, existingPrescription);
        Prescription updatePrescription = prescriptionRepository.save(existingPrescription);
        return modelMapper.map(updatePrescription, PrescriptionResponseDTO.class);
    }

    @Override
    public List<PrescriptionResponseDTO> getPrescriptionsByPatient(Integer patientUserId) {
        Patient patient = patientRepository.findByUserUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return prescriptionRepository.findByPatientPatientId(patient.getPatientId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionResponseDTO> getPrescriptionsByDoctor(Integer doctorUserId) {
        Doctor doctor = doctorRepository.findByUserUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return prescriptionRepository.findByDoctorDoctorId(doctor.getDoctorId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public PrescriptionResponseDTO getPrescriptionById(Integer id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found"));
        return mapToResponse(prescription);
    }

    private PrescriptionResponseDTO mapToResponse(Prescription p) {
        PrescriptionResponseDTO dto = new PrescriptionResponseDTO();
        dto.setId(p.getPrescriptionId());
        dto.setDoctorName(p.getDoctor().getUser().getFullName());
        dto.setPatientName(p.getPatient().getUser().getFullName());
        dto.setNotes(p.getNotes());

        List<PrescriptionItemResponseDTO> itemDTOs = p.getItems().stream().map(item -> {
            PrescriptionItemResponseDTO itemDTO = new PrescriptionItemResponseDTO();
            itemDTO.setId(item.getItemId());
            itemDTO.setMedicineName(item.getMedicineName());
            itemDTO.setDosage(item.getDosage());
            itemDTO.setDuration(item.getDuration());
//            itemDTO.setInstructions(item.getInstructions());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}