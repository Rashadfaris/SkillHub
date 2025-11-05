package com.skillhub.skillhub.repository;

import com.skillhub.skillhub.model.Reaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends MongoRepository<Reaction, String> {
    List<Reaction> findByPostId(String postId);
    List<Reaction> findByPostIdAndReactionType(String postId, String reactionType);
    Optional<Reaction> findByPostIdAndUserIdAndReactionType(String postId, String userId, String reactionType);
    List<Reaction> findByUserId(String userId);
    Optional<Reaction> findByPostIdAndUserId(String postId, String userId);
    void deleteByPostIdAndUserId(String postId, String userId);
    long countByPostIdAndReactionType(String postId, String reactionType);
} 