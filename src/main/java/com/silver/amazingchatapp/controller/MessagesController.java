package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.EditMessageRequest;
import com.silver.amazingchatapp.dto.MessageDTO;
import com.silver.amazingchatapp.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessagesController {
    private final ChatMessageService messageService;

    @GetMapping("/conversations/{id}/{username}")
    public List<MessageDTO> getChatMessagesByConversationId(@PathVariable Long id, @PathVariable String username) {
        return messageService.getChatMessagesByConversationId(id, username);
    }
    @GetMapping("/conversation/{id}/users/{username}/latest")
    public MessageDTO getLatestMessage(@PathVariable Long id, @PathVariable String username) {
        return this.messageService.getLatestMessage(id, username);
    }

    @MessageMapping("/user.DeleteMessage")
    public void deleteMessage (@Payload EditMessageRequest request) {
        messageService.deleteMessage(request);
    }

    @MessageMapping("/user.RecallMessage")
    public void recallMessage(@Payload EditMessageRequest request) {
        messageService.recallMessage(request);
    }
}
