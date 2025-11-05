package com.skillhub.skillhub.model;


import lombok.Data;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
public class Topic {
    private String id;
    private String name;
    private String description;
    private Date startDate;
    private Date endDate;
    private boolean completed;
    private List<Resource> resources = new ArrayList<>();
}