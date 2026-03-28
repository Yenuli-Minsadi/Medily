package com.medily.backend.repository;

import com.medily.backend.entity.PrescriptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRequestRepository extends JpaRepository<PrescriptionRequest, Long> {
    List<PrescriptionRequest> findByPatientId(Long patientId);
    List<PrescriptionRequest> findByPharmacyId(Long pharmacyId);
    List<PrescriptionRequest> findByPatientIdAndStatus(Long patientId, String status);
    List<PrescriptionRequest> findByPharmacyIdAndStatus(Long pharmacyId, String status);
}