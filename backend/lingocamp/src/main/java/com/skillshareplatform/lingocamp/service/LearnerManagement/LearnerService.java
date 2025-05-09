package com.skillshareplatform.lingocamp.service.LearnerManagement;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.skillshareplatform.lingocamp.model.LearnerManagement.LearnerModel;
import com.skillshareplatform.lingocamp.repository.LearnerManagement.LearnerRepository;

@Service
public class LearnerService {

    @Autowired
    private LearnerRepository learnerRepository;

    @Autowired
    private Firestore firestore;

    // Check if the learner's profile is complete
    public void checkProfileCompletion(String uid) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firestore.collection("Learners").document(uid).get().get();
        if (!doc.exists() || !doc.getBoolean("profileComplete")) {
            throw new ProfileIncompleteException("Profile needs completion");
        }
    }

    // Custom exception for incomplete profile
    public class ProfileIncompleteException extends RuntimeException {
        public ProfileIncompleteException(String message) {
            super(message);
        }
    }

    // Validate email format using regex
    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    // Register a new learner
    public String registerLearner(LearnerModel learner) throws ExecutionException, InterruptedException {
        if (!isValidEmail(learner.getEmail())) {
            throw new IllegalArgumentException("Invalid Email Format");
        }
    
        // Check for duplicate email
        QuerySnapshot existingLearners = firestore.collection("Learners")
            .whereEqualTo("email", learner.getEmail()).get().get();
        if (!existingLearners.isEmpty()) {
            throw new IllegalArgumentException("Email is already in use");
        }
    
        learner.setCreateAt(Timestamp.now());
        learner.setProfileComplete(false); // Initially, profile is not complete
    
        learnerRepository.saveLearner(learner).get();
        return learner.getUid(); // Return UID
    }
    
    // Complete the learner's profile (onboarding step)
    public String completeLearnerProfile(String uid, LearnerModel learnerData)
            throws ExecutionException, InterruptedException {

        DocumentSnapshot doc = firestore.collection("Learners").document(uid).get().get();
        if (!doc.exists()) {
            learnerData.setUid(uid);

            if (!isValidEmail(learnerData.getEmail())) {
                throw new IllegalArgumentException("Invalid email format");
            }

            QuerySnapshot existing = firestore.collection("Learners")
                    .whereEqualTo("email", learnerData.getEmail()).get().get();
            if (!existing.isEmpty()) {
                throw new IllegalArgumentException("Email already registered");
            }

            learnerData.setCreateAt(Timestamp.now());
            learnerData.setProfileComplete(true);
            learnerRepository.saveLearner(learnerData).get();
            return "Profile created successfully";
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("firstName", learnerData.getFirstName());
        updates.put("lastName", learnerData.getLastName());
        updates.put("preferredLanguages", learnerData.getPreferredLanguages());
        updates.put("proficiencyLevel", learnerData.getProficiencyLevel());
        updates.put("learningGoals", learnerData.getLearningGoals());
        updates.put("profileComplete", true);

        learnerRepository.saveLearner(learnerData).get();
        return "Profile updated successfully";
    }

    // Update the learner's profile with new data
    public String updateLearnerProfile(String uid, LearnerModel learnerData)
            throws ExecutionException, InterruptedException {

        DocumentSnapshot doc = firestore.collection("Learners").document(uid).get().get();

        if (!doc.exists()) {
            throw new IllegalArgumentException("User profile not found");
        }

        Map<String, Object> updates = new HashMap<>();

        if (learnerData.getFirstName() != null) {
            updates.put("firstName", learnerData.getFirstName());
        }
        if (learnerData.getLastName() != null) {
            updates.put("lastName", learnerData.getLastName());
        }
        if (learnerData.getProfileImageUrl() != null) {
            updates.put("profileImageUrl", learnerData.getProfileImageUrl());
        }
        if (learnerData.getPreferredLanguages() != null) {
            updates.put("preferredLanguages", learnerData.getPreferredLanguages());
        }
        if (learnerData.getProficiencyLevel() != null) {
            updates.put("proficiencyLevel", learnerData.getProficiencyLevel());
        }
        if (learnerData.getLearningGoals() != null) {
            updates.put("learningGoals", learnerData.getLearningGoals());
        }
        if (learnerData.getAbout() != null) {
            updates.put("about", learnerData.getAbout());
        }
        if (learnerData.getAddress() != null) {
            updates.put("address", learnerData.getAddress());
        }
        if (learnerData.getCompanyName() != null) {
            updates.put("companyName", learnerData.getCompanyName());
        }
        if (learnerData.getPhoneNumber() != null) {
            updates.put("phoneNumber", learnerData.getPhoneNumber());
        }
        if (learnerData.getSocialLinks() != null) {
            updates.put("socialLinks", learnerData.getSocialLinks());
        }

        updates.remove("uid");
        updates.remove("email");
        updates.remove("createAt");

        firestore.collection("Learners").document(uid).update(updates).get();
        return "Profile updated successfully";
    }

    // Delete the learner's profile
    public void deleteLearnerProfile(String uid) throws InterruptedException, ExecutionException {
        firestore.collection("Learners").document(uid).delete().get();
    }
}
