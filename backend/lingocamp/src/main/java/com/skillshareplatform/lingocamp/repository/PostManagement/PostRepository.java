package com.skillshareplatform.lingocamp.repository.PostManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.skillshareplatform.lingocamp.model.PostManagement.PostModel;

@Repository
public class PostRepository {

    @Autowired
    private Firestore firestore;

    public ApiFuture<WriteResult> savePost(PostModel post){
        return firestore.collection("Posts").document(post.getPostId()).set(post);
    }
}