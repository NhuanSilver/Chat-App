package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.*;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.mapper.UserDTOMapper;
import com.silver.amazingchatapp.model.FRIEND_STATUS;
import com.silver.amazingchatapp.model.Friend;
import com.silver.amazingchatapp.model.USER_STATUS;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.FriendRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final FriendRepository friendRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public UserDto login(LoginRequest loginRequest) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findById(loginRequest.getUsername())
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
        log.info(userDto.toString());
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
                .map(this.userDTOMapper::toDTO).toList();
    }

    public void addFriend(AddFriendRequest request) {
        User owner = userRepository.findById(request.getOwner())
                .orElseThrow(() -> new ApiRequestException("User not found"));
        User requestTo = userRepository.findById(request.getOwner())
                .orElseThrow(() -> new ApiRequestException("Request to user not found"));
        Friend friendRequest = this.friendRepository.save(

                Friend.builder()
                        .owner(owner)
                        .request(requestTo)
                        .status(FRIEND_STATUS.PENDING)
                        .build()

        );
        FriendDTO friendDTO = FriendDTO.builder()
                .id(friendRequest.getId())
                .owner(this.userDTOMapper.toDTO(owner))
                .requestTo(this.userDTOMapper.toDTO(requestTo))
                .status(friendRequest.getStatus())
                .build();

        this.simpMessagingTemplate.convertAndSendToUser(request.getOwner(), "/queue/friends", friendDTO);
        this.simpMessagingTemplate.convertAndSendToUser(request.getRequestTo(), "/queue/friends", friendDTO);

    }
}
