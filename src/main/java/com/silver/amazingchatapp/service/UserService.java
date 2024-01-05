package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.LoginRequest;
import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.model.USER_STATUS;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDto login(LoginRequest loginRequest) {
        User user = userRepository.findById(loginRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Not found user"));

        if (!user.getPassword().equals(loginRequest.getPassword()))
            throw new IllegalArgumentException("Password invalid");
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
        user.setStatus(USER_STATUS.ONLINE);
        userDto.setStatus(userRepository.save(user).getStatus());
        return userDto;
    }

    public List<UserDto> getAllUsers() {
        return this.userRepository.findAll().stream()
                .map(
                        user -> UserDto.builder()
                                .username(user.getUsername())
                                .avatarUrl(user.getAvatarUrl())
                                .status(user.getStatus())
                                .fullName(user.getFullName())
                                .build()
                )
                .collect(Collectors.toList());
    }

    public List<UserDto> getUserByUsernameOrName(String value) {
        return this.userRepository.findByUsernameContainingOrFullNameContaining(value, value)
                .stream()
                .map(user -> UserDto.builder()
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .status(user.getStatus())
                        .avatarUrl(user.getAvatarUrl())
                        .build()).toList();
    }
}
