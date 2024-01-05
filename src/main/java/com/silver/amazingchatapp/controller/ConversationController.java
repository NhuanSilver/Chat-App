package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    @GetMapping("/{id}")
    public ConversationDTO getConversionById(@PathVariable Long id) {
        log.info(id + "");
        return conversationService.getConversationById(id);
    }

    @GetMapping("/users/{id}")
    public List<ConversationDTO> getAllConversationsByUser(@PathVariable String id) {
        return this.conversationService.getConversationByUserId(id);
    }

    @GetMapping("/private/{sender}/{recipient}")
    public ConversationDTO getPrivateConversation(@PathVariable String sender, @PathVariable String recipient) {
        return this.conversationService.getPrivateConversation(sender, recipient);
    }
}
