package com.skillhub.skillhub.dto;

public class TaskStatusUpdateRequest {
    private boolean completed;

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
} 