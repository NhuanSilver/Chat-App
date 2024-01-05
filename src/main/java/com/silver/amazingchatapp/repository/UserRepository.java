package com.silver.amazingchatapp.repository;

import com.silver.amazingchatapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    List<User> findByUsernameContainingOrFullNameContaining(String username, String fullName);
}
