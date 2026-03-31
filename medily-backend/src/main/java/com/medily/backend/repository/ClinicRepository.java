package com.medily.backend.repository;

import com.medily.backend.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
    List<Clinic> findByCity(String city);
}