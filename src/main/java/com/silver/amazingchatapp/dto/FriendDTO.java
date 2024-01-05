package com.silver.amazingchatapp.dto;

import com.silver.amazingchatapp.model.FRIEND_STATUS;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendDTO {
    private Long id;
    private UserDto owner;
    private UserDto requestTo;
    private FRIEND_STATUS status;
}
