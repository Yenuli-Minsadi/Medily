package com.medily.backend.repository;

import com.medily.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    List<Appointment> findByPatientPatientId(Integer patientId);
    List<Appointment> findByDoctorDoctorId(Integer doctorId);
    List<Appointment> findByPatientPatientIdAndStatus(Integer patientId, Appointment.Status status);
    List<Appointment> findByDoctorDoctorIdAndStatus(Integer doctorId, Appointment.Status status);
}