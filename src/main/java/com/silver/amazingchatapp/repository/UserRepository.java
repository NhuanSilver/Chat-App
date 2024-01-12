package com.silver.amazingchatapp.repository;

import com.silver.amazingchatapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    @Query(
            "select u from User u where (u.username like %:valueSearch% escape '!' or u.fullName like %:valueSearch% escape '!' )" +
                    "and u.username <> :username and u  in" +
                    " (select f.request from Friend f where f.status = 1 and f.owner.username = :username)"
    )
    List<User> findUserFriendsByUsername (String username, String valueSearch);

    @Query(
            "select u from User u where (u.username like %:valueSearch% escape '!' or u.fullName like %:valueSearch% escape '!' )" +
                    "and u.username <> :username  and u not in" +
                    " (select f.owner from Friend f where f.status = 1)"
    )
    List<User> findNotFriendsByUsername(String username, String valueSearch);
}
