package com.medily.backend.repository;

import com.medily.backend.entity.PrescriptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRequestRepository extends JpaRepository<PrescriptionRequest, Integer> {
    List<PrescriptionRequest> findByPatientPatientId(Integer patientId);
    List<PrescriptionRequest> findByPharmacyPharmacyId(Integer pharmacyId);
    List<PrescriptionRequest> findByPatientPatientIdAndStatus(Integer patientId, PrescriptionRequest.Status status);
    List<PrescriptionRequest> findByPharmacyPharmacyIdAndStatus(Integer pharmacyId, PrescriptionRequest.Status status);
}