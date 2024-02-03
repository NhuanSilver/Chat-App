package com.silver.amazingchatapp.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.silver.amazingchatapp.dto.EditMessageRequest;
import com.silver.amazingchatapp.dto.MessageDTO;
import com.silver.amazingchatapp.dto.MessageRequest;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.mapper.MessageMapper;
import com.silver.amazingchatapp.model.ChatMessage;
import com.silver.amazingchatapp.model.Conversation;
import com.silver.amazingchatapp.model.MESSAGE_TYPE;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.ChatMessageRepository;
import com.silver.amazingchatapp.repository.ConversationRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
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
    private final MessageMapper messageMapper;

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

        Conversation conversation = this.conversationRepository.findById(message.getConversationId())
                .orElseThrow(() -> new ApiRequestException("Conversation not found by id: " + message.getConversationId()));

        String contentToSave = message.getContent();
        List<String> imgPathSaved = new ArrayList<>();

        if (message.getContentType().equals("IMG")) {
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
                .contentType(message.getContentType())
                .messageType(MESSAGE_TYPE.CREATE)
                .build();

        sender.getMessages().add(chatMessage);
        conversation.setUpdateAt(chatMessage.getSentAt());
        chatMessageRepository.save(chatMessage);
        userRepository.save(sender);


        // Save and notify to recipients
        for (User recipient : recipients) {
            recipient.getMessages().add(chatMessage);
            userRepository.save(recipient);
            this.notifyMessage(recipient.getUsername(), chatMessage);
        }

        //Notify to sender
        this.notifyMessage(sender.getUsername(), chatMessage);
    }


    public List<MessageDTO> getChatMessagesByConversationId(Long id, String username) {

        List<ChatMessage> messages = this.chatMessageRepository.findByConversationIdAndUsersInOrderBySentAt(id, Set.of(username));
        return messages.stream()
                .map(messageMapper::toDTO)
                .collect(Collectors.toList());

    }


    private void notifyMessage(String destinationUsername, ChatMessage message) {
        messagingTemplate.convertAndSendToUser(
                destinationUsername,
                "/queue/messages",
                messageMapper.toDTO(message)
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
        File dir = new File("upload");
        if (!dir.exists()) {
            boolean isNewFolder = dir.mkdirs();
            if (!isNewFolder) {
                log.error("Error when creating a new folder");
            }
        }

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

    public void deleteMessage(EditMessageRequest request) {
        User user = this.userRepository.findById(request.getUsername()).orElseThrow();
        ChatMessage message = user.getMessages()
                .stream()
                .filter(chatMessage -> chatMessage.getId().equals(request.getMessageId()))
                .findFirst().orElseThrow();
        user.getMessages().remove(message);
        userRepository.saveAndFlush(user);
        message.setMessageType(MESSAGE_TYPE.DELETE);
        notifyMessage(request.getUsername(), message);
    }

    public MessageDTO getLatestMessage(Long id, String username) {
        List<ChatMessage> messages = this.chatMessageRepository.findByConversationIdAndUsersInOrderBySentAt(id, Set.of(username));
        if (messages.isEmpty()) return null;
        return messages
                .stream()
                .skip(messages.size() - 1)
                .findFirst()
                .map(this.messageMapper::toDTO)
                .orElseThrow(null);
    }

    public void recallMessage(EditMessageRequest request) {
        ChatMessage message = this.chatMessageRepository.findById(request.getMessageId()).orElseThrow();

        // User is not sender
        if (!message.isSender(request.getUsername())) return;

        // Update and notify for users
        message.setContent("Recall message");
        message.setMessageType(MESSAGE_TYPE.RECALL);
        message.getUsers().forEach(user -> notifyMessage(user.getUsername(), chatMessageRepository.save(message)));
    }
}
