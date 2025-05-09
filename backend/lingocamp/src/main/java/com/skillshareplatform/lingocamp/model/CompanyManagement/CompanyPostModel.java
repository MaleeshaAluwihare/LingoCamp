package com.skillshareplatform.lingocamp.model.CompanyManagement;

import lombok.Getter;
import lombok.Setter;

import java.util.List;
import com.google.cloud.Timestamp;

@Getter
@Setter
public class CompanyPostModel {
    private String postId;
    private String uid; // Company UID
    private String description;
    private List<String> mediaUrls; // Firebase Storage URLs (images or videos)
    private Timestamp createdAt;
    
    private String companyEmail;
    private String companyProfileImage;
    
    public CompanyPostModel() {}
}