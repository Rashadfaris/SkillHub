package com.skillhub.skillhub.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.skillhub.skillhub.model.Course;
import com.skillhub.skillhub.model.Level;
import com.skillhub.skillhub.model.Task;
import com.skillhub.skillhub.model.UserEnrollment;
import com.skillhub.skillhub.repository.CourseRepository;
import com.skillhub.skillhub.repository.UserEnrollmentRepository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserEnrollmentRepository enrollmentRepository;

    @Autowired
    private MongoTemplate mongoTemplate;
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }
    
    public Course createCourse(Course course) {
        // Initialize levels if null
        if (course.getLevels() == null) {
            course.setLevels(new ArrayList<>());
        }

        // Process each level
        for (int i = 0; i < course.getLevels().size(); i++) {
            Course.Level level = course.getLevels().get(i);
            level.setLevelNumber(i + 1);
            
            // Initialize tasks if null
            if (level.getTasks() == null) {
                level.setTasks(new ArrayList<>());
            }

            // Process each task
            for (int j = 0; j < level.getTasks().size(); j++) {
                Course.Task task = level.getTasks().get(j);
                if (task.getTaskId() == null || task.getTaskId().isEmpty()) {
                    task.setTaskId("task_" + System.currentTimeMillis() + "_level" + (i + 1) + "_task" + j);
                }
            }
        }

        course.setCreatedAt(new Date().toString());
        course.setActive(true);
        
        // Use MongoTemplate to save the course
        return mongoTemplate.save(course);
    }
    
    public Course updateCourse(String id, Course course) {
        Course existingCourse = courseRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        // Update basic fields
        existingCourse.setName(course.getName());
        existingCourse.setDescription(course.getDescription());

        // Process levels
        if (course.getLevels() != null) {
            for (int i = 0; i < course.getLevels().size(); i++) {
                Course.Level level = course.getLevels().get(i);
                level.setLevelNumber(i + 1);
                
                // Process tasks
                if (level.getTasks() != null) {
                    for (int j = 0; j < level.getTasks().size(); j++) {
                        Course.Task task = level.getTasks().get(j);
                        if (task.getTaskId() == null || task.getTaskId().isEmpty()) {
                            task.setTaskId("task_" + System.currentTimeMillis() + "_level" + (i + 1) + "_task" + j);
                        }
                    }
                }
            }
            existingCourse.setLevels(course.getLevels());
        }

        // Use MongoTemplate to update the course
        return mongoTemplate.save(existingCourse);
    }
    
    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
    
    public double calculateCompletionPercentage(Course course) {
        if (course.getLevels() == null || course.getLevels().isEmpty()) {
            return 0.0;
        }
        
        long completedLevels = course.getLevels().stream()
            .filter(level -> level.getTasks() != null && 
                           !level.getTasks().isEmpty() && 
                           level.getTasks().stream().allMatch(task -> task.isCompleted()))
            .count();
            
        return (double) completedLevels / course.getLevels().size() * 100;
    }

    public UserEnrollment enrollUserInCourse(String userId, String courseId) {
        // Check if already enrolled
        UserEnrollment existingEnrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId);
        if (existingEnrollment != null) {
            return existingEnrollment;
        }

        // Get course to calculate total tasks
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));

        // Create new enrollment
        UserEnrollment enrollment = new UserEnrollment();
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        enrollment.setEnrollmentDate(new Date());
        
        UserEnrollment.Progress progress = new UserEnrollment.Progress();
        progress.setCurrentLevel(1);
        progress.setCompletionPercentage(0.0);
        progress.setCompletedTasks(new ArrayList<>());
        enrollment.setProgress(progress);

        return enrollmentRepository.save(enrollment);
    }

    public List<UserEnrollment> getUserEnrollments(String userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public UserEnrollment updateTaskProgress(String enrollmentId, String taskId, boolean completed) {
        Optional<UserEnrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        if (!enrollmentOpt.isPresent()) {
            throw new RuntimeException("Enrollment not found");
        }

        UserEnrollment enrollment = enrollmentOpt.get();
        Course course = courseRepository.findById(enrollment.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found"));

        if (enrollment.getProgress().getCompletedTasks() == null) {
            enrollment.getProgress().setCompletedTasks(new ArrayList<>());
        }

        List<String> completedTasks = enrollment.getProgress().getCompletedTasks();
        if (completed && !completedTasks.contains(taskId)) {
            completedTasks.add(taskId);
        } else if (!completed) {
            completedTasks.remove(taskId);
        }

        // Update completion percentage
        int totalTasks = getTotalTasks(course);
        double percentage = totalTasks > 0 ? 
            ((double) completedTasks.size() / totalTasks) * 100 : 0;
        enrollment.getProgress().setCompletionPercentage(percentage);

        // Update current level
        int currentLevel = calculateCurrentLevel(course, completedTasks);
        enrollment.getProgress().setCurrentLevel(currentLevel);

        return enrollmentRepository.save(enrollment);
    }

    private int getTotalTasks(Course course) {
        return course.getLevels().stream()
            .mapToInt(level -> level.getTasks().size())
            .sum();
    }

    private int calculateCurrentLevel(Course course, List<String> completedTasks) {
        for (int i = course.getLevels().size(); i > 0; i--) {
            Course.Level level = course.getLevels().get(i - 1);
            boolean allTasksCompleted = level.getTasks().stream()
                .allMatch(task -> completedTasks.contains(task.getTaskId()));
            if (allTasksCompleted) {
                return i + 1; // Return next level
            }
        }
        return 1; // Default to first level
    }

    public Course updateTaskStatus(String courseId, String levelId, String taskId, boolean completed) {
        Query query = new Query(Criteria.where("id").is(courseId)
            .and("levels.levelNumber").is(Integer.parseInt(levelId))
            .and("levels.tasks.taskId").is(taskId));
        
        Update update = new Update().set("levels.$.tasks.$[task].isCompleted", completed);
        update.filterArray(Criteria.where("task.taskId").is(taskId));
        
        mongoTemplate.updateFirst(query, update, Course.class);
        return courseRepository.findById(courseId)
            .orElseThrow(() -> new RuntimeException("Course not found"));
    }
} 