package com.skillshareplatform.lingocamp.controller.CourseManagement;

import com.google.firebase.auth.FirebaseToken;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.skillshareplatform.lingocamp.service.CourseManagement.CourseService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/lingocamp/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @PostMapping("/create")
    public ResponseEntity<?> createCourse(
        @RequestBody CourseModel course,
        HttpServletRequest request
    ) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            String tutorId = decodedToken.getUid();
            Map<String, Object> result = courseService.createCourse(course, tutorId);

            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Course creation failed: " + e.getMessage()));
        }
    }
}