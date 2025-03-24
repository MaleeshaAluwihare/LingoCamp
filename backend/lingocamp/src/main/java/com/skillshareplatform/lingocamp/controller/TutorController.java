package com.skillshareplatform.lingocamp.controller;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.skillshareplatform.lingocamp.model.TutorModel;
import com.skillshareplatform.lingocamp.service.TutorService;

@RestController
@RequestMapping("/lingocamp/api/tutors")
public class TutorController {

    @Autowired
    private TutorService tutorService;

    @Autowired
    private Firestore firestore;
    
    @PostMapping("/register")
    public ResponseEntity<String> registerTutor(@RequestBody TutorModel tutor) {
        try{
            //count existing tutors to generate new tutorID
            QuerySnapshot tutorSnapshot = firestore.collection("Tutors").get().get();
            int tutorCount = tutorSnapshot.size();

            //Register the tutor and return tutor ID
            String tutorId = tutorService.registerTutor(tutor, tutorCount);
            return ResponseEntity.ok(tutorId);  

        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }catch (ExecutionException | InterruptedException e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while registering the tutor");
        }
    }
}
