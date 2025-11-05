package com.skillhub.skillhub.model;


import lombok.Data;

@Data
public class Resource {
    private String id;
    private String name;
    private String url;
    private ResourceType type;
}


