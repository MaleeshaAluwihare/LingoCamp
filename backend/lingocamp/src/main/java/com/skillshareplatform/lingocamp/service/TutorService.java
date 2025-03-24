package com.skillshareplatform.lingocamp.service;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.skillshareplatform.lingocamp.model.TutorModel;
import com.skillshareplatform.lingocamp.repository.TutorRepository;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private Firestore firestore;

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

        //Save tutor to Firestore
        tutorRepository.saveTutor(tutor).get();
        return tutor.getTutorID();
    }
}
