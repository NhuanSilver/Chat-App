package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
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
    @OneToMany(mappedBy = "user")
    private List<ChatMessage> messages;
    @ManyToMany
    @JoinTable(name = "user_room", joinColumns = @JoinColumn(name = "user"),
            inverseJoinColumns = @JoinColumn(name = "room"))
    private List<ChatRoom> rooms;
}
