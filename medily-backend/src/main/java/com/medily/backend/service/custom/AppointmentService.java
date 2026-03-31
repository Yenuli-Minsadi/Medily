package com.medily.backend.service.custom;

import com.medily.backend.dto.appointment.AppointmentRequestDTO;
import com.medily.backend.dto.appointment.AppointmentResponseDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO bookAppointment(Integer patientUserId, AppointmentRequestDTO request);
    List<AppointmentResponseDTO> getAppointmentsByPatient(Integer patientUserId);
    List<AppointmentResponseDTO> getAppointmentsByDoctor(Integer doctorUserId);
    AppointmentResponseDTO updateStatus(Integer appointmentId, String status);
    List<AppointmentResponseDTO> getAllAppointments();
}