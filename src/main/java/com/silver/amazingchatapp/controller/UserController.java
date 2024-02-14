package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.LoginRequest;
import com.silver.amazingchatapp.dto.RegistrationRequest;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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


    @PostMapping("/login")
    public UserDto login(@RequestBody @Valid LoginRequest request) {
        return userService.login(request);
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto register(@RequestBody @Valid RegistrationRequest request) {
        return this.userService.register(request);
    }

    @GetMapping()
    public List<UserDto> getAllUser() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}/friends/search/{value}")
    public List<UserDto> getUserFriendsByUsernameOrName(@PathVariable String id, @PathVariable String value) {
        return this.userService.getUserFriendsByUsernameOrName(id, value);
    }

    @GetMapping("/{id}/notFriends/search/{value}")
    public List<UserDto> getNotFriends(@PathVariable String id, @PathVariable String value) {
        return this.userService.getNotFriends(id, value);
    }

}
