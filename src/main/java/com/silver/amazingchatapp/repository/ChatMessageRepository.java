package com.silver.amazingchatapp.repository;

import com.silver.amazingchatapp.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;


@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    List<ChatMessage> findByConversationIdAndUsersIn(Long conversation_id, Set<String> users);
}
