package com.silver.amazingchatapp.dto;

import com.silver.amazingchatapp.model.USER_STATUS;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String username;
    private String fullName;
    private String avatarUrl;
    private String token;
    private USER_STATUS status;
}
