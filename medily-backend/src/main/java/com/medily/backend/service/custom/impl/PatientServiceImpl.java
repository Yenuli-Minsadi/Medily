package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.patient.PatientRequestDTO;
import com.medily.backend.dto.patient.PatientResponseDTO;
import com.medily.backend.entity.Patient;
import com.medily.backend.entity.User;
import com.medily.backend.repository.PatientRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.PatientService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public PatientResponseDTO completeProfile(Integer userId, PatientRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find existing patient or create new one
        Patient patient = patientRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    Patient p = new Patient();
                    p.setUser(user);
                    return p;
                });

        user.setPhone(request.getContact());
        user.setAddress(request.getAddress());
        userRepository.save(user);

        patient.setDateOfBirth(LocalDate.parse(request.getDateOfBirth()));
        patient.setGender(Patient.Gender.valueOf(request.getGender().toUpperCase()));

        Patient saved = patientRepository.save(patient);
        return mapToResponse(saved);
    }

    @Override
    public PatientResponseDTO getPatientByUserId(Integer userId) {
        Patient patient = patientRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return mapToResponse(patient);
    }

    @Override
    public List<PatientResponseDTO> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PatientResponseDTO mapToResponse(Patient patient) {
        PatientResponseDTO dto = new PatientResponseDTO();
        dto.setId(patient.getPatientId());
        dto.setName(patient.getUser().getFullName());
        dto.setEmail(patient.getUser().getEmail());
        dto.setContact(patient.getUser().getPhone());
        dto.setAddress(patient.getUser().getAddress());
        dto.setDateOfBirth(String.valueOf(patient.getAge()));
//        dto.setBloodGroup(patient.getBloodGroup());
        return dto;
    }
}