package com.skillshareplatform.lingocamp.model.CompanyManagement;

import java.util.List;

import com.google.cloud.Timestamp;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompanyModel {

    private String companyName;
    private String username;
    private String address;
    private String about;
    private String email;
    private String uid; // Firebase UID (Maps Authenticator Users & Firestore Users)
    private String profileImageUrl;
    private String phoneNumber;
    private List<CompanySocialLinks> socialLinks;
    private Timestamp createAt;
    private boolean profileComplete = false;

     public CompanyModel() {} 
}
