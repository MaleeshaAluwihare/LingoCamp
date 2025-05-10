package com.skillshareplatform.lingocamp.service.PostManagement;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.skillshareplatform.lingocamp.model.PostManagement.PostModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class PostService {

    @Autowired
    private Firestore firestore;

    public Map<String, Object> createPost(PostModel post, String userId) throws ExecutionException, InterruptedException {
        String postId = UUID.randomUUID().toString();
        post.setPostId(postId);
        post.setUserId(userId);
        post.setTimestamp(System.currentTimeMillis());

        ApiFuture<WriteResult> result = firestore.collection("Posts")
                .document(postId)
                .set(post);

        result.get(); // wait for completion
        return Map.of("message", "Post created successfully", "postId", postId);
    }

    public PostModel getPostById(String postId, String userId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("Posts").document(postId);
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            throw new NoSuchElementException("Post not found");
        }

        PostModel post = snapshot.toObject(PostModel.class);
        if (!post.getUserId().equals(userId)) {
            throw new AccessDeniedException("Access denied: not your post");
        }

        return post;
    }

    public void deletePostByUser(String postId, String userId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("Posts").document(postId);
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            throw new NoSuchElementException("Post not found");
        }

        PostModel post = snapshot.toObject(PostModel.class);
        if (!post.getUserId().equals(userId)) {
            throw new AccessDeniedException("Access denied: cannot delete this post");
        }

        docRef.delete().get();
    }

    public void updatePost(String postId, PostModel updatedPost, String userId) throws ExecutionException, InterruptedException {
        DocumentReference docRef = firestore.collection("Posts").document(postId);
        DocumentSnapshot snapshot = docRef.get().get();

        if (!snapshot.exists()) {
            throw new NoSuchElementException("Post not found");
        }

        PostModel existingPost = snapshot.toObject(PostModel.class);
        if (!existingPost.getUserId().equals(userId)) {
            throw new AccessDeniedException("Access denied: cannot update this post");
        }

        updatedPost.setPostId(postId);
        updatedPost.setUserId(userId); // ensure ownership doesn't change
        updatedPost.setTimestamp(System.currentTimeMillis());

        docRef.set(updatedPost).get();
    }
}
