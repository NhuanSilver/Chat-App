package com.silver.amazingchatapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    private Long conversationId;
    @NotEmpty
    private String senderId;
    @NotEmpty
    private List<String> recipientIds;
    @NotEmpty
    private String content;
    @NotEmpty
    private String contentType;
}
