package com.skillshareplatform.lingocamp.controller.CourseManagement;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillshareplatform.lingocamp.model.TutorManagement.EnrollmentModel;
import com.skillshareplatform.lingocamp.service.CourseManagement.EnrollmentServices;

@RestController
@RequestMapping("/lingocamp/api/courses")
public class EnrollmentController {

    @Autowired
    private EnrollmentServices enrollmentServices;
    
    // Enroll user in a course
    @PostMapping("/enroll")
    public ResponseEntity<String> enrollInCourse(@RequestBody EnrollmentModel enrollment) {
        try {
            enrollmentServices.enrollInCourse(enrollment);
            return ResponseEntity.ok("Enrollment successful.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Enrollment failed: " + e.getMessage());
        }
    }

    // Get tutor sales statistics
    @GetMapping("/sales/stats/{tutorId}")
    public ResponseEntity<Map<String, Object>> getTutorSalesStats(@PathVariable String tutorId) {
        try {
            Map<String, Object> stats = enrollmentServices.getTutorTotalSalesAndRevenue(tutorId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/sales/by-course/{tutorId}")
    public ResponseEntity<List<Map<String, Object>>> getSalesByCourse(@PathVariable String tutorId) {
        try {
            List<Map<String, Object>> courseSales = enrollmentServices.getSalesByCourse(tutorId);
            return ResponseEntity.ok(courseSales);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

}
