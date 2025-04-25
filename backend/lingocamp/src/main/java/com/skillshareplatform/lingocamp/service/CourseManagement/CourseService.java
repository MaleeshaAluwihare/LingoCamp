package com.skillshareplatform.lingocamp.service.CourseManagement;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import com.skillshareplatform.lingocamp.repository.CourseManagement.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private Firestore firestore;

    public Map<String, Object> createCourse(CourseModel course, String tutorId) throws ExecutionException, InterruptedException {
        if (!courseRepository.doesTutorExist(tutorId)) {
            throw new IllegalArgumentException("Tutor profile not found");
        }

        if (course.getTitle() == null || course.getTitle().isBlank()) {
            throw new IllegalArgumentException("Course title is required");
        }

        course.setTutorId(tutorId);
        course.setCreatedAt(Timestamp.now());
        course.setUpdatedAt(Timestamp.now());
        course.setStatus(course.getStatus());

        CourseModel savedCourse = courseRepository.saveCourse(course);
        
        return Map.of(
            "courseId", savedCourse.getCourseId(),
            "message", "Course created successfully",
            "course", savedCourse
        );
    }


    public void deleteCourseByTutor(String courseId, String tutorId) {
        try {
            // Delete course document from Firebase Firestore
            ApiFuture<DocumentSnapshot> writeResult = firestore.collection("Courses").document(courseId).get();
            DocumentSnapshot document = writeResult.get();

            if (!document.exists()) {
                throw new NoSuchElementException("Course not found in Firestore");
            }

            String ownerId = document.getString("tutorId");

            if (ownerId == null || !ownerId.equals(tutorId)) {
                throw new AccessDeniedException("You are not authorized to delete this course");
            }

            // Delete from Firestore
            firestore.collection("Courses").document(courseId).delete().get();

        } catch (InterruptedException | ExecutionException e) {
            throw new RuntimeException("Error accessing Firestore", e);
        }
    }

    public void updateCourse(String courseId, CourseModel updatedCourse, String tutorId)
        throws ExecutionException, InterruptedException {

            // Get the document from Firestore
            DocumentReference docRef = firestore.collection("Courses").document(courseId);
            DocumentSnapshot snapshot = docRef.get().get();

            if (!snapshot.exists()) {
                throw new NoSuchElementException("Course not found");
            }

            String courseTutorId = snapshot.getString("tutorId");
            if (!tutorId.equals(courseTutorId)) {
                throw new AccessDeniedException("You are not authorized to update this course");
            }

            updatedCourse.setCourseId(courseId);  // Ensure ID stays consistent
            updatedCourse.setTutorId(tutorId);    // Protect from overwriting ownership
            updatedCourse.setUpdatedAt(Timestamp.now());

            docRef.set(updatedCourse); // Overwrites the entire course

        }

    public CourseModel getCourseById(String courseId, String tutorId)
        throws ExecutionException, InterruptedException, AccessDeniedException {

        DocumentReference docRef = firestore.collection("Courses").document(courseId);
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            throw new NoSuchElementException("Course not found");
        }

        String courseTutorId = snapshot.getString("tutorId");
        if (!tutorId.equals(courseTutorId)) {
            throw new AccessDeniedException("You are not authorized to access this course");
        }

        return snapshot.toObject(CourseModel.class);
    }
}