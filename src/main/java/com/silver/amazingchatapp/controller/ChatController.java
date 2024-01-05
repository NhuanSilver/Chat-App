package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.ChatMessageRequest;
import com.silver.amazingchatapp.service.ChatMessageService;
import lombok.AllArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@AllArgsConstructor
@Controller
public class ChatController {
    private final ChatMessageService messageService;

    @MessageMapping("/chat")
    public void chat(@Payload ChatMessageRequest message) {
        this.messageService.saveMessage(message);
    }

}
