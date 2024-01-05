package com.silver.amazingchatapp.controller;

import com.silver.amazingchatapp.dto.LoginRequest;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
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

    @PostMapping("/login")
    public UserDto login(@RequestBody LoginRequest request) {
        return userService.login(request);
    }

    @GetMapping()
    public List<UserDto> getAllUser() {
        return userService.getAllUsers();
    }

    @GetMapping("/search/{value}")
    public List<UserDto> getUserByUsernameOrName(@PathVariable String value) {
        log.info(value);
        return this.userService.getUserByUsernameOrName(value);
    }


}
