package com.skillhub.skillhub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "user_enrollments")
public class UserEnrollment {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private Date enrollmentDate;
    private Progress progress;

    @Data
    public static class Progress {
        private List<String> completedTasks;
        private int currentLevel;
        private double completionPercentage;
    }

    public void initializeProgress() {
        if (this.progress == null) {
            this.progress = new Progress();
            this.progress.setCurrentLevel(1);
            this.progress.setCompletionPercentage(0.0);
        }
    }
} 