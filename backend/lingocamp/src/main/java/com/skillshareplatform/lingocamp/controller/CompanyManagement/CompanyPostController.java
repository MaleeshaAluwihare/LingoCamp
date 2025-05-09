package com.skillshareplatform.lingocamp.controller.CompanyManagement;

import com.google.firebase.auth.FirebaseToken;
import com.skillshareplatform.lingocamp.model.CompanyManagement.CompanyPostModel;
import com.skillshareplatform.lingocamp.service.CompanyManagement.CompanyPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lingocamp/api/company/posts")
public class CompanyPostController {

    @Autowired
    private CompanyPostService postService;

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@RequestBody Map<String, Object> postData) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!(principal instanceof FirebaseToken)) {
                return ResponseEntity.status(401).body("Unauthorized: Invalid token");
            }
            String uid = ((FirebaseToken) principal).getUid();

            String description = (String) postData.get("description");
            List<String> mediaUrls = (List<String>) postData.get("mediaUrls");

            String postId = postService.createPost(uid, description, mediaUrls);
            return ResponseEntity.ok("Post created with ID: " + postId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }

    @GetMapping("/my-posts")
    public ResponseEntity<List<CompanyPostModel>> getMyPosts() {
        try {
            FirebaseToken decodedToken = (FirebaseToken) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String uid = decodedToken.getUid();

            List<CompanyPostModel> posts = postService.getPostsByUid(uid);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }


    // @PutMapping("/update/{postId}")
    // public ResponseEntity<String> updatePost(@PathVariable String postId, @RequestBody Map<String, Object> data) {
    //     try {
    //         String uid = ((FirebaseToken) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUid();
    //         String newDesc = (String) data.get("description");
    //         postService.updatePost(uid, postId, newDesc);
    //         return ResponseEntity.ok("Post updated");
    //     } catch (Exception e) {
    //         return ResponseEntity.status(500).body("Error: " + e.getMessage());
    //     }
    // }
    @PutMapping("/update/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable String postId, @RequestBody Map<String, Object> data) {
        try {
            String uid = ((FirebaseToken) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUid();
            String newDesc = (String) data.get("description");
            List<String> mediaUrls = (List<String>) data.get("mediaUrls");

            postService.updatePost(uid, postId, newDesc, mediaUrls);  // ✅ Updated method call
            return ResponseEntity.ok("Post updated");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable String postId) {
        try {
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (!(principal instanceof FirebaseToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized: Invalid token");
            }
            String uid = ((FirebaseToken) principal).getUid();

            postService.deletePost(uid, postId);
            return ResponseEntity.ok("Post deleted successfully.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<CompanyPostModel>> getAllPosts() {
    try {
        List<CompanyPostModel> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).body(null);
    }
}
}
