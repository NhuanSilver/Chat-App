package com.silver.amazingchatapp.model;

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
    private String id;
    private String name;
    @ManyToMany(mappedBy = "conversations")
    private Set<User> users;
    @OneToMany(mappedBy = "conversation")
    private List<ChatMessage> messages;
}
