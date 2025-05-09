package com.skillshareplatform.lingocamp.model.LearnerManagement;

import com.google.cloud.Timestamp;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class LearnerModel {
    private String about;
    private String address;
    private String companyName;
    private String email;
    private int experience; // Default empty string in frontend = 0 here
    private String firstName;
    private String lastName;
    private String learningGoals;
    private String password;
    private String phoneNumber;
    private String preferredLanguages; // Keep as String as per JSON
    private String proficiencyLevel;
    private String profileImageUrl;
    private List<String> socialLinks;
    private String type;
    private String uid;
    private String username;
    private Timestamp createAt;
    private boolean profileComplete = false;

    public LearnerModel() {} // Required by Firestore
}
