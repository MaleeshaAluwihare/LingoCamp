package com.skillshareplatform.lingocamp.service.CourseManagement;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillshareplatform.lingocamp.model.TutorManagement.EnrollmentModel;
import com.skillshareplatform.lingocamp.repository.CourseManagement.EnrollmentRepository;

@Service
public class EnrollmentServices {

    
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // Save enrollment (user clicks "Enroll Now")
    public void enrollInCourse(EnrollmentModel enrollment) throws ExecutionException, InterruptedException {
        enrollmentRepository.saveEnrollment(enrollment);
    }

    // Get tutor stats
    public Map<String, Object> getTutorTotalSalesAndRevenue(String tutorId) throws ExecutionException, InterruptedException {
        List<EnrollmentModel> enrollments = enrollmentRepository.getEnrollmentsByTutorId(tutorId);

        int totalCoursesSold = enrollments.size();
        double totalRevenue = enrollments.stream()
                                        .mapToDouble(EnrollmentModel::getAmountPaid)
                                        .sum();
        double tutorEarnings = totalRevenue * 0.90; // 10% platform fee

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCoursesSold", totalCoursesSold);
        stats.put("totalRevenue", totalRevenue);
        stats.put("tutorEarnings", tutorEarnings);

        return stats;
    }

    public List<Map<String, Object>> getSalesByCourse(String tutorId) throws ExecutionException, InterruptedException {
    List<EnrollmentModel> enrollments = enrollmentRepository.getEnrollmentsByTutorId(tutorId);

    Map<String, List<EnrollmentModel>> groupedByCourse = enrollments.stream()
        .collect(Collectors.groupingBy(EnrollmentModel::getCourseName));

    List<Map<String, Object>> courseSalesList = new ArrayList<>();

    for (Map.Entry<String, List<EnrollmentModel>> entry : groupedByCourse.entrySet()) {
        String courseName = entry.getKey();
        List<EnrollmentModel> courseEnrollments = entry.getValue();

        int count = courseEnrollments.size();
        double totalRevenue = courseEnrollments.stream().mapToDouble(EnrollmentModel::getAmountPaid).sum();
        double tutorEarnings = totalRevenue * 0.97;

        Map<String, Object> courseSales = new HashMap<>();
        courseSales.put("courseName", courseName);
        courseSales.put("salesCount", count);
        courseSales.put("totalRevenue", totalRevenue);
        courseSales.put("tutorEarnings", tutorEarnings);

        courseSalesList.add(courseSales);
    }

    return courseSalesList;
}

    
}



