package com.lingocamp.post.service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.cloud.FirestoreClient;
import com.lingocamp.post.model.Post;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;


@Service
public class FirebaseService {

    private static final String COLLECTION_NAME = "posts";

    //Read all posts
    public List<Map<String, Object>> getAllPosts() throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();
        ApiFuture<QuerySnapshot> future = firestore.collection(COLLECTION_NAME).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        List<Map<String, Object>> posts = new ArrayList<>();

        for (QueryDocumentSnapshot document : documents) {
            Map<String, Object> post = document.getData();
            post.put("postId", document.getId()); // Add the document ID
            posts.add(post);
        }

        return posts;
    }

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

    //Read one post
    public Map<String, Object> getPostById(String postId) throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference docRef = firestore.collection("posts").document(postId);
        DocumentSnapshot document = docRef.get().get();
        if (document.exists()) {
            return document.getData();
        } else {
            throw new Exception("Post not found");
        }
    }

    //Update a post
    public String updatePost(String postId, Map<String, Object> updates) throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference docRef = firestore.collection("posts").document(postId);
        docRef.update(updates);
        return "Post updated successfully!";
    }

    //Delete a post
    public String deletePost(String postId) throws Exception {
        Firestore firestore = FirestoreClient.getFirestore();
        DocumentReference docRef = firestore.collection("posts").document(postId);
        docRef.delete();
        return "Post deleted successfully!";
    }

}