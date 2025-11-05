package com.skillhub.skillhub.controller;

import com.skillhub.skillhub.model.Reaction;
import com.skillhub.skillhub.service.ReactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reactions")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReactionController {

    @Autowired
    private ReactionService reactionService;

    @GetMapping("/post/{postId}")
    public List<Reaction> getReactionsByPostId(@PathVariable String postId) {
        return reactionService.getReactionsByPostId(postId);
    }

    @GetMapping("/post/{postId}/counts")
    public Map<String, Long> getReactionCounts(@PathVariable String postId) {
        return reactionService.getReactionCountsByPostId(postId);
    }

    @PostMapping
    public ResponseEntity<?> addReaction(@RequestBody Reaction reaction) {
        Reaction result = reactionService.addReaction(reaction);
        if (result == null) {
            // Reaction was toggled off
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeReaction(@PathVariable String id) {
        reactionService.removeReaction(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<?> removeUserReaction(
            @PathVariable String postId,
            @PathVariable String userId) {
        reactionService.removeReactionByPostAndUser(postId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}/user/{userId}/reacted")
    public ResponseEntity<Boolean> hasUserReacted(
            @PathVariable String postId,
            @PathVariable String userId,
            @RequestParam String reactionType) {
        boolean hasReacted = reactionService.hasUserReacted(postId, userId, reactionType);
        return ResponseEntity.ok(hasReacted);
    }

    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Long> getReactionCount(
            @PathVariable String postId,
            @RequestParam String reactionType) {
        long count = reactionService.countReactionsByType(postId, reactionType);
        return ResponseEntity.ok(count);
    }
} 