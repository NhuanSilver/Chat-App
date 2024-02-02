package com.silver.amazingchatapp.repository;

import com.silver.amazingchatapp.model.FRIEND_STATUS;
import com.silver.amazingchatapp.model.Friend;
import com.silver.amazingchatapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.Set;

@Repository
public interface FriendRepository extends JpaRepository<Friend, Long> {

    Set<Friend> findByOwnerAndRequestOrRequestAndOwner(User owner, User request, User request2, User owner2);

    Set<Friend> findByOwnerAndStatus(User owner, FRIEND_STATUS status);

    Set<Friend> findByRequestAndStatus(User user, FRIEND_STATUS friendStatus);

    Optional<Friend> findByOwnerUsernameAndRequestUsername(String id, String other);
}
