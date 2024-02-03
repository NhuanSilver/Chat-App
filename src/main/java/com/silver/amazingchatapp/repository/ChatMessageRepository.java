package com.silver.amazingchatapp.repository;

import com.silver.amazingchatapp.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;


@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    List<ChatMessage> findByConversationIdAndUsersInOrderBySentAt(Long conversation_id, Set<String> users);
}
