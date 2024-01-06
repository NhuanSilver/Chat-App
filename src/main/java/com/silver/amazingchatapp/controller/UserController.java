package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.AddFriendRequest;
import com.silver.amazingchatapp.dto.LoginRequest;
import com.silver.amazingchatapp.dto.RegistrationRequest;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @MessageMapping("/user.Connect")
    @SendTo("/topic/public")
    public UserDto connect(@Payload UserDto userDto) {
        return userService.connect(userDto);
    }

    @MessageMapping("/user.Disconnect")
    @SendTo("/topic/public")
    public UserDto disconnect(@Payload UserDto userDto) {
       return this.userService.disconnect(userDto);
    }

    @MessageMapping("/user.AddFriend")
    public void addFriend(@Payload AddFriendRequest request) {
        this.userService.addFriend(request);
    }

    @PostMapping("/login")
    public UserDto login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/register")
    public UserDto register(@RequestBody RegistrationRequest request) {
        return this.userService.register(request);
    }

    @GetMapping()
    public List<UserDto> getAllUser() {
        return userService.getAllUsers();
    }

    @GetMapping("/search/{value}")
    public List<UserDto> getUserByUsernameOrName(@PathVariable String value) {
        return this.userService.getUserByUsernameOrName(value);
    }

    @GetMapping("/{username}/friends")
    public List<UserDto> getAllFriendsByUsername(@PathVariable String username){
        return this.userService.getAllFriends(username);
    }


}
