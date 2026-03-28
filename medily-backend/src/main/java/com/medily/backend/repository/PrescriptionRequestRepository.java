package com.medily.backend.repository;

import com.medily.backend.entity.PrescriptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRequestRepository extends JpaRepository<PrescriptionRequest, Long> {
    List<PrescriptionRequest> findByPatientPatientId(Long patientId);
    List<PrescriptionRequest> findByPharmacyPharmacyId(Long pharmacyId);
    List<PrescriptionRequest> findByPatientPatientIdAndStatus(Long patientId, PrescriptionRequest.Status status);
    List<PrescriptionRequest> findByPharmacyPharmacyIdAndStatus(Long pharmacyId, PrescriptionRequest.Status status);
}