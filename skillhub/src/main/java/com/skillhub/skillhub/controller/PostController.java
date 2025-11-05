package com.skillhub.skillhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillhub.skillhub.model.Post;
import com.skillhub.skillhub.model.User;
import com.skillhub.skillhub.repository.UserRepository;
import com.skillhub.skillhub.service.PostService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService service;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Map<String, Object>> getAllPosts() {
        List<Post> posts = service.getAllPosts();
        return posts.stream().map(this::convertPostToResponse).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable String id) {
        Optional<Post> postOpt = service.getPostById(id);
        return postOpt.map(post -> ResponseEntity.ok(convertPostToResponse(post)))
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getPostsByUserId(@PathVariable String userId) {
        List<Post> posts = service.getPostsByUserId(userId);
        return posts.stream().map(this::convertPostToResponse).collect(Collectors.toList());
    }

    @PostMapping
    public Map<String, Object> createPost(@RequestBody Post post) {
        logger.info("Received post creation request: {}", post);
        try {
            Post createdPost = service.createPost(post);
            logger.info("Successfully created post: {}", createdPost);
            return convertPostToResponse(createdPost);
        } catch (Exception e) {
            logger.error("Error creating post: ", e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePost(@PathVariable String id, @RequestBody Post updatedPost) {
        Post post = service.updatePost(id, updatedPost);
        return post != null ? 
            ResponseEntity.ok(convertPostToResponse(post)) : 
            ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        service.deletePost(id);
        return ResponseEntity.ok().build();
    }
    
    // Helper method to convert Post to response with user info
    private Map<String, Object> convertPostToResponse(Post post) {
        Map<String, Object> response = new HashMap<>();
        response.put("id", post.getId());
        response.put("title", post.getTitle());
        response.put("description", post.getDescription());
        response.put("postType", post.getPostType());
        response.put("image", post.getImage());
        response.put("images", post.getImages());
        response.put("videos", post.getVideos());
        response.put("visibilityCount", post.getVisibilityCount());
        response.put("timestamp", post.getTimestamp());
        response.put("userId", post.getUserId());
        
        // Add user information
        userRepository.findById(post.getUserId()).ifPresent(user -> {
            response.put("userName", user.getName());
            response.put("userEmail", user.getEmail());
        });
        
        return response;
    }
}