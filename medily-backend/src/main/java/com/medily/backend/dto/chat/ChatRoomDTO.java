package com.medily.backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoomDTO {
    private Integer chatRoomId;
    private Integer patientId;
    private String patientName;
    private Integer participantId;
    private String participantName;
    private String participantRole;
    private String lastMessage;
    private String lastMessageTime;
    private Integer unreadCount;
}
