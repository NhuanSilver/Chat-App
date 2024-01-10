package com.silver.amazingchatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationRequest {
    private String name;
    private List<String> usernames;
    private boolean isGroup;
}
