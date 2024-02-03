package com.silver.amazingchatapp.mapper;

import com.silver.amazingchatapp.dto.FriendDTO;
import com.silver.amazingchatapp.model.Friend;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FriendDTOMapper {
    private final  UserDTOMapper userDTOMapper;
    public FriendDTO toFriedDTO (Friend friend) {
        return FriendDTO.builder()
                .id(friend.getId())
                .owner(userDTOMapper.toDTO(friend.getOwner()))
                .requestTo(userDTOMapper.toDTO(friend.getRequest()))
                .status(friend.getStatus())
                .build();
    }
}
