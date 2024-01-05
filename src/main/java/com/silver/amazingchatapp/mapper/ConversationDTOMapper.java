package com.silver.amazingchatapp.mapper;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.model.Conversation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ConversationDTOMapper {

    public ConversationDTO conversationDto(Conversation conversation) {
        return   ConversationDTO.builder()
                .id(conversation.getId())
                .name(conversation.getName())
                .latestMessage(
                        conversation.getLatestMessage() != null ? ChatMessageDTO.builder()
                                .id(conversation.getLatestMessage().getId())
                                .conversationId(conversation.getId())
                                .content(conversation.getLatestMessage().getContent())
                                .senderId(conversation.getLatestMessage().getSender().getUsername())
                                .sentAt(conversation.getLatestMessage().getSentAt())
                                .build() : null
                )
                .members(conversation.getUsers().stream()
                        .map(
                                conversationUser -> UserDto.builder()
                                        .username(conversationUser.getUsername())
                                        .fullName(conversationUser.getFullName())
                                        .avatarUrl(conversationUser.getAvatarUrl())
                                        .status(conversationUser.getStatus())
                                        .build()
                        )
                        .collect(Collectors.toList())
                )
                .build();
    }
}
