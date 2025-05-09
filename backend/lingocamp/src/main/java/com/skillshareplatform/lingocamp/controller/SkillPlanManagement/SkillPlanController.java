package com.skillshareplatform.lingocamp.controller.SkillPlanManagement;

import com.skillshareplatform.lingocamp.model.SkillManagement.SkillPlan;
import com.skillshareplatform.lingocamp.service.SkillManagement.SkillPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/lingocamp/api")
public class SkillPlanController {
    
    @Autowired
    private SkillPlanService skillPlanService;
    
    // Create Skill Plan for a specific user
    @PostMapping("/{learnerId}/skillplans/create")
    public ResponseEntity<?> createSkillPlan(
            @PathVariable String learnerId,
            @RequestBody SkillPlan skillPlan) {
        try {
            skillPlan.setUserId(learnerId); // Set owner ID from path
            SkillPlan createdSkillPlan = skillPlanService.createSkillPlan(skillPlan);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "id", createdSkillPlan.getId(),
                "message", "SkillPlan created successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Creation failed: " + e.getMessage()));
        }
    }
    
    // Get all Skill Plans for a specific user
    @GetMapping("/{learnerId}/skillplans")
    public ResponseEntity<?> getSkillPlansByOwner(@PathVariable String learnerId) {
        try {
            return ResponseEntity.ok(skillPlanService.getSkillPlansByUserId(learnerId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Fetch failed: " + e.getMessage()));
        }
    }
    
    // Update Skill Plan for a specific user
    @PutMapping("/{learnerId}/skillplans/update/{skillPlanId}")
    public ResponseEntity<?> updateSkillPlan(
            @PathVariable String learnerId,
            @PathVariable String skillPlanId,
            @RequestBody SkillPlan skillPlan) {
        try {
            skillPlan.setUserId(learnerId); // Verify ownership
            
            SkillPlan updatedSkillPlan = skillPlanService.updateSkillPlan(skillPlanId, skillPlan);
            if (updatedSkillPlan == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Skill Plan not found or not owned by user"));
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "SkillPlan updated successfully",
                "plan", updatedSkillPlan
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Update failed: " + e.getMessage()));
        }
    }
    
    // Delete Skill Plan for a specific user
    @DeleteMapping("/{learnerId}/skillplans/delete/{skillPlanId}")
    public ResponseEntity<?> deleteSkillPlan(
            @PathVariable String learnerId,
            @PathVariable String skillPlanId) {
        try {
            // Verify ownership before deletion
            boolean deleted = skillPlanService.deleteSkillPlanForUser(skillPlanId, learnerId);
            if (!deleted) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Skill Plan not found or not owned by user"));
            }
            
            return ResponseEntity.ok(Map.of(
                "message", "SkillPlan deleted successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Deletion failed: " + e.getMessage()));
        }
    }
}