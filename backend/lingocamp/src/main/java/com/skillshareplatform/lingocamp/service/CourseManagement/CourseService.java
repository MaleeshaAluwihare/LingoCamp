package com.skillshareplatform.lingocamp.service.CourseManagement;

import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.skillshareplatform.lingocamp.model.TutorManagement.CourseModel;
import com.skillshareplatform.lingocamp.repository.CourseManagement.CourseRepository;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

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

        DocumentReference docRef = courseRepository.saveCourse(course);
        return Map.of(
            "courseId", docRef.getId(),
            "message", "Course created successfully"
        );
    }
}