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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
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


}
