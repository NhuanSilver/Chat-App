package com.silver.amazingchatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class ChatMessageRequest {
    private String senderId;
    private String recipientId;
    private String content;
}
