package com.medily.backend.dto.appointment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequestDTO {
    @NotNull
    private Integer doctorId;
    @NotNull
    private String date;// yyyy-MM-dd
    @NotNull
    private String time;// HH:mm
    private String notes;
}