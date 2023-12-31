package com.silver.amazingchatapp.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ConversationDTO  {
    private String id;
    private String name;
    private List<UserDto> members;
}
