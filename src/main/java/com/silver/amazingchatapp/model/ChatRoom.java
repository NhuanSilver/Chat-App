package com.silver.amazingchatapp.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "rooms")
public class ChatRoom {
    @Id
    private String id;
    private String name;
    @ManyToMany(mappedBy = "rooms")
    private List<User> users;
    @OneToMany(mappedBy = "room")
    private List<ChatMessage> messages;

}
