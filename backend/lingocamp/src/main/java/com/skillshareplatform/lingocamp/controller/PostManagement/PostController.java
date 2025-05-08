package com.skillshareplatform.lingocamp.controller.PostManagement;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.firebase.auth.FirebaseToken;
import com.skillshareplatform.lingocamp.model.PostManagement.PostModel;
import com.skillshareplatform.lingocamp.service.PostManagement.PostService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/lingocamp/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private Firestore firestore;

    @PostMapping("/create")
    public ResponseEntity<?> createPost(@RequestBody PostModel post, HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");
            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            String userId = decodedToken.getUid();
            Map<String, Object> result = postService.createPost(post, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Post creation failed: " + e.getMessage()));
        }
    }

    @GetMapping("/myposts")
    public ResponseEntity<List<PostModel>> getMyPosts(HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");
            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String userId = decodedToken.getUid();

            ApiFuture<QuerySnapshot> future = firestore.collection("Posts")
                    .whereEqualTo("userId", userId)
                    .get();

            List<QueryDocumentSnapshot> documents = future.get().getDocuments();
            List<PostModel> posts = new ArrayList<>();

            for (QueryDocumentSnapshot doc : documents) {
                PostModel post = doc.toObject(PostModel.class);
                posts.add(post);
            }

            return ResponseEntity.ok(posts);

        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable String postId, HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");
            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
            }

            String userId = decodedToken.getUid();
            PostModel post = postService.getPostById(postId, userId);
            return ResponseEntity.ok(post);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error"));
        }
    }

    @DeleteMapping("/delete/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId, HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");
            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String userId = decodedToken.getUid();
            postService.deletePostByUser(postId, userId);
            return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error"));
        }
    }

    @PutMapping("/update/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable String postId, @RequestBody PostModel updatedPost, HttpServletRequest request) {
        try {
            FirebaseToken decodedToken = (FirebaseToken) request.getAttribute("firebaseToken");
            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String userId = decodedToken.getUid();
            postService.updatePost(postId, updatedPost, userId);
            return ResponseEntity.ok(Map.of("message", "Post updated successfully"));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Unexpected error occurred"));
        }
    }
}
