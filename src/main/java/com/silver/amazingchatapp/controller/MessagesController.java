package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.DeleteMessageRequest;
import com.silver.amazingchatapp.dto.MessageDTO;
import com.silver.amazingchatapp.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessagesController {
    private final ChatMessageService messageService;

    @GetMapping("/conversations/{id}/{username}")
    public List<MessageDTO> getChatMessagesByConversationId(@PathVariable Long id, @PathVariable String username) {
        return messageService.getChatMessagesByConversationId(id, username);
    }

    @MessageMapping("/user.DeleteMessage")
    public void deleteMessage (@Payload DeleteMessageRequest request) {
        messageService.deleteMessage(request);
    }
}
