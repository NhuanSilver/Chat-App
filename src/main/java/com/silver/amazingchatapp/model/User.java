package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    private String username;
    private String password;
    private String fullName;
    private String avatarUrl;
    private Status status;
    @ManyToMany
    private Set<Conversation> conversations;
    @OneToMany(mappedBy = "sender")
    private List<ChatMessage> messages;
}
