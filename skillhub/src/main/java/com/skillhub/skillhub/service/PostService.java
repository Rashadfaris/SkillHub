package com.skillhub.skillhub.service;

import com.skillhub.skillhub.model.Post;
import com.skillhub.skillhub.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository repository;

    public List<Post> getAllPosts() {
        return repository.findAll();
    }

    public Optional<Post> getPostById(String id) {
        return repository.findById(id);
    }

    public List<Post> getPostsByUserId(String userId) {
        return repository.findByUserId(userId);
    }

    public Post createPost(Post post) {
        return repository.save(post);
    }

    public Post updatePost(String id, Post updatedPost) {
        if (repository.existsById(id)) {
            updatedPost.setId(id);
            return repository.save(updatedPost);
        }
        return null;
    }

    public void deletePost(String id) {
        repository.deleteById(id);
    }
}