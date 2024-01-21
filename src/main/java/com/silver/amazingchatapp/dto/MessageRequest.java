package com.silver.amazingchatapp.dto;

import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    private Long conversationId;
    private String senderId;
    private List<String> recipientIds;
    private String content;
    private String contentType;
}
