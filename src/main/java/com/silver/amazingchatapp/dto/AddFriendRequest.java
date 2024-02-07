package com.silver.amazingchatapp.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class AddFriendRequest {
    @NotEmpty
    private String owner;
    @NotEmpty
    private String requestTo;
}
