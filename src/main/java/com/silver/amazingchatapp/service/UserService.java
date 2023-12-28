package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.LoginRequest;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.model.Status;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDto login(LoginRequest loginRequest) {
        User user = userRepository.findById(loginRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Not found user"));

        if (!user.getPassword().equals(loginRequest.getPassword())) throw new IllegalArgumentException("Password invalid");
        return UserDto.builder()
                .username(user.getUsername())
                .fullName(user.getFullName())
                .avatarUrl(user.getAvatarUrl())
                .status(user.getStatus())
                .build();
    }

    public UserDto connect(UserDto userDto) {
        User user = userRepository.findById(userDto.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Not found user"));
        user.setStatus(Status.ONLINE);
        userDto.setStatus(userRepository.save(user).getStatus());
        return userDto;
    }
}
