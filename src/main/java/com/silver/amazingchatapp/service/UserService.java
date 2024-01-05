package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.AddFriendRequest;
import com.silver.amazingchatapp.dto.FriendDTO;
import com.silver.amazingchatapp.dto.LoginRequest;
import com.silver.amazingchatapp.dto.UserDto;
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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final UserDTOMapper userDTOMapper;
    private final FriendRepository friendRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public UserDto login(LoginRequest loginRequest) {
        User user = userRepository.findById(loginRequest.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Not found user"));

        if (!user.getPassword().equals(loginRequest.getPassword()))
            throw new IllegalArgumentException("Password invalid");
        return this.userDTOMapper.toDTO(user);
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
