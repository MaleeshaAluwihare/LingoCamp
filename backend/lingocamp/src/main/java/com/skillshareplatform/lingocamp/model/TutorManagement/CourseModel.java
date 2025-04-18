package com.skillshareplatform.lingocamp.model.TutorManagement;
import com.google.cloud.Timestamp;
import java.util.List;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseModel {

    private String tutorId;           // Firebase UID of creator
    private String title;
    private String description;
    private double price;
    private int durationWeeks;        // Course duration in weeks
    private List<StudyMaterial> studyMaterials;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private String status;           // DRAFT, PUBLISHED, ARCHIVED
    private List<String> categories; // Optional: ["English", "Sinhala", etc.]

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
