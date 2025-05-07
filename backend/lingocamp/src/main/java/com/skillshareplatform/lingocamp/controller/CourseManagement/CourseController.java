package com.skillshareplatform.lingocamp.controller.CourseManagement;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.Query;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.FirebaseToken;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import com.skillshareplatform.lingocamp.service.CourseManagement.CourseService;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/lingocamp/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private Firestore firestore;

    @PostMapping("/create")
    public ResponseEntity<?> createCourse(@RequestBody CourseModel course,HttpServletRequest request
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

    @GetMapping("/mycourses")
    public ResponseEntity<List<CourseModel>> getMyCourses(HttpServletRequest request) {
        try {
            // Get authenticated Firebase user
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String tutorId = decodedToken.getUid();

            // Query Firestore for courses with matching tutorId
            ApiFuture<QuerySnapshot> future = firestore.collection("Courses")
                    .whereEqualTo("tutorId", tutorId)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            List<CourseModel> courses = new ArrayList<>();

            for (QueryDocumentSnapshot doc : documents) {
                CourseModel course = doc.toObject(CourseModel.class);
                courses.add(course);
            }

            return ResponseEntity.ok(courses);

        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("course/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable String courseId, HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            String tutorId = decodedToken.getUid();

            CourseModel course = courseService.getCourseById(courseId, tutorId);
            return ResponseEntity.ok(course);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error"));
        }
    }


   @DeleteMapping("deletecourse/{courseId}")
    public ResponseEntity<?> deleteCourse(@PathVariable String courseId, HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String tutorId = decodedToken.getUid();

            courseService.deleteCourseByTutor(courseId, tutorId);
            return ResponseEntity.ok(Map.of("message", "Course deleted successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error"));
        }
    }

    @PutMapping("/update/{courseId}")
    public ResponseEntity<?> updateCourse(@PathVariable String courseId,@RequestBody CourseModel updatedCourse,HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");

            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String tutorId = decodedToken.getUid();

            courseService.updateCourse(courseId, updatedCourse, tutorId);
            return ResponseEntity.ok(Map.of("message", "Course updated successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error occurred"));
        }
    }

    //endpoint for learners
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllPublishedCourses(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "6") int size,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "asc") String sortByPrice
    ) {
        try {
            CollectionReference coursesRef = firestore.collection("Courses");
            Query query = coursesRef.whereEqualTo("status", "PUBLISHED");

            if (category != null && !category.isEmpty()) {
                query = query.whereEqualTo("categories", category);
            }

            // Sorting (Firestore only supports ordering with indexing on combined fields)
            // query = query.orderBy("price", sortByPrice.equals("asc") ? Direction.ASCENDING : Direction.DESCENDING);

            ApiFuture<QuerySnapshot> querySnapshot = query.get();
            List<QueryDocumentSnapshot> documents = querySnapshot.get().getDocuments();

            int startIndex = (page - 1) * size;
            int endIndex = Math.min(startIndex + size, documents.size());

            List<CourseModel> paginatedCourses = documents.subList(startIndex, endIndex)
                    .stream()
                    .map(doc -> doc.toObject(CourseModel.class))
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("courses", paginatedCourses);
            response.put("total", documents.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }   
}