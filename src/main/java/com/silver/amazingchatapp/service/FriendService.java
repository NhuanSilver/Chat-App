package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.AddFriendRequest;
import com.silver.amazingchatapp.dto.FriendDTO;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.mapper.UserDTOMapper;
import com.silver.amazingchatapp.model.FRIEND_STATUS;
import com.silver.amazingchatapp.model.Friend;
import com.silver.amazingchatapp.model.User;
import com.silver.amazingchatapp.repository.FriendRepository;
import com.silver.amazingchatapp.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
@Data
@RequiredArgsConstructor
@Slf4j
public class FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;
    private final UserDTOMapper userDTOMapper;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public List<FriendDTO> getFriendsByUser(String username) {
        User user = this.userRepository.findById(username).orElseThrow(() -> new ApiRequestException("User not found"));
        return friendRepository.findByOwnerAndStatus(user, FRIEND_STATUS.ACTIVE)
                .stream().map(friend ->
                        FriendDTO.builder()
                                .id(friend.getId())
                                .owner(userDTOMapper.toDTO(friend.getOwner()))
                                .requestTo(userDTOMapper.toDTO(friend.getRequest()))
                                .status(friend.getStatus())
                                .build()
                ).toList();
    }

    public List<FriendDTO> getFriendsRequestByUser(String username) {
        User user = this.userRepository.findById(username).orElseThrow(() -> new ApiRequestException("User not found"));
        return friendRepository.findByRequestAndStatus(user, FRIEND_STATUS.PENDING)
                .stream().map(friend ->
                        FriendDTO.builder()
                                .id(friend.getId())
                                .owner(userDTOMapper.toDTO(friend.getOwner()))
                                .requestTo(userDTOMapper.toDTO(friend.getRequest()))
                                .status(friend.getStatus())
                                .build()
                ).toList();
    }

    public void addFriend(AddFriendRequest request) {

        User owner = userRepository.findById(request.getOwner())
                .orElseThrow(() -> new ApiRequestException("User not found"));
        User requestTo = userRepository.findById(request.getRequestTo())
                .orElseThrow(() -> new ApiRequestException("Request to user not found"));

        Set<Friend> friends = this.friendRepository
                .findByOwnerAndRequestOrRequestAndOwner(owner, requestTo, owner, requestTo);

        // Already in friendship
        if (friends.size() > 1) return;

        // Request is exist
        if (friends.size() == 1) {
            Friend existedFriend = friends.stream().toList().get(0);

            // User already had requested
            if (existedFriend.getOwner().getUsername().equals(request.getOwner())) return;

            // Accept friend
            if (existedFriend.getRequest().getUsername().equals(request.getOwner())) {
                Friend acceptFriend = Friend.builder()
                        .owner(owner)
                        .request(requestTo)
                        .status(FRIEND_STATUS.ACTIVE)
                        .build();

                existedFriend.setStatus(FRIEND_STATUS.ACTIVE);
                friendRepository.save(existedFriend);



                Friend friendAccepted = friendRepository.save(acceptFriend);

                FriendDTO friendAcceptedDTO = FriendDTO.builder()
                        .id(friendAccepted.getId())
                        .owner(this.userDTOMapper.toDTO(friendAccepted.getOwner()))
                        .requestTo(this.userDTOMapper.toDTO(friendAccepted.getRequest()))
                        .status(friendAccepted.getStatus())
                        .build();

                this.simpMessagingTemplate.convertAndSendToUser(request.getOwner(), "/queue/friends", friendAcceptedDTO);

                this.simpMessagingTemplate.convertAndSendToUser(request.getRequestTo(), "/queue/friends", friendAcceptedDTO);
            }
            return;
        }


        // Create new friend request
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

    public void deleteFriend(Long id) {
        if (this.friendRepository.existsById(id)) this.friendRepository.deleteById(id);
    }
}
