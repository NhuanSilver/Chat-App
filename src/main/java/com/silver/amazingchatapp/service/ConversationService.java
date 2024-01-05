package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.mapper.ConversationDTOMapper;
import com.silver.amazingchatapp.model.Conversation;
import com.silver.amazingchatapp.repository.ConversationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final ConversationDTOMapper conversationDtoMapper;

//    public List<ConversationDTO> getAll() {
//        return null;
//    }

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
        Conversation conversation = this.conversationRepository.findById(id).orElseThrow(null);
        if (conversation == null) return null;
        return this.conversationDtoMapper.conversationDto(conversation);
    }
}
