package com.silver.amazingchatapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteMessageRequest {
    private String username;
    private Long messageId;
}
