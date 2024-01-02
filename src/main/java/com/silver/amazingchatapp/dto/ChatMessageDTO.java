package com.silver.amazingchatapp.dto;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class ChatMessageDTO {
    private Long id;
    private Long conversationId;
    private String senderId;
    private String content;
    private Timestamp sentAt;
}
