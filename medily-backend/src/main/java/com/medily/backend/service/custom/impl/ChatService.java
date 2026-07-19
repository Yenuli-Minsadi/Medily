package com.medily.backend.service.custom.impl;

import com.medily.backend.dto.chat.ChatMessageDTO;
import com.medily.backend.dto.chat.ChatRoomDTO;
import com.medily.backend.entity.ChatMessage;
import com.medily.backend.entity.ChatRoom;
import com.medily.backend.entity.User;
import com.medily.backend.repository.ChatMessageRepository;
import com.medily.backend.repository.ChatRoomRepository;
import com.medily.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatRoomDTO createOrGetChatRoom(Integer patientUserId, Integer participantUserId) {
        return chatRoomRepository
            .findByPatientUserIdAndParticipantUserId(patientUserId, participantUserId)
            .map(this::mapRoomToDTO)
            .orElseGet(() -> {
                User patient = userRepository.findById(patientUserId)
                    .orElseThrow(() -> new RuntimeException("Patient not found"));
                User participant = userRepository.findById(participantUserId)
                    .orElseThrow(() -> new RuntimeException("Participant not found"));

                ChatRoom room = new ChatRoom();
                room.setPatient(patient);
                room.setParticipant(participant);
                room.setParticipantRole(participant.getRole());
                return mapRoomToDTO(chatRoomRepository.save(room));
            });
    }

    public List<ChatRoomDTO> getChatRoomsForUser(Integer userId, String role) {
        List<ChatRoom> rooms;
        if (role.equals("PATIENT")) {
            rooms = chatRoomRepository.findByPatientUserId(userId);
        } else {
            rooms = chatRoomRepository.findByParticipantUserId(userId);
        }
        return rooms.stream().map(this::mapRoomToDTO).collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getMessages(Integer chatRoomId, Integer currentUserId) {
        // Mark messages as read
        List<ChatMessage> unread = chatMessageRepository
            .findByChatRoomChatRoomIdAndIsReadFalseAndSenderUserIdNot(
                chatRoomId, currentUserId);
        unread.forEach(m -> m.setIsRead(true));
        chatMessageRepository.saveAll(unread);

        return chatMessageRepository
            .findByChatRoomChatRoomIdOrderBySentAtAsc(chatRoomId)
            .stream().map(this::mapMessageToDTO)
            .collect(Collectors.toList());
    }

    public ChatMessageDTO sendMessage(Integer chatRoomId, Integer senderId, String content) {
        ChatRoom room = chatRoomRepository.findById(chatRoomId)
            .orElseThrow(() -> new RuntimeException("Chat room not found"));
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessage message = new ChatMessage();
        message.setChatRoom(room);
        message.setSender(sender);
        message.setContent(content);
        ChatMessage saved = chatMessageRepository.save(message);

        ChatMessageDTO dto = mapMessageToDTO(saved);

        // Determine recipient and push via WebSocket
        Integer recipientId = room.getPatient().getUserId().equals(senderId)
            ? room.getParticipant().getUserId()
            : room.getPatient().getUserId();

        messagingTemplate.convertAndSendToUser(
            String.valueOf(recipientId),
            "/queue/chat",
            dto
        );

        return dto;
    }

    private ChatRoomDTO mapRoomToDTO(ChatRoom room) {
        List<ChatMessage> messages = chatMessageRepository
            .findByChatRoomChatRoomIdOrderBySentAtAsc(room.getChatRoomId());

        ChatMessage last = messages.isEmpty() ? null : messages.get(messages.size() - 1);

        ChatRoomDTO dto = new ChatRoomDTO();
        dto.setChatRoomId(room.getChatRoomId());
        dto.setPatientId(room.getPatient().getUserId());
        dto.setPatientName(room.getPatient().getFullName());
        dto.setParticipantId(room.getParticipant().getUserId());
        dto.setParticipantName(room.getParticipant().getFullName());
        dto.setParticipantRole(room.getParticipantRole().name());
        dto.setLastMessage(last != null ? last.getContent() : "");
        dto.setLastMessageTime(last != null ? last.getSentAt().toString() : "");
        dto.setUnreadCount(0);
        return dto;
    }

    private ChatMessageDTO mapMessageToDTO(ChatMessage m) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setMessageId(m.getMessageId());
        dto.setChatRoomId(m.getChatRoom().getChatRoomId());
        dto.setSenderId(m.getSender().getUserId());
        dto.setSenderName(m.getSender().getFullName());
        dto.setSenderRole(m.getSender().getRole().name());
        dto.setContent(m.getContent());
        dto.setIsRead(m.getIsRead());
        dto.setSentAt(m.getSentAt().toString());
        return dto;
    }
}