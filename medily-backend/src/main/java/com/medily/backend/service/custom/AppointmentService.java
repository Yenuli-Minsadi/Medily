package com.medily.backend.service.custom;

import com.medily.backend.dto.appointment.AppointmentRequestDTO;
import com.medily.backend.dto.appointment.AppointmentResponseDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO bookAppointment(Long patientUserId, AppointmentRequestDTO request);
    List<AppointmentResponseDTO> getAppointmentsByPatient(Long patientUserId);
    List<AppointmentResponseDTO> getAppointmentsByDoctor(Long doctorUserId);
    AppointmentResponseDTO updateStatus(Long appointmentId, String status);
    List<AppointmentResponseDTO> getAllAppointments();
}