package com.skillshareplatform.lingocamp.model.PostManagement;

import java.util.List;

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

    private List<String> likes;
    private List<Comment> comments;

    public static class Comment {
        private String userId;
        private String comment;
        private long timestamp;

        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getComment() { return comment; }
        public void setComment(String comment) { this.comment = comment; }

        public long getTimestamp() { return timestamp; }
        public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    }
}