package com.skillshareplatform.lingocamp.service.SkillManagement;

import com.skillshareplatform.lingocamp.model.SkillManagement.SkillPlan;
import com.skillshareplatform.lingocamp.repository.SkillManagement.SkillPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillPlanService {
    
    @Autowired
    private SkillPlanRepository skillPlanRepository;
    
    // Create Skill Plan
    public SkillPlan createSkillPlan(SkillPlan skillPlan) throws Exception {
        return skillPlanRepository.saveSkillPlan(skillPlan);
    }
    
    // Get Skill Plans by User ID
    public List<SkillPlan> getSkillPlansByUserId(String userId) throws Exception {
        return skillPlanRepository.findByUserId(userId);
    }
    
    // Update Skill Plan
    public SkillPlan updateSkillPlan(String skillPlanId, SkillPlan skillPlan) throws Exception {
        SkillPlan existingPlan = skillPlanRepository.findById(skillPlanId);
        if (existingPlan == null) {
            throw new Exception("SkillPlan not found");
        }
        skillPlanRepository.updateSkillPlan(skillPlanId, skillPlan);
        return skillPlan;
    }
    
    // Delete Skill Plan - Modified to return boolean
    public boolean deleteSkillPlanForUser(String skillPlanId, String userId) throws Exception {
        SkillPlan existingPlan = skillPlanRepository.findById(skillPlanId);
        if (existingPlan == null || !existingPlan.getUserId().equals(userId)) {
            return false;
        }
        skillPlanRepository.deleteById(skillPlanId);
        return true;
    }
}