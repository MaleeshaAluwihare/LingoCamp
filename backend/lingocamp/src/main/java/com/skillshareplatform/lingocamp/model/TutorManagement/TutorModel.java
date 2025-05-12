package com.skillshareplatform.lingocamp.model.TutorManagement;

import java.util.List;
import com.google.cloud.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TutorModel {

    private String firstName;
    private String lastName;
    private String email;
    private String uid; // Firebase UID (Maps Authenticator Users & Firestore Users)
    private String profileImageUrl;
    private String phoneNumber;
    private int experience;
    private List<String> specialization;
    private List<TutorSocialLink> socialLinks;
    private Timestamp createAt;
    private boolean profileComplete = false;
    private String type;

    public TutorModel(){} //Empty constructor required by Firestore

}