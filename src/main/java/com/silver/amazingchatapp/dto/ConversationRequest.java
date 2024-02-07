package com.silver.amazingchatapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationRequest {
    @NotEmpty
    private String name;
    @NotEmpty
    private List<String> usernames;
    private boolean isGroup;
}
