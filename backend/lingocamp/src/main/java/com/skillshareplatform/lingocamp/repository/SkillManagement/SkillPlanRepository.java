package com.skillshareplatform.lingocamp.repository.SkillManagement;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.skillshareplatform.lingocamp.model.SkillManagement.SkillPlan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Repository
public class SkillPlanRepository {

    @Autowired
    private Firestore firestore;

    private static final String COLLECTION_NAME = "SkillPlans";

    // Save a Skill Plan
    public SkillPlan saveSkillPlan(SkillPlan skillPlan) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(skillPlan.getId());
        ApiFuture<WriteResult> future = docRef.set(skillPlan);
        future.get(); 
        return skillPlan;
    }

    // Get Skill Plans by User ID
    public List<SkillPlan> findByUserId(String userId) throws ExecutionException, InterruptedException {
        CollectionReference skillPlansRef = firestore.collection(COLLECTION_NAME);
        ApiFuture<QuerySnapshot> future = skillPlansRef.whereEqualTo("userId", userId).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        return documents.stream()
                        .map(doc -> doc.toObject(SkillPlan.class))
                        .toList();
    }

    // Find a Skill Plan by ID
    public SkillPlan findById(String id) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(id);
        DocumentSnapshot document = docRef.get().get();
        if (document.exists()) {
            return document.toObject(SkillPlan.class);
        }
        return null;
    }

    // Delete Skill Plan by ID
    public void deleteById(String id) throws ExecutionException, InterruptedException {
        firestore.collection(COLLECTION_NAME).document(id).delete().get();
    }

    // Update Skill Plan fields
    public void updateSkillPlan(String skillPlanId, SkillPlan skillPlan) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection(COLLECTION_NAME).document(skillPlanId);
        DocumentSnapshot document = docRef.get().get();
        if (document.exists()) {
            Map<String, Object> updates = new HashMap<>();
            if (skillPlan.getSkillDetails() != null) updates.put("skillDetails", skillPlan.getSkillDetails());
            if (skillPlan.getSkillLevel() != null) updates.put("skillLevel", skillPlan.getSkillLevel());
            if (skillPlan.getResources() != null) updates.put("resources", skillPlan.getResources());
            if (skillPlan.getDate() != null) updates.put("date", skillPlan.getDate());
            docRef.update(updates);
        }
    }
}
