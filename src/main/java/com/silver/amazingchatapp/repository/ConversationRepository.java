package com.silver.amazingchatapp.repository;

import com.silver.amazingchatapp.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT DISTINCT c FROM Conversation c JOIN c.users u" +
            " WHERE u IN :usernames AND c.isGroup = :isGroup " +
            " GROUP BY c HAVING COUNT(DISTINCT u) = :usersCount")
    Optional<Conversation> findConversationByUsers(Set<String> usernames,
                                                  Long usersCount, boolean isGroup);

    List<Conversation> findByUsersUsername(String userId);

    List<Conversation> findByUsersUsernameAndIsGroup(String username, boolean isGroup);
}
