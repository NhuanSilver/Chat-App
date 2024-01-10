package com.silver.amazingchatapp.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.silver.amazingchatapp.dto.MessageDTO;
import com.silver.amazingchatapp.dto.MessageRequest;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.model.ChatMessage;
import com.silver.amazingchatapp.model.Conversation;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.ChatMessageRepository;
import com.silver.amazingchatapp.repository.ConversationRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.InetAddress;
import java.sql.Timestamp;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final Environment environment;

    @Transactional
    public void saveMessage(MessageRequest message) {
        User sender = userRepository.findById(message.getSenderId())
                .orElseThrow(() -> new ApiRequestException("Sender doesn't exist"));

        // Get recipients
        Set<User> recipients = message.getRecipientIds().stream()
                .map(recipientId -> userRepository.findById(recipientId)
                        .orElseThrow(() -> new ApiRequestException("Recipient doesn't exist by id: " + recipientId))
                )
                .collect(Collectors.toSet());

        Conversation  conversation = this.conversationRepository.findById(message.getConversationId())
                .orElseThrow(() -> new ApiRequestException("Conversation not found by id: " + message.getConversationId()));

        String contentToSave = message.getContent();
        List<String> imgPathSaved = new ArrayList<>();

        if (message.getType().equals("IMG")) {
            List<String> base64Img;
            try {
                base64Img = objectMapper.readValue(message.getContent(), new TypeReference<>() {
                });
                for (String imgString : base64Img) {
                    imgPathSaved.add(this.processImage(imgString));
                }

                contentToSave = objectMapper.writeValueAsString(imgPathSaved);
            } catch (Exception e) {
                log.error("some thing went wrong");
            }
        }

        // Create new message
        ChatMessage chatMessage = ChatMessage.builder()
                .content(contentToSave)
                .sentAt(new Timestamp(System.currentTimeMillis()))
                .sender(sender)
                .users(recipients)
                .conversation(conversation)
                .type(message.getType())
                .build();

        sender.getMessages().add(chatMessage);

        chatMessageRepository.save(chatMessage);
        userRepository.save(sender);


        // Save and notify to recipients
        for (User recipient : recipients) {
            userRepository.save(recipient);
            this.notifyMessage(recipient.getUsername(), conversation.getId(), chatMessage);
        }

        //Notify to sender
        this.notifyMessage(sender.getUsername(), conversation.getId(), chatMessage);
    }


    public List<MessageDTO> getChatMessagesByConversationId(Long id, Set<String> usernames) {

        List<ChatMessage> messages = this.chatMessageRepository.findByConversationIdAndUsersIn(id, usernames);
        return messages.stream()
                .map(m -> MessageDTO.builder()
                        .id(m.getId())
                        .conversationId(messages.get(0).getConversation().getId())
                        .senderId(m.getSender().getUsername())
                        .content(m.getType().equals("IMG") ? getImageURI(m.getContent()) : m.getContent()
                        )
                        .sentAt(m.getSentAt())
                        .type(m.getType())
                        .build())
                .collect(Collectors.toList());

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

    private void notifyMessage(String destinationUsername, Long conversationID, ChatMessage message) {
        messagingTemplate.convertAndSendToUser(destinationUsername, "/queue/messages",
                MessageDTO.builder()
                        .id(conversationID)
                        .conversationId(message.getConversation().getId())
                        .senderId(message.getSender().getUsername())
                        .content(message.getType().equals("IMG") ? getImageURI(message.getContent()) : message.getContent()
                        )
                        .sentAt(message.getSentAt())
                        .type(message.getType())
                        .build()
        );
    }

    private byte[] getImagByte(String content) {
        String base64Image = content.split(",")[1];
        return Base64.getDecoder().decode(base64Image);
    }

    private String getImgExt(String content) {

        int startIndex = content.indexOf("/");

        int endIndex = content.indexOf(";");

        if (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
            return content.substring(startIndex + 1, endIndex);
        }
        return "";
    }

    private String saveImage(byte[] imgByte, String ext) {
        String path = "upload/" + UUID.nameUUIDFromBytes(imgByte) + "." + ext;
        File file = new File(path);
        try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
            outputStream.write(imgByte);
        } catch (IOException e) {
            log.info("Error when saving image");
        }
        return path;
    }

    private String processImage(String content) {
        String imgExt = this.getImgExt(content);
        byte[] imgByte = this.getImagByte(content);
        return this.saveImage(imgByte, imgExt);
    }

}
