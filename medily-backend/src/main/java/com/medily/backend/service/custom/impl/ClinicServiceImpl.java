package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.clinic.ClinicRequestDTO;
import com.medily.backend.dto.clinic.ClinicResponseDTO;
import com.medily.backend.entity.Clinic;
import com.medily.backend.repository.ClinicRepository;
import com.medily.backend.service.custom.ClinicService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicServiceImpl implements ClinicService {

    private final ClinicRepository clinicRepository;
    private final ModelMapper modelMapper;

    @Override
    public ClinicResponseDTO createClinic(ClinicRequestDTO request) {
        Clinic clinic = modelMapper.map(request, Clinic.class);
        return modelMapper.map(clinicRepository.save(clinic), ClinicResponseDTO.class);
    }

    @Override
    public ClinicResponseDTO updateClinic(Integer id, ClinicRequestDTO request) {
        Clinic existingClinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinic not found with id: " + id));
        modelMapper.map(request, existingClinic);
        Clinic updatedClinic = clinicRepository.save(existingClinic);
        return modelMapper.map(updatedClinic, ClinicResponseDTO.class);
    }

    @Override
    public List<ClinicResponseDTO> getAllClinics() {
        return clinicRepository.findAll()
                .stream()
                .map(clinic -> modelMapper.map(clinic, ClinicResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public ClinicResponseDTO getClinicById(Integer id) {
        Clinic clinic = clinicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Clinic not found"));
        return modelMapper.map(clinic, ClinicResponseDTO.class);
    }

    @Override
    public void deleteClinic(Integer id) {
        if (!clinicRepository.existsById(id)) {
            throw new RuntimeException("Clinic not found");
        }
        clinicRepository.deleteById(id);
    }
}