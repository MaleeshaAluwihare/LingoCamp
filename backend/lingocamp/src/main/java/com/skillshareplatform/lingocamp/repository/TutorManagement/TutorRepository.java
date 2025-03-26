package com.skillshareplatform.lingocamp.repository.TutorManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.skillshareplatform.lingocamp.model.TutorManagement.TutorModel;

@Repository
public class TutorRepository {

    @Autowired
    private Firestore firestore;

    public ApiFuture<WriteResult> saveTutor(TutorModel tutor){
        return firestore.collection("Tutors").document(tutor.getTutorID()).set(tutor);
    }
}

//Connected to Firestore.
//Created a method to save a Tutor object into Firestore.