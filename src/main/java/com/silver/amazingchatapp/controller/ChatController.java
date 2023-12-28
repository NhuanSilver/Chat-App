package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.model.ChatMessage;
import com.silver.amazingchatapp.service.ChatMessageService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService messageService;

    @MessageMapping("/chat")
    public void chat(@Payload ChatMessage message) {

    }
}
