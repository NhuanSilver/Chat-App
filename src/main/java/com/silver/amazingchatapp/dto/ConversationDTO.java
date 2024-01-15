package com.silver.amazingchatapp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationDTO  {
    private Long id;
    private String name;
    private MessageDTO latestMessage;
    private List<UserDto> members;
    private boolean isGroup;
    private Timestamp createAt;
    private Timestamp updateAt;
}
