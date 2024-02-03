package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private Timestamp sentAt;
    private String contentType;
    private MESSAGE_TYPE messageType;
    @ManyToOne
    private User sender;
    @ManyToOne
    private Conversation conversation;
    @ManyToMany(mappedBy = "messages", fetch = FetchType.EAGER)
    private Set<User> users = new HashSet<>();

    public boolean isSender(String username) {
        return this.sender.getUsername().equals(username);
    }
}
