package com.medily.backend.repository;

import com.medily.backend.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserUserId(Long userId);
    List<Doctor> findBySpecialization(String specialization);
    List<Doctor> findByClinicClinicId(Long clinicId);
}