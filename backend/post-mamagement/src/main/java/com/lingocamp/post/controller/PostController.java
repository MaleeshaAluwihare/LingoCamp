package com.lingocamp.post.controller;

import com.lingocamp.post.model.Post;
import com.lingocamp.post.service.FirebaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/create")
    public ResponseEntity<String> createPost(@RequestBody Post post) {
        return firebaseService.createPost(post);
    }
}
