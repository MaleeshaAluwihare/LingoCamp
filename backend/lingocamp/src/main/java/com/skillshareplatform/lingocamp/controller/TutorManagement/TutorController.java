package com.skillshareplatform.lingocamp.controller.TutorManagement;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.skillshareplatform.lingocamp.model.TutorManagement.TutorModel;
import com.skillshareplatform.lingocamp.service.TutorManagement.TutorService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/lingocamp/api/tutors")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    @Autowired
    private Firestore firestore;
    
    //user register
    @PostMapping("/register")
    public ResponseEntity<String> registerTutor(@RequestBody TutorModel tutor) {
        try{
            tutorService.registerTutor(tutor);
            return ResponseEntity.ok("Registered successfully");  

        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (ExecutionException | InterruptedException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while registering the tutor");
        }
    }

    // get tutor
    @GetMapping("/{uid}")
    public ResponseEntity<TutorModel> getTutorByUid(@PathVariable String uid,HttpServletRequest request) {
        try {

            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null || !decodedToken.getUid().equals(uid)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // user trying to access another user's data
            }
            
            DocumentSnapshot doc = firestore.collection("Tutors").document(uid).get().get();
            
            if(doc.exists()) {
                TutorModel tutor = doc.toObject(TutorModel.class);
                return ResponseEntity.ok(tutor);
            }
            
            return ResponseEntity.notFound().build();
            
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Profile completion 
    @PostMapping("/completeprofile/{uid}")
    public ResponseEntity<String> completeProfile(
        @PathVariable String uid,
        @RequestBody TutorModel tutorData
    ) {
        try {
            QuerySnapshot tutorSnapshot = firestore.collection("Tutors").get().get();
            int tutorCount = tutorSnapshot.size();

            String result = tutorService.completeTutorProfile(uid, tutorData, tutorCount);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error completing profile");
        }
    }

    // Update existing profile (PATCH for partial updates)
    @PatchMapping("updateprofile/{uid}")
    public ResponseEntity<String> updateTutorProfile(@PathVariable String uid,@RequestBody TutorModel tutorData,HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null || !decodedToken.getUid().equals(uid)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // user trying to access another user's data
            }

            String result = tutorService.updateTutorProfile(uid, tutorData);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile");
        }
    }

    // Delete existing profile
    @DeleteMapping("deleteprofile/{uid}")
    public ResponseEntity<String> deleteTutorProfile(@PathVariable String uid,HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null || !decodedToken.getUid().equals(uid)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // user trying to access another user's data
            }

            tutorService.deleteTutorProfile(uid);
            return ResponseEntity.ok("Profile deleted successfully");
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not in authentication system");
        }catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Deletion failed");
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
}
