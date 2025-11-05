package com.skillhub.skillhub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillhub.skillhub.model.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
} 