package com.skillshareplatform.lingocamp.repository.CourseManagement;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.concurrent.ExecutionException;

@Repository
public class CourseRepository {

    @Autowired
    private Firestore firestore;

    public boolean doesTutorExist(String tutorId) throws ExecutionException, InterruptedException {
        DocumentReference tutorRef = firestore.collection("Tutors").document(tutorId);
        DocumentSnapshot tutorSnapshot = tutorRef.get().get();
        return tutorSnapshot.exists();
    }

    public DocumentReference saveCourse(CourseModel course) throws ExecutionException, InterruptedException {
        ApiFuture<DocumentReference> future = firestore.collection("Courses").add(course);
        return future.get();
    }
}
