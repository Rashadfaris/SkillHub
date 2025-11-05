package com.skillhub.skillhub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillhub.skillhub.model.UserEnrollment;

import java.util.List;

@Repository
public interface UserEnrollmentRepository extends MongoRepository<UserEnrollment, String> {
    List<UserEnrollment> findByUserId(String userId);
    UserEnrollment findByUserIdAndCourseId(String userId, String courseId);
} 