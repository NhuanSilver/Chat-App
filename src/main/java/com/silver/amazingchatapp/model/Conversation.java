package com.silver.amazingchatapp.model;

import com.silver.amazingchatapp.dto.ChatMessageDTO;
import jakarta.persistence.*;
import lombok.*;

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
    @ManyToMany(mappedBy = "conversations")
    private Set<User> users;
    @OneToMany(mappedBy = "conversation")
    private List<ChatMessage> messages;

    public ChatMessage getLatestMessage() {
        int size = this.getMessages().size();
        return size != 0 ? this.getMessages().get(size - 1) : null;
    }
}