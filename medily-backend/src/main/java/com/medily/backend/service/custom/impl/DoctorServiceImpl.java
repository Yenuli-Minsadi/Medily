package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.doctor.DoctorRequestDTO;
import com.medily.backend.dto.doctor.DoctorResponseDTO;
import com.medily.backend.entity.Clinic;
import com.medily.backend.entity.Doctor;
import com.medily.backend.entity.User;
import com.medily.backend.repository.ClinicRepository;
import com.medily.backend.repository.DoctorRepository;
import com.medily.backend.repository.UserRepository;
import com.medily.backend.service.custom.DoctorService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final ClinicRepository clinicRepository;
    private final ModelMapper modelMapper;

    @Override
    public DoctorResponseDTO completeProfile(Integer userId, DoctorRequestDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Clinic clinic = clinicRepository.findById(request.getClinicId())
                .orElseThrow(() -> new RuntimeException("Clinic not found"));

        Doctor doctor = new Doctor();
        doctor.setUser(user);
        doctor.setSpecialization(request.getSpecialization());
        doctor.setLicenseNumber(request.getLicenseNumber());
        doctor.setClinic(clinic);

        Doctor saved = doctorRepository.save(doctor);
        return mapToResponse(saved);
    }

    @Override
    public DoctorResponseDTO getDoctorByUserId(Integer userId) {
        Doctor doctor = doctorRepository.findByUserUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return mapToResponse(doctor);
    }

    @Override
    public List<DoctorResponseDTO> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponseDTO mapToResponse(Doctor doctor) {
        DoctorResponseDTO dto = new DoctorResponseDTO();
        dto.setId(doctor.getDoctorId());
        dto.setName(doctor.getUser().getFullName());
        dto.setEmail(doctor.getUser().getEmail());
        dto.setSpecialization(doctor.getSpecialization());
        dto.setLicenseNumber(doctor.getLicenseNumber());
        dto.setClinicName(doctor.getClinic().getName());
        dto.setClinicCity(doctor.getClinic().getCity());
        return dto;
    }
}