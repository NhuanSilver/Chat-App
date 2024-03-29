package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.*;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.mapper.UserDTOMapper;
import com.silver.amazingchatapp.model.USER_STATUS;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserDTOMapper userDTOMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public UserDto login(LoginRequest loginRequest) {
        String normalUsername =  Normalizer
                .normalize(loginRequest.getUsername(), Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .toLowerCase();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalUsername,
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findById(normalUsername)
                .orElseThrow(() -> new ApiRequestException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        UserDto userDto = this.userDTOMapper.toDTO(user);
        userDto.setToken(jwtToken);
        return userDto;
    }


    public UserDto register(RegistrationRequest request) {
        boolean isUsernameExist = userRepository.existsById(request.getUsername());
        if (isUsernameExist) throw new ApiRequestException("username is existed");
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .status(USER_STATUS.OFFLINE)
                .avatarUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0De2xVUr6gbBHHbPQIbW8-bgFLL4V0v2gcaiwPixV4Q&s")
                .role("USER")
                .build();
        return userDTOMapper.toDTO(userRepository.save(user));
    }


    public UserDto connect(UserDto userDto) {
        User user = userRepository.findById(userDto.getUsername())
                .orElseThrow(() -> new ApiRequestException("User not found"));
        user.setStatus(USER_STATUS.ONLINE);
        userDto.setStatus(userRepository.save(user).getStatus());
        return userDto;
    }

    public UserDto disconnect(UserDto userDto) {
        User user = userRepository.findById(userDto.getUsername())
                .orElseThrow(() -> new ApiRequestException("User not found"));
        user.setStatus(USER_STATUS.OFFLINE);
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

    public List<UserDto> getUserFriendsByUsernameOrName(String id, String value) {
        return this.userRepository.findUserFriendsByUsername(id, value)
                .stream()
                .map(this.userDTOMapper::toDTO).toList();
    }

    public List<UserDto> getNotFriends(String id, String valueSearch) {
        return this.userRepository.findNotFriendsByUsername(id, valueSearch)
                .stream().map(this.userDTOMapper::toDTO).toList();
    }
}
