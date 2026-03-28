package com.medily.backend.repository;

import com.medily.backend.entity.DoctorAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability, Long> {
    List<DoctorAvailability> findByDoctorDoctorId(Integer doctorId);
    List<DoctorAvailability> findByDoctorDoctorIdAndDayOfWeek(Integer doctorId, String dayOfWeek);
}