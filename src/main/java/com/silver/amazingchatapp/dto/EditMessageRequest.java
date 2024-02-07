package com.silver.amazingchatapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EditMessageRequest {
    @NotEmpty
    private String username;
    @NotEmpty
    private Long messageId;
}
