package com.skillshareplatform.lingocamp.model.PostManagement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostModel {
    private String postId;
    private String userId;
    private String description;
    private String mediaUrl; 
    private long timestamp;
}