package com.silver.amazingchatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
public class ChatMessageRequest {
    private String conversationId;
    private String senderId;
    private List<String> recipientIds;
    private String content;
}
