package com.medily.backend.dto.chat;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Integer chatRoomId;
    private String content;
}
