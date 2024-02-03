package com.silver.amazingchatapp.service;

import com.silver.amazingchatapp.dto.AddFriendRequest;
import com.silver.amazingchatapp.dto.FriendDTO;
import com.silver.amazingchatapp.exception.ApiRequestException;
import com.silver.amazingchatapp.mapper.FriendDTOMapper;
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
    private final FriendDTOMapper friendDTOMapper;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate simpMessagingTemplate;

    public List<FriendDTO> getFriendsByUser(String username) {
        User user = this.userRepository.findById(username).orElseThrow(() -> new ApiRequestException("User not found"));
        return friendRepository.findByOwnerAndStatus(user, FRIEND_STATUS.ACTIVE)
                .stream().map(friendDTOMapper::toFriedDTO).toList();
    }

    public List<FriendDTO> getFriendsRequestByUser(String username) {
        User user = this.userRepository.findById(username).orElseThrow(() -> new ApiRequestException("User not found"));
        return friendRepository.findByRequestAndStatus(user, FRIEND_STATUS.PENDING)
                .stream().map(friendDTOMapper::toFriedDTO).toList();
    }

    public void addFriend(AddFriendRequest request) {

        User owner = userRepository.findById(request.getOwner())
                .orElseThrow();
        User requestTo = userRepository.findById(request.getRequestTo())
                .orElseThrow();

        Set<Friend> friends = this.friendRepository
                .findByOwnerAndRequestOrRequestAndOwner(owner, requestTo, owner, requestTo);

        log.info("Adding ...");
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

                FriendDTO friendAcceptedDTO = friendDTOMapper.toFriedDTO(friendRepository.save(acceptFriend));

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
        FriendDTO friendDTO = friendDTOMapper.toFriedDTO(friendRequest);

        this.simpMessagingTemplate.convertAndSendToUser(request.getOwner(), "/queue/friends", friendDTO);
        this.simpMessagingTemplate.convertAndSendToUser(request.getRequestTo(), "/queue/friends", friendDTO);

    }

    public void deleteFriend(Long id) {
        if (this.friendRepository.existsById(id)) this.friendRepository.deleteById(id);
    }

    public boolean checkFriend(String id, String other) {
        return this.friendRepository.findByOwnerUsernameAndRequestUsername(id, other).isPresent();
    }
}
