package com.silver.amazingchatapp.mapper;

import com.silver.amazingchatapp.dto.UserDto;
import com.silver.amazingchatapp.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserDTOMapper {
    public UserDto toDTO(User user) {
        return UserDto.builder()
                .username(user.getUsername())
                .fullName(user.getFullName())
                .status(user.getStatus())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
