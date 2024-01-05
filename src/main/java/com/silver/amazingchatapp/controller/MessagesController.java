package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import com.silver.amazingchatapp.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessagesController {
    private final ChatMessageService messageService;

    @GetMapping("/conversations/{id}/{usernames}")
    public List<ChatMessageDTO> getChatMessagesByConversationId(@PathVariable Long id, @PathVariable Set<String> usernames) {
        return messageService.getChatMessagesByConversationId(id, usernames);
    }
}
