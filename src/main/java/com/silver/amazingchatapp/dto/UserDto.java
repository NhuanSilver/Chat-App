package com.silver.amazingchatapp.dto;

import com.silver.amazingchatapp.model.Status;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private String username;
    private String fullName;
    private String avatarUrl;
    private Status status;
}
