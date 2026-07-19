package com.medily.backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// dto/chat/ChatMessageDTO.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDTO {
    private Integer messageId;
    private Integer chatRoomId;
    private Integer senderId;
    private String senderName;
    private String senderRole;
    private String content;
    private Boolean isRead;
    private String sentAt;
}
