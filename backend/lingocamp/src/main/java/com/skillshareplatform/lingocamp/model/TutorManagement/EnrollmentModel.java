package com.skillshareplatform.lingocamp.model.TutorManagement;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnrollmentModel {

    private String enrollmentId;
    private String courseId;
    private String courseName;
    private String tutorId;
    private String learnerId;
    private Double amountPaid;
    private String purchaseDate;
    
  }