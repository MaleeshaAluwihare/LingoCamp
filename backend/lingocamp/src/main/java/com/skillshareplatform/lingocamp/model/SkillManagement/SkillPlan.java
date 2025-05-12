package com.skillshareplatform.lingocamp.model.SkillManagement;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class SkillPlan {

    private String id;                // Firestore document ID (you manually set this)
    private String userId;            // Firebase UID (owner)
    private String skillDetails;
    private String skillLevel;
    private String resources;
    private String date;              // Date in string format (can be used as required)

    public SkillPlan() {
        this.id = UUID.randomUUID().toString();
    }
}
