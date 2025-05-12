package com.skillshareplatform.lingocamp.repository.CourseManagement;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
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

    public CourseModel saveCourse(CourseModel course) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("Courses").document();
        
        course.setCourseId(docRef.getId());
        
        ApiFuture<WriteResult> future = docRef.set(course);
        future.get(); 
        
        return course;
    }

    
    public List<CourseModel> findAllCourses(String language, String sort, int page, int size)
            throws ExecutionException, InterruptedException {

        CollectionReference coursesRef = firestore.collection("Courses");
        Query query = coursesRef;

        // Apply filtering
        if (language != null && !language.isEmpty()) {
            query = query.whereEqualTo("categories", language);
        }

        // Apply sorting
        query = sort.equalsIgnoreCase("desc") ?
                query.orderBy("price", Query.Direction.DESCENDING) :
                query.orderBy("price", Query.Direction.ASCENDING);

        // Simulate pagination with skip (only suitable for small-medium datasets)
        int skip = page * size;
        ApiFuture<QuerySnapshot> future = query.limit(skip + size).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        // Skip documents from previous pages
        if (skip >= documents.size()) {
            return Collections.emptyList();
        }

        documents = documents.subList(skip, documents.size());

        List<CourseModel> courses = new ArrayList<>();
        for (QueryDocumentSnapshot doc : documents) {
            courses.add(doc.toObject(CourseModel.class));
        }

        return courses;
    }
}
