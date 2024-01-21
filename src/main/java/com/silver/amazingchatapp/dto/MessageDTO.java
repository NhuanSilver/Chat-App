package com.silver.amazingchatapp.dto;

import com.silver.amazingchatapp.model.MESSAGE_TYPE;
import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;
@Data
@Builder
public class MessageDTO {
    private Long id;
    private Long conversationId;
    private String senderId;
    private String content;
    private Timestamp sentAt;
    private String contentType;
    private MESSAGE_TYPE messageType;
}
