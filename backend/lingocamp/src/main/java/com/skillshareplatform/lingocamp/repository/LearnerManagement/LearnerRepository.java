package com.skillshareplatform.lingocamp.repository.LearnerManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.skillshareplatform.lingocamp.model.LearnerManagement.LearnerModel;

@Repository
public class LearnerRepository {

    @Autowired
    private Firestore firestore;

    public ApiFuture<WriteResult> saveLearner(LearnerModel learner){
        return firestore.collection("Learners").document(learner.getUid()).set(learner);
    }
}