package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.ConversationRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    public List<ConversationDTO> getAll() {
        return null;
    }

    public List<ConversationDTO> getConversationByUserId(String userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return user.getConversations().stream()
                .map(conversation -> ConversationDTO.builder()
                        .id(conversation.getId())
                        .name(conversation.getName())
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
                        .build()
                ).toList();
    }
}
