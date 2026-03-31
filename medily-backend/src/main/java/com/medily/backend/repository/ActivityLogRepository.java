package com.medily.backend.repository;

import com.medily.backend.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Integer> {
    List<ActivityLog> findByUserUserId(Integer userId);
    List<ActivityLog> findTop20ByOrderByTimestampDesc();
}