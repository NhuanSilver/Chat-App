package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.dto.ConversationRequest;
import com.silver.amazingchatapp.service.ConversationService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/conversations")
public class ConversationController {
    private final ConversationService conversationService;

    @GetMapping("/{id}")
    public ConversationDTO getConversionById(@PathVariable Long id) {
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

    @PostMapping("/private")
    public ConversationDTO createPrivateConversation(@RequestBody @NonNull ConversationRequest request) {
       return this.conversationService.createConversation(request);
    }
    @PostMapping("/group")
    public ConversationDTO createGroupConversation(@RequestBody @NonNull ConversationRequest request) {
        return this.conversationService.createConversation(request);
    }
}
