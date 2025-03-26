package com.skillshareplatform.lingocamp.service.TutorManagement;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.skillshareplatform.lingocamp.model.TutorManagement.TutorModel;
import com.skillshareplatform.lingocamp.repository.TutorManagement.TutorRepository;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private Firestore firestore;

    public void checkProfileCompletion(String uid) throws ExecutionException, InterruptedException {
        DocumentSnapshot doc = firestore.collection("Tutors").document(uid).get().get();
        if(!doc.exists() || !doc.getBoolean("profileComplete")) {
            throw new ProfileIncompleteException("Profile needs completion");
            }
    }
    public class ProfileIncompleteException extends RuntimeException {
        public ProfileIncompleteException(String message) {
            super(message);
        }
    }

    //Email validation
    private boolean isValidEmail(String email){
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

    //Auto-generate tutorID
    private String generateTutorID(int count){
        return String.format("T%04d",count+1);
    }

    public String registerTutor(TutorModel tutor, int tutorCount) throws ExecutionException, InterruptedException{

        //Email validation
        if (!isValidEmail(tutor.getEmail())){
            throw new IllegalArgumentException("Invalid Email Format");
        }
        
        //Check for duplicate email
        QuerySnapshot existingTutors = firestore.collection("Tutors")
            .whereEqualTo("email",tutor.getEmail()).get().get();
        if(!existingTutors.isEmpty()){
            throw new IllegalArgumentException("Email is already in use");
        }

        //Generate unique TutorId
        tutor.setTutorID(generateTutorID(tutorCount));

        //Set createAt timeStamp
        tutor.setCreateAt(Timestamp.now());

        tutor.setProfileComplete(true);

        //Save tutor to Firestore
        tutorRepository.saveTutor(tutor).get();
        return "Profile created successfully";
    }

    public String completeTutorProfile(String uid, TutorModel tutorData, int tutorCount) 
    throws ExecutionException, InterruptedException {
    
        DocumentSnapshot doc = firestore.collection("Tutors").document(uid).get().get();
        if (!doc.exists()) {
            // Handle new Google-signup profile
            tutorData.setUid(uid);
            
            tutorData.setTutorID(generateTutorID(tutorCount));
            
            if (!isValidEmail(tutorData.getEmail())) {
                throw new IllegalArgumentException("Invalid email format");
            }
            
            QuerySnapshot existing = firestore.collection("Tutors")
                .whereEqualTo("email", tutorData.getEmail()).get().get();
            if (!existing.isEmpty()) {
                throw new IllegalArgumentException("Email already registered");
            }

            tutorData.setCreateAt(Timestamp.now());
            tutorData.setProfileComplete(true);
            tutorRepository.saveTutor(tutorData).get();
            return "Profile created successfully";
        }

        Map<String, Object> updates = new HashMap<>();
        updates.put("firstName", tutorData.getFirstName());
        updates.put("lastName", tutorData.getLastName());
        updates.put("phoneNumber", tutorData.getPhoneNumber());
        updates.put("experience", tutorData.getExperience());
        updates.put("specialization", tutorData.getSpecialization());
        updates.put("socialLinks", tutorData.getSocialLinks());
        updates.put("profileComplete", true);

        // firestore.collection("Tutors").document(uid).update(updates).get();
        // return "Profile updated successfully";
        tutorRepository.saveTutor(tutorData).get();
        return "Profile updated successfully";
    }
}
