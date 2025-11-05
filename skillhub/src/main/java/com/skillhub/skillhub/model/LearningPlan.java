package com.skillhub.skillhub.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Document(collection = "skillhub")
public class LearningPlan {
    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private Date createdAt;
    private Date updatedAt;
    private List<String> sharedWith = new ArrayList<>();
    private List<Topic> topics = new ArrayList<>();
}

