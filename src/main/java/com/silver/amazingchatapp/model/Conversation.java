package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private boolean isGroup;
    @ManyToMany(mappedBy = "conversations")
    private Set<User> users;
    @OneToMany(mappedBy = "conversation")
    private List<ChatMessage> messages;
    @CreationTimestamp
    private Timestamp createAt;
    @CreationTimestamp
    private Timestamp updateAt;

    public ChatMessage getLatestMessage() {
        int size = this.getMessages().size();
        return size != 0 ? this.getMessages().get(size - 1) : null;
    }
}