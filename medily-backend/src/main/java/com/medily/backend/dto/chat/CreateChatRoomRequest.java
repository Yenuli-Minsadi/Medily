package com.medily.backend.dto.chat;

import lombok.Data;

@Data
public class CreateChatRoomRequest {
    private Integer patientId;
    private Integer participantId;
}
