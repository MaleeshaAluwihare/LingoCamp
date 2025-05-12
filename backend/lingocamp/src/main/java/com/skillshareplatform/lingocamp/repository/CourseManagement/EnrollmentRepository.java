package com.skillshareplatform.lingocamp.repository.CourseManagement;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.skillshareplatform.lingocamp.model.TutorManagement.EnrollmentModel;

@Repository
public class EnrollmentRepository {

    @Autowired
    private Firestore firestore;

    // Save new enrollment
    public void saveEnrollment(EnrollmentModel enrollment) throws ExecutionException, InterruptedException {
        CollectionReference enrollmentsRef = firestore.collection("Enrollments");
        DocumentReference docRef = enrollmentsRef.document();

        enrollment.setEnrollmentId(docRef.getId());
        enrollment.setPurchaseDate(LocalDateTime.now().toString());

        ApiFuture<WriteResult> future = docRef.set(enrollment);
        future.get(); 
    }

    // Get all enrollments for a specific tutor
    public List<EnrollmentModel> getEnrollmentsByTutorId(String tutorId) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> query = firestore.collection("Enrollments")
                .whereEqualTo("tutorId", tutorId)
                .get();

        List<QueryDocumentSnapshot> documents = query.get().getDocuments();
        List<EnrollmentModel> result = new ArrayList<>();

        for (DocumentSnapshot doc : documents) {
            EnrollmentModel enrollment = doc.toObject(EnrollmentModel.class);
            result.add(enrollment);
        }

        return result;
    }
    
    
    
}
