package com.medily.backend.dto.appointment;

import com.medily.backend.dto.doctor.DoctorSummaryDTO;
import lombok.Data;

@Data
public class AppointmentResponseDTO {
    private Integer id;
    private DoctorSummaryDTO doctor;
    private String patientName;
    private String clinicName;
    private String date;
    private String time;
    private String status;
    private String notes;
}