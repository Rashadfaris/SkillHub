package com.skillhub.skillhub.controller;


import com.skillhub.skillhub.model.LearningPlan;
import com.skillhub.skillhub.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/plans")
@CrossOrigin
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @GetMapping
    public ResponseEntity<List<LearningPlan>> getAllPlans() {
        return ResponseEntity.ok(learningPlanService.getAllPlans());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LearningPlan>> getPlansByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(learningPlanService.getPlansByUserId(userId));
    }

    @GetMapping("/shared/{userId}")
    public ResponseEntity<List<LearningPlan>> getSharedPlans(@PathVariable String userId) {
        return ResponseEntity.ok(learningPlanService.getSharedPlans(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LearningPlan> getPlanById(@PathVariable String id) {
        Optional<LearningPlan> plan = learningPlanService.getPlanById(id);
        return plan.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(@RequestBody LearningPlan plan) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(learningPlanService.createPlan(plan));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(@PathVariable String id, @RequestBody LearningPlan plan) {
        // if (!id.equals(plan.getId())) {
        //     return ResponseEntity.badRequest().build();
        // }
        return ResponseEntity.ok(learningPlanService.updatePlan(plan));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(@PathVariable String id) {
        learningPlanService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{planId}/share/{userId}")
    public ResponseEntity<LearningPlan> sharePlan(@PathVariable String planId, @PathVariable String userId) {
        LearningPlan plan = learningPlanService.sharePlan(planId, userId);
        if (plan != null) {
            return ResponseEntity.ok(plan);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{planId}/share/{userId}")
    public ResponseEntity<LearningPlan> unsharePlan(@PathVariable String planId, @PathVariable String userId) {
        LearningPlan plan = learningPlanService.unsharePlan(planId, userId);
        if (plan != null) {
            return ResponseEntity.ok(plan);
        }
        return ResponseEntity.notFound().build();
    }
}

