package com.silver.amazingchatapp.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.silver.amazingchatapp.dto.MessageDTO;
import com.silver.amazingchatapp.model.ChatMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class MessageMapper {
    private final ObjectMapper objectMapper;
    private final Environment environment;
    public MessageDTO toDTO(ChatMessage message) {
       return MessageDTO.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .senderId(message.getSender().getUsername())
                .content(message.getContentType().equals("IMG") ? getImageURI(message.getContent()) : message.getContent()
                )
                .messageType(message.getMessageType())
                .sentAt(message.getSentAt())
                .contentType(message.getContentType())
                .build();
    }
    private String getImageURI(String content) {
        List<String> imgPaths;
        try {
            imgPaths = this.objectMapper.readValue(content, new TypeReference<>() {
            });
            final String serverURI = "http://" + InetAddress.getLocalHost().getHostName() + ":" +
                    this.environment.getProperty("local.server.port") + "/";

            return this.objectMapper.writeValueAsString(imgPaths.stream().map(path -> serverURI + path));
        } catch (Exception e) {
            log.info("can not get server uri");
            return "";
        }

    }
}
