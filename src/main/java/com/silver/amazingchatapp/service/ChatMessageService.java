package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import com.silver.amazingchatapp.dto.ChatMessageRequest;
import com.silver.amazingchatapp.model.ChatMessage;
import com.silver.amazingchatapp.model.ChatRoom;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.ChatMessageRepository;
import com.silver.amazingchatapp.repository.ChatRoomRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public void saveMessage(ChatMessageRequest message) {

        User sender = userRepository.findById(message.getSenderId()).orElseThrow();
        User recipient = userRepository.findById(message.getRecipientId()).orElseThrow();

        ChatRoom chatRoom = this.chatRoomRepository.findById(message.getSenderId() + message.getRecipientId())
                .orElse(ChatRoom.builder()
                        .id(message.getSenderId() + message.getRecipientId())
                        .name(message.getRecipientId())
                        .users(List.of(sender, recipient))
                        .messages(new ArrayList<>())
                        .build());

        ChatMessage chatMessage = ChatMessage.builder()
                .content(message.getContent())
                .user(sender)
                .sentAt(new Timestamp(System.currentTimeMillis()))
                .room(chatRoom)
                .recipientId(recipient.getUsername())
                .senderId(sender.getUsername())
                .build();

        chatRoom.getMessages().add(chatMessage);

        chatRoomRepository.save(chatRoom);
        chatMessageRepository.save(chatMessage);

        messagingTemplate.convertAndSendToUser("nhuan", "/queue/messages",
                ChatMessageDTO.builder()
                        .id(chatMessage.getId())
                        .senderId(chatMessage.getSenderId())
                        .recipientId(chatMessage.getRecipientId())
                        .content(chatMessage.getContent())
                        .sentAt(chatMessage.getSentAt())
                        .build()
        );

    }
}
