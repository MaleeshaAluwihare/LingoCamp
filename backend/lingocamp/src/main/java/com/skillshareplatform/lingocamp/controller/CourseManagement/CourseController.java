package com.skillshareplatform.lingocamp.controller.CourseManagement;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/lingocamp/api/courses")
public class CourseController {

    @Autowired
    private Firestore firestore;

    @PostMapping("/create")
    public ResponseEntity<?> createCourse(
        @RequestBody CourseModel course,
        @AuthenticationPrincipal String tutorId  // Changed from Jwt to String
    ) {
        try {
            // Validate tutor existence
            DocumentReference tutorRef = firestore.collection("Tutors").document(tutorId);
            DocumentSnapshot tutorSnapshot = tutorRef.get().get();
            
            if (!tutorSnapshot.exists()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Tutor profile not found"));
            }

            // Validate course data
            if (course.getTitle() == null || course.getTitle().isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Course title is required"));
            }

            // Set course metadata
            course.setTutorId(tutorId);
            course.setCreatedAt(Timestamp.now());
            course.setUpdatedAt(Timestamp.now());
            course.setStatus("DRAFT");

            // Add to Firestore
            ApiFuture<DocumentReference> future = firestore.collection("Courses").add(course);
            DocumentReference docRef = future.get();

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                        "courseId", docRef.getId(),
                        "message", "Course created successfully"
                    ));

        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Course creation failed: " + e.getMessage()));
        }
    }
}