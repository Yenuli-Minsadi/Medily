package com.medily.backend.repository;

import com.medily.backend.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {
    List<ChatRoom> findByPatientUserId(Integer patientUserId);
    List<ChatRoom> findByParticipantUserId(Integer participantUserId);
    Optional<ChatRoom> findByPatientUserIdAndParticipantUserId(Integer patientUserId, Integer participantUserId);
}