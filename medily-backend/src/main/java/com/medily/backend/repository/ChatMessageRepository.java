package com.medily.backend.repository;

import com.medily.backend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findByChatRoomChatRoomIdOrderBySentAtAsc(Integer chatRoomId);
    Integer countByChatRoomChatRoomIdAndIsReadFalseAndSenderUserIdNot(
        Integer chatRoomId, Integer senderId);
    List<ChatMessage> findByChatRoomChatRoomIdAndIsReadFalseAndSenderUserIdNot(
        Integer chatRoomId, Integer senderId);
}