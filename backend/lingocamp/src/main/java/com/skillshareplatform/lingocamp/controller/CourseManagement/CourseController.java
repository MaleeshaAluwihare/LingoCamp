package com.skillshareplatform.lingocamp.controller.CourseManagement;

import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.Timestamp;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/lingocamp/api/courses")
public class CourseController {

    @Autowired
    private Firestore firestore;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_TUTOR')")
    public ResponseEntity<?> createCourse(
        @RequestBody CourseModel course,
        @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String tutorId = jwt.getSubject();
            
            if (!firestore.collection("Tutors").document(tutorId).get().get().exists()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Tutor profile not found");
            }

            course.setTutorId(tutorId);
            course.setCreatedAt(Timestamp.now());
            course.setUpdatedAt(Timestamp.now());

            DocumentReference docRef = firestore.collection("Courses").add(course).get();
            
            Map<String, String> response = new HashMap<>();
            response.put("courseId", docRef.getId());
            response.put("message", "Course created successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating course: " + e.getMessage());
        }
    }
}