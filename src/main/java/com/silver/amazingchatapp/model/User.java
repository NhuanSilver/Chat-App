package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
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
    private USER_STATUS status;
    @ManyToMany
    private Set<Conversation> conversations;

    @ManyToMany
    @JoinTable(
            name = "user_message",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "message_id")
    )
    private Set<ChatMessage> messages = new HashSet<>();

    @OneToMany(mappedBy = "owner")
    private Set<Friend> friends = new HashSet<>();
}