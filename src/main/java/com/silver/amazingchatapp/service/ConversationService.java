package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.dto.ConversationRequest;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.mapper.ConversationDTOMapper;
import com.silver.amazingchatapp.model.Conversation;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.ConversationRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final ConversationDTOMapper conversationDtoMapper;

    public List<ConversationDTO> getConversationByUserId(String userId) {
        return this.conversationRepository.findByUsersUsername(userId).stream()
                .map(this.conversationDtoMapper::conversationDto).toList();
    }

    public ConversationDTO getPrivateConversation(String sender, String recipient) {

        Conversation conversation = this.conversationRepository
                .findConversationByUsers(Set.of(sender, recipient),  2L, false).orElse(null);
        if (conversation == null) return null;
        return this.conversationDtoMapper.conversationDto(conversation);
    }

    public ConversationDTO getConversationById(Long id) {
        Conversation conversation = this.conversationRepository.findById(id).orElse(null);
        if (conversation == null) return null;
        return this.conversationDtoMapper.conversationDto(conversation);
    }

    public ConversationDTO  createConversation(ConversationRequest request) {
        Set<User> users = request.getUsernames().stream().map(u -> this.userRepository.findById(u)
                .orElseThrow(() -> new ApiRequestException("User not found"))).collect(Collectors.toSet());
        Conversation conversation = Conversation.builder()
                .name(request.getName())
                .users(users)
                .isGroup(request.isGroup())
                .messages(new ArrayList<>())
                .build();
        users.forEach(user -> user.getConversations().add(conversation));
        Conversation savedConversation = this.conversationRepository.save(conversation);
        this.conversationRepository.flush();
        return this.conversationDtoMapper.conversationDto(savedConversation);
    }
}
