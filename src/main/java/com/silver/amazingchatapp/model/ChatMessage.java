package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "messages")
public class ChatMessage {
    @Id
    private String id;
    private String senderId;
    private String recipientId;
    private Timestamp sentAt;
    @ManyToOne
    private ChatRoom room;
    @ManyToOne
    private User user;
}
