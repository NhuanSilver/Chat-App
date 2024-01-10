package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.MessageRequest;
import com.silver.amazingchatapp.service.ChatMessageService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@AllArgsConstructor
@Controller
@Slf4j
public class ChatController {
    private final ChatMessageService messageService;

    @MessageMapping("/chat")
    public void chat(@Payload @NonNull MessageRequest request) {
        this.messageService.saveMessage(request);
    }

    @MessageMapping("/binary")
    public void test(@Payload byte[] img) throws IOException {
//        log.info(String.valueOf(img.length));

    }

}
