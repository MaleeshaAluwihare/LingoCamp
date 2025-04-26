package com.lingocamp.post.controller;

import com.lingocamp.post.model.Post;
import com.lingocamp.post.service.FirebaseService;

import java.util.Map;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@RequestBody Post post) {
        return firebaseService.createPost(post);
    }
    
    // 1. Get all posts
    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllPosts() {
        try {
            List<Map<String, Object>> posts = firebaseService.getAllPosts();
        return ResponseEntity.ok(posts);
        } catch (Exception e) {
        return ResponseEntity.internalServerError().build();
        }
    }

    // 2. Get a post by ID
    @GetMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> getPostById(@PathVariable String postId) {
        try {
            Map<String, Object> post = firebaseService.getPostById(postId);
        return ResponseEntity.ok(post);
        } catch (Exception e) {
        return ResponseEntity.notFound().build();
        }
    }

    // 3. Update a post by ID
    @PutMapping("/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable String postId, @RequestBody Map<String, Object> updates) {
        try {
            String result = firebaseService.updatePost(postId, updates);
        return ResponseEntity.ok(result);
        } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error updating post");
        }
    }

    // 4. Delete a post by ID
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable String postId) {
        try {
            String result = firebaseService.deletePost(postId);
        return ResponseEntity.ok(result);
        } catch (Exception e) {
        return ResponseEntity.internalServerError().body("Error deleting post");
        }
    }
}
