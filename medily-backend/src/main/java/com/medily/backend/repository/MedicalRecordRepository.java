package com.medily.backend.repository;

import com.medily.backend.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Integer> {
    List<MedicalRecord> findByPatientPatientId(Integer patientId);
    List<MedicalRecord> findByDoctorDoctorId(Integer doctorId);
}