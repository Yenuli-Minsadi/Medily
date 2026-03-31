package com.medily.backend.repository;

import com.medily.backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserUserId(Integer userId);
    List<Notification> findByUserUserIdAndIsRead(Integer userId, boolean isRead);
}