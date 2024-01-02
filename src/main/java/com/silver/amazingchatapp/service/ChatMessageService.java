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
import java.util.HashSet;
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

        // Get recipients
        Set<User> recipients = message.getRecipientIds().stream()
                .map(recipientId -> userRepository.findById(recipientId).orElseThrow())
                .collect(Collectors.toSet());

        // Get conversation or create new
        Conversation conversation = this.conversationRepository.findById(message.getConversationId())
                .orElse(Conversation.builder()
                        .name( sender.getUsername())
                        .users(recipients)
                        .messages(new ArrayList<>())
                        .build());

        // Create new message
        ChatMessage chatMessage = ChatMessage.builder()
                .content(message.getContent())
                .sentAt(new Timestamp(System.currentTimeMillis()))
                .sender(sender)
                .users(new HashSet<>())
                .conversation(conversation)
                .build();

        chatMessage.getUsers().add(sender);
        chatMessage.getUsers().addAll(recipients);

        sender.getConversations().add(conversation);
        sender.getMessages().add(chatMessage);

        conversationRepository.save(conversation);
        chatMessageRepository.save(chatMessage);
        userRepository.save(sender);

        // Save and notify to recipients
        for ( User recipient : recipients) {
            recipient.getConversations().add(conversation);
            userRepository.save(recipient);
            this.notifyMessage(recipient.getUsername(), conversation.getId(), chatMessage);
        }

        //Notify to sender
        this.notifyMessage(sender.getUsername(), conversation.getId(), chatMessage);
    }

    public List<ChatMessageDTO> getChatMessagesByConversationId(Long id, Set<String> usernames) {
        Set<User> users = usernames.stream().map(username -> this.userRepository.findById(username).orElseThrow()).collect(Collectors.toSet());

        List<ChatMessage> messages = this.chatMessageRepository.findByConversationIdAndUsersIn(id, usernames);


        return messages.stream()
                .map(m -> ChatMessageDTO.builder()
                        .id(m.getId())
                        .conversationId(messages.get(0).getConversation().getId())
                        .senderId(m.getSender().getUsername())
                        .content(m.getContent())
                        .sentAt(m.getSentAt())
                        .build())
                .collect(Collectors.toList());
    }

    private void notifyMessage(String destinationUsername, Long conversationID ,ChatMessage chatMessage) {
        messagingTemplate.convertAndSendToUser(destinationUsername, "/queue/messages",
                ChatMessageDTO.builder()
                        .id(chatMessage.getId())
                        .conversationId(conversationID)
                        .senderId(chatMessage.getSender().getUsername())
                        .content(chatMessage.getContent())
                        .sentAt(chatMessage.getSentAt())
                        .build()
        );
    }
}
