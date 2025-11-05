package com.skillhub.skillhub.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillhub.skillhub.model.Comment;
import com.skillhub.skillhub.repository.CommentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getReplies(String parentId) {
        return commentRepository.findByParentId(parentId);
    }

    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteComment(String id) {
        // Recursively delete replies
        List<Comment> replies = commentRepository.findByParentId(id);
        for (Comment reply : replies) {
            deleteComment(reply.getId());
        }
        commentRepository.deleteById(id);
    }

    public Comment updateComment(String id, Comment comment) {
        Optional<Comment> existingCommentOpt = commentRepository.findById(id);
        if (existingCommentOpt.isPresent()) {
            Comment existingComment = existingCommentOpt.get();
            existingComment.setContent(comment.getContent());
            existingComment.setTimestamp(java.time.LocalDateTime.now());
            return commentRepository.save(existingComment);
        } else {
            return null;
        }
    }
}
