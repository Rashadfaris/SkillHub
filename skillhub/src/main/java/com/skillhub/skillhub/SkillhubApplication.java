package com.skillhub.skillhub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "com.skillhub.skillhub.repository")
public class SkillhubApplication {
    public static void main(String[] args) {
        SpringApplication.run(SkillhubApplication.class, args);
    }
}
