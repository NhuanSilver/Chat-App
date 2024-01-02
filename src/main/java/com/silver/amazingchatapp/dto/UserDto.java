package com.silver.amazingchatapp.dto;

import com.silver.amazingchatapp.model.USER_STATUS;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private String username;
    private String fullName;
    private String avatarUrl;
    private USER_STATUS status;
}
