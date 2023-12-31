package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import com.silver.amazingchatapp.dto.ChatMessageRequest;
import com.silver.amazingchatapp.dto.ConversationDTO;
import com.silver.amazingchatapp.service.ChatMessageService;
import com.silver.amazingchatapp.service.ConversationService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class ChatController {
    private final ChatMessageService messageService;
    private final ConversationService conversationService;

    @MessageMapping("/chat")
    public void chat(@Payload ChatMessageRequest message) {
        this.messageService.saveMessage(message);
    }

    @GetMapping("/conversations/{id}/messages")
    public List<ChatMessageDTO> getChatMessagesByConversationId(@PathVariable String id) {
        return messageService.getChatMessagesByConversationId(id);
    }
    @GetMapping("/conversations/user/{id}")
    public List<ConversationDTO> getAllConversations(@PathVariable String id) {
        return this.conversationService.getConversationByUserId(id);
    }
}
