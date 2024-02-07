package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.AddFriendRequest;
import com.silver.amazingchatapp.dto.FriendDTO;
import com.silver.amazingchatapp.service.FriendService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/friends")
public class FriendController {
    private final FriendService friendService;

    @MessageMapping("/user.AddFriend")
    public void addFriend(@Payload @Valid AddFriendRequest request) {
        this.friendService.addFriend(request);
    }

    @GetMapping("/users/{id}")
    public List<FriendDTO> getFriendsByUser (@PathVariable String id) {
        return this.friendService.getFriendsByUser(id);
    }
    @GetMapping("/users/{id}/isFriend/{other}")
    public boolean isFriend(@PathVariable String id, @PathVariable String other) {
        return this.friendService.checkFriend(id, other);
    }


    @GetMapping("/requests/users/{id}")
    public List<FriendDTO> getFriendRequests(@PathVariable String id) {
        return this.friendService.getFriendsRequestByUser(id);
    }

    @DeleteMapping("/{id}")
    public void deleteFriend(@PathVariable Long id) {
        this.friendService.deleteFriend(id);
    }
}
