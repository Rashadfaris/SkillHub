package com.skillhub.skillhub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "reactions")
public class Reaction {
    @Id
    private String id;
    private String postId;
    private String userId;
    private String reactionType;  // "LIKE", "LOVE", "CLAP", etc.
    private LocalDateTime timestamp = LocalDateTime.now();

    // Constructors
    public Reaction() {
    }

    public Reaction(String postId, String userId, String reactionType) {
        this.postId = postId;
        this.userId = userId;
        this.reactionType = reactionType;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getReactionType() {
        return reactionType;
    }

    public void setReactionType(String reactionType) {
        this.reactionType = reactionType;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 