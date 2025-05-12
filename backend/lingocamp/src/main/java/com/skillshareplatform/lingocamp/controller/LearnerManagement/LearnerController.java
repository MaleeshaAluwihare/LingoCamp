package com.skillshareplatform.lingocamp.controller.LearnerManagement;

import com.skillshareplatform.lingocamp.model.LearnerManagement.LearnerModel;
import com.skillshareplatform.lingocamp.service.LearnerManagement.LearnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/lingocamp/api/learners")
public class LearnerController {

    @Autowired
    private LearnerService learnerService;

    @Autowired
    private Firestore firestore;
    
    // User register
    @PostMapping("/register")
    public ResponseEntity<String> registerLearner(@RequestBody LearnerModel learner) {
        try {
            String learnerId = learnerService.registerLearner(learner);
            return ResponseEntity.ok(learnerId);  
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while registering the learner");
        }
    }

    // Get learner by UID
    @GetMapping("/{uid}")
    public ResponseEntity<LearnerModel> getLearnerByUid(@PathVariable String uid) {
        try {
            DocumentSnapshot doc = firestore.collection("Learners").document(uid).get().get();
            if (doc.exists()) {
                LearnerModel learner = doc.toObject(LearnerModel.class);
                return ResponseEntity.ok(learner);
            }
            return ResponseEntity.notFound().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Profile completion
    @PostMapping("/completeprofile/{uid}")
    public ResponseEntity<String> completeProfile(@PathVariable String uid, @RequestBody LearnerModel learnerData) {
        try {
            String result = learnerService.completeLearnerProfile(uid, learnerData);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error completing profile");
        }
    }

    // Update existing profile (PATCH for partial updates)
    @PatchMapping("/updateprofile/{uid}")
    public ResponseEntity<String> updateLearnerProfile(@PathVariable String uid, @RequestBody LearnerModel learnerData) {
        try {
            String result = learnerService.updateLearnerProfile(uid, learnerData);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }

    // Delete existing profile
    @DeleteMapping("/deleteprofile/{uid}")
    public ResponseEntity<String> deleteLearnerProfile(@PathVariable String uid) {
        try {
            learnerService.deleteLearnerProfile(uid);
            return ResponseEntity.ok("Profile deleted successfully");
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting profile");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
