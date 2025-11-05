package com.skillhub.skillhub.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.skillhub.skillhub.dto.TaskStatusUpdateRequest;
import com.skillhub.skillhub.model.Course;
import com.skillhub.skillhub.model.UserEnrollment;
import com.skillhub.skillhub.service.CourseService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Date;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CourseController {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping
    public List<Course> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        logger.info("Retrieved {} courses from database", courses.size());
        return courses;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        logger.info("Attempting to retrieve course with ID: {}", id);
        return courseService.getCourseById(id)
                .map(course -> {
                    logger.info("Found course: {}", course.getName());
                    return ResponseEntity.ok(course);
                })
                .orElseGet(() -> {
                    logger.warn("Course not found with ID: {}", id);
                    return ResponseEntity.notFound().build();
                });
    }
    
    @PostMapping
    public Course createCourse(@RequestBody Course course) {
        logger.info("Creating new course: {}", course.getName());
        return courseService.createCourse(course);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course course) {
        try {
            logger.info("Updating course with ID: {}", id);
            Course updatedCourse = courseService.updateCourse(id, course);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            logger.error("Failed to update course with ID: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        try {
            logger.info("Deleting course with ID: {}", id);
            courseService.deleteCourse(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Failed to delete course with ID: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{courseId}/enroll/{userId}")
    public ResponseEntity<UserEnrollment> enrollUser(@PathVariable String courseId, @PathVariable String userId) {
        try {
            logger.info("Enrolling user {} in course {}", userId, courseId);
            UserEnrollment enrollment = courseService.enrollUserInCourse(userId, courseId);
            return ResponseEntity.ok(enrollment);
        } catch (RuntimeException e) {
            logger.error("Failed to enroll user {} in course {}", userId, courseId, e);
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/user/{userId}/enrollments")
    public List<UserEnrollment> getUserEnrollments(@PathVariable String userId) {
        logger.info("Retrieving enrollments for user: {}", userId);
        return courseService.getUserEnrollments(userId);
    }

    @PutMapping("/enrollments/{enrollmentId}/tasks/{taskId}")
    public ResponseEntity<UserEnrollment> updateTaskProgress(
            @PathVariable String enrollmentId,
            @PathVariable String taskId,
            @RequestParam boolean completed) {
        logger.info("Updating task progress - Enrollment: {}, Task: {}, Completed: {}", 
            enrollmentId, taskId, completed);
        UserEnrollment enrollment = courseService.updateTaskProgress(enrollmentId, taskId, completed);
        if (enrollment != null) {
            return ResponseEntity.ok(enrollment);
        }
        return ResponseEntity.notFound().build();
    }

    @PatchMapping("/{courseId}/levels/{levelId}/tasks/{taskId}")
    public ResponseEntity<Course> updateTaskStatus(
            @PathVariable String courseId,
            @PathVariable String levelId,
            @PathVariable String taskId,
            @RequestBody TaskStatusUpdateRequest request) {
        logger.info("Updating task status - Course: {}, Level: {}, Task: {}, Completed: {}", 
            courseId, levelId, taskId, request.isCompleted());
        Course updatedCourse = courseService.updateTaskStatus(courseId, levelId, taskId, request.isCompleted());
        return ResponseEntity.ok(updatedCourse);
    }

    @PostMapping("/test/create-sample")
    public ResponseEntity<Course> createSampleCourse() {
        logger.info("Creating sample course");
        Course sampleCourse = new Course();
        sampleCourse.setName("Sample Course");
        sampleCourse.setDescription("This is a sample course to test the application");
        sampleCourse.setCreatedAt(new Date().toString());
        sampleCourse.setActive(true);

        // Create a sample level
        Course.Level level = new Course.Level();
        level.setLevelNumber(1);
        level.setLevelName("Introduction");
        
        // Create sample tasks
        Course.Task task1 = new Course.Task();
        task1.setTaskId("task1");
        task1.setTaskName("Welcome Task");
        task1.setTaskDescription("Complete this task to get started");
        task1.setCompleted(false);

        Course.Task task2 = new Course.Task();
        task2.setTaskId("task2");
        task2.setTaskName("First Steps");
        task2.setTaskDescription("Learn the basics");
        task2.setCompleted(false);

        level.setTasks(List.of(task1, task2));
        sampleCourse.setLevels(List.of(level));

        Course savedCourse = courseService.createCourse(sampleCourse);
        logger.info("Sample course created with ID: {}", savedCourse.getId());
        return ResponseEntity.ok(savedCourse);
    }
} 