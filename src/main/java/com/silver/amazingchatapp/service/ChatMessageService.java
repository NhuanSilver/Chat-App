package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import com.silver.amazingchatapp.dto.ChatMessageRequest;
import com.silver.amazingchatapp.model.ChatMessage;
import com.silver.amazingchatapp.model.Conversation;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.ChatMessageRepository;
import com.silver.amazingchatapp.repository.ConversationRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ConversationRepository conversationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public void saveMessage(ChatMessageRequest message) {

        User sender = userRepository.findById(message.getSenderId()).orElseThrow();

        Set<User> recipients = message.getRecipientIds().stream()
                .map(
                        recipientId -> userRepository.findById(recipientId).orElseThrow()
                )
                .collect(Collectors.toSet());

        Conversation conversation = this.conversationRepository.findById(message.getConversationId())
                .orElse(Conversation.builder()
                        .id(sender.getUsername())
                        .name( sender.getUsername())
                        .users(recipients)
                        .messages(new ArrayList<>())
                        .build());

        ChatMessage chatMessage = ChatMessage.builder()
                .content(message.getContent())
                .sentAt(new Timestamp(System.currentTimeMillis()))
                .conversation(conversation)
                .sender(sender)
                .build();

        conversation.getMessages().add(chatMessage);
        conversation.getUsers().add(sender);

        sender.getConversations().add(conversation);
        sender.getMessages().add(chatMessage);

        conversationRepository.save(conversation);
        chatMessageRepository.save(chatMessage);
        userRepository.save(sender);

        for ( User recipient : recipients) {
            recipient.getConversations().add(conversation);
            userRepository.save(recipient);
            messagingTemplate.convertAndSendToUser(recipient.getUsername(), "/queue/messages",
                    ChatMessageDTO.builder()
                            .id(chatMessage.getId())
                            .conversationId(conversation.getId())
                            .senderId(chatMessage.getSender().getUsername())
                            .content(chatMessage.getContent())
                            .sentAt(chatMessage.getSentAt())
                            .build()
            );
        }



    }

    public List<ChatMessageDTO> getChatMessagesByConversationId(String id) {
        Conversation conversation = conversationRepository.findById(id).orElseThrow();
        List<ChatMessage> messages = conversation.getMessages();

        return messages.stream()
                .map(m -> ChatMessageDTO.builder()
                        .id(m.getId())
                        .conversationId(conversation.getId())
                        .senderId(m.getSender().getUsername())
                        .content(m.getContent())
                        .sentAt(m.getSentAt())
                        .build())
                .collect(Collectors.toList());
    }
}
