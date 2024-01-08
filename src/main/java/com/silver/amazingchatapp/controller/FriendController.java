package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.AddFriendRequest;
import com.silver.amazingchatapp.dto.FriendDTO;
import com.silver.amazingchatapp.service.FriendService;
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
    public void addFriend(@Payload AddFriendRequest request) {
        log.info("Start add");
        this.friendService.addFriend(request);
    }

    @GetMapping("/users/{id}")
    public List<FriendDTO> getFriendsByUser (@PathVariable String id) {
        return this.friendService.getFriendsByUser(id);
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
