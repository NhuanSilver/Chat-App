package com.silver.amazingchatapp.mapper;

import com.silver.amazingchatapp.dto.MessageDTO;
import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.model.Conversation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ConversationDTOMapper {
    private final UserDTOMapper userDTOMapper;
    public ConversationDTO conversationDto(Conversation conversation) {
        return   ConversationDTO.builder()
                .id(conversation.getId())
                .name(conversation.getName())
                .latestMessage(
                        conversation.getLatestMessage() != null ? MessageDTO.builder()
                                .id(conversation.getLatestMessage().getId())
                                .conversationId(conversation.getId())
                                .content(conversation.getLatestMessage().getContent())
                                .sender(userDTOMapper.toDTO(conversation.getLatestMessage().getSender()))
                                .sentAt(conversation.getLatestMessage().getSentAt())
                                .contentType(conversation.getLatestMessage().getContentType())
                                .build() : null
                )
                .members(conversation.getUsers().stream()
                        .map(userDTOMapper::toDTO)
                        .collect(Collectors.toList())
                )
                .isGroup(conversation.isGroup())
                .createAt(conversation.getCreateAt())
                .updateAt(conversation.getUpdateAt())
                .build();
    }
}
