package com.skillhub.skillhub.repository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillhub.skillhub.model.Comment;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    List<Comment> findByParentId(String parentId); // For replies
}
