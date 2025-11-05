package com.skillhub.skillhub.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillhub.skillhub.model.Course;

@Repository
public interface CourseRepository extends MongoRepository<Course, String> {
    // Add custom queries if needed
} 