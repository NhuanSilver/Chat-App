package com.silver.amazingchatapp.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ConversationDTO  {
    private Long id;
    private String name;
    private ChatMessageDTO latestMessage;
    private List<UserDto> members;
}
