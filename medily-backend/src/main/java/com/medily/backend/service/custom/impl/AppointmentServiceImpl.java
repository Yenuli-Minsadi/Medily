package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.appointment.AppointmentRequestDTO;
import com.medily.backend.dto.appointment.AppointmentResponseDTO;
import com.medily.backend.dto.doctor.DoctorSummaryDTO;
import com.medily.backend.entity.Appointment;
import com.medily.backend.entity.Doctor;
import com.medily.backend.entity.Patient;
import com.medily.backend.repository.AppointmentRepository;
import com.medily.backend.repository.DoctorRepository;
import com.medily.backend.repository.PatientRepository;
import com.medily.backend.service.custom.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    public AppointmentResponseDTO bookAppointment(Long patientUserId, AppointmentRequestDTO request) {
        Patient patient = patientRepository.findByUserUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(LocalDate.parse(request.getDate()));
        appointment.setAppointmentTime(LocalTime.parse(request.getTime()));
        appointment.setNotes(request.getNotes());
        appointment.setStatus(Appointment.Status.valueOf("PENDING"));

        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientUserId) {
        Patient patient = patientRepository.findByUserUserId(patientUserId)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));
        return appointmentRepository.findByPatientPatientId(patient.getPatientId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorUserId) {
        Doctor doctor = doctorRepository.findByUserUserId(doctorUserId)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));
        return appointmentRepository.findByDoctorDoctorId(doctor.getDoctorId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public AppointmentResponseDTO updateStatus(Long appointmentId, String status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appointment.setStatus(Appointment.Status.valueOf(status));
        return mapToResponse(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentResponseDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private AppointmentResponseDTO mapToResponse(Appointment a) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(Long.valueOf(a.getAppointmentId()));
        dto.setDate(String.valueOf(a.getAppointmentDate()));
        dto.setTime(String.valueOf(a.getAppointmentTime()));
        dto.setStatus(String.valueOf(a.getStatus()));
        dto.setNotes(a.getNotes());
        dto.setPatientName(a.getPatient().getUser().getFullName());
        dto.setClinicName(a.getDoctor().getClinic().getName());

        DoctorSummaryDTO doctorSummary = new DoctorSummaryDTO();
        doctorSummary.setId(Long.valueOf(a.getDoctor().getDoctorId()));
        doctorSummary.setName(a.getDoctor().getUser().getFullName());
        doctorSummary.setSpecialization(a.getDoctor().getSpecialization());
        dto.setDoctor(doctorSummary);

        return dto;
    }
}