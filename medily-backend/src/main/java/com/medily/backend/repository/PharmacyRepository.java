package com.medily.backend.repository;

import com.medily.backend.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PharmacyRepository extends JpaRepository<Pharmacy, Integer> {
    Optional<Pharmacy> findByUserUserId(Integer userId);
    List<Pharmacy> findByCity(String city);
}