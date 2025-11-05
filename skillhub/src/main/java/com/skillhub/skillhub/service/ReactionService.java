package com.skillhub.skillhub.service;

import com.skillhub.skillhub.model.Reaction;
import com.skillhub.skillhub.repository.ReactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReactionService {

    @Autowired
    private ReactionRepository reactionRepository;

    public List<Reaction> getReactionsByPostId(String postId) {
        return reactionRepository.findByPostId(postId);
    }

    public Map<String, Long> getReactionCountsByPostId(String postId) {
        List<Reaction> reactions = reactionRepository.findByPostId(postId);
        Map<String, Long> counts = new HashMap<>();
        
        for (Reaction reaction : reactions) {
            String type = reaction.getReactionType();
            counts.put(type, counts.getOrDefault(type, 0L) + 1);
        }
        
        return counts;
    }

    public Reaction addReaction(Reaction reaction) {
        // Check if user already reacted to this post
        Optional<Reaction> existingReaction = reactionRepository.findByPostIdAndUserId(
            reaction.getPostId(), reaction.getUserId());
        
        // If user already reacted, update reaction type
        if (existingReaction.isPresent()) {
            Reaction existing = existingReaction.get();
            // If same reaction type, toggle it off (remove reaction)
            if (existing.getReactionType().equals(reaction.getReactionType())) {
                reactionRepository.delete(existing);
                return null;
            } else {
                // Update to new reaction type
                existing.setReactionType(reaction.getReactionType());
                return reactionRepository.save(existing);
            }
        }
        
        // If no existing reaction, save new one
        return reactionRepository.save(reaction);
    }

    public void removeReaction(String id) {
        reactionRepository.deleteById(id);
    }

    public void removeReactionByPostAndUser(String postId, String userId) {
        reactionRepository.deleteByPostIdAndUserId(postId, userId);
    }

    public boolean hasUserReacted(String postId, String userId, String reactionType) {
        return reactionRepository.findByPostIdAndUserIdAndReactionType(postId, userId, reactionType).isPresent();
    }

    public long countReactionsByType(String postId, String reactionType) {
        return reactionRepository.countByPostIdAndReactionType(postId, reactionType);
    }
} 