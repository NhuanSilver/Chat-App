package com.silver.amazingchatapp.dto;

import lombok.Data;

@Data
public class AddFriendRequest {
    private String owner;
    private String requestTo;
}
