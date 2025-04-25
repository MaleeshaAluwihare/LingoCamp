package com.lingocamp.post.service;

import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.cloud.FirestoreClient;
import com.lingocamp.post.model.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class FirebaseService {

    private static final String COLLECTION_NAME = "posts";

    public ResponseEntity<String> createPost(Post post) {
        Firestore firestore = FirestoreClient.getFirestore();
        CollectionReference posts = firestore.collection(COLLECTION_NAME);

        Map<String, Object> postData = new HashMap<>();
        postData.put("userId", post.getUserId());
        postData.put("description", post.getDescription());
        postData.put("mediaUrls", post.getMediaUrls());
        postData.put("timestamp", post.getTimestamp());

        posts.add(postData);

        return ResponseEntity.ok("Post created successfully in Firestore!");
    }
}