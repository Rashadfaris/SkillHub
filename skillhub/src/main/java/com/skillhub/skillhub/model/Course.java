package com.skillhub.skillhub.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "courses")
public class Course {
    @Id
    private String id;
    
    @Field("name")
    private String name;
    
    @Field("description")
    private String description;
    
    @Field("levels")
    private List<Level> levels = new ArrayList<>();
    
    @Field("createdBy")
    private String createdBy;
    
    @Field("createdAt")
    private String createdAt;
    
    @Field("isActive")
    private boolean isActive;

    @Data
    public static class Level {
        @Field("levelNumber")
        private int levelNumber;
        
        @Field("levelName")
        private String levelName;
        
        @Field("tasks")
        private List<Task> tasks = new ArrayList<>();
    }

    @Data
    public static class Task {
        @Field("taskId")
        private String taskId;
        
        @Field("taskName")
        private String taskName;
        
        @Field("taskDescription")
        private String taskDescription;
        
        @Field("isCompleted")
        private boolean isCompleted;
    }
} 