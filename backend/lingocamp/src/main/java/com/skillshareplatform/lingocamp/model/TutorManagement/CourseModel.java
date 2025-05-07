package com.skillshareplatform.lingocamp.model.TutorManagement;
import com.google.cloud.Timestamp;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseModel {

    private String courseId;  
    private String tutorId;           // Firebase UID of creator
    private String title;
    private String introduction;
    private String description;
    private double price;
    private int durationWeeks;
    private String coverImage; 
    private List<StudyMaterial> studyMaterials;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String status;           // DRAFT, PUBLISHED, ARCHIVED
    private String categories;      // ["English", "Sinhala", etc.]

    @Getter
    @Setter
    public static class StudyMaterial {
        private String materialId;    // Auto-generated
        private String title;
        private String type;          // PDF, VIDEO, QUIZ, LINK, etc.
        private String fileUrl;       // Firebase Storage URL
        private Timestamp uploadedAt;
        private int order;           // Display order in course
        
        public StudyMaterial() {
            this.materialId = UUID.randomUUID().toString();
        } 
    }
}
