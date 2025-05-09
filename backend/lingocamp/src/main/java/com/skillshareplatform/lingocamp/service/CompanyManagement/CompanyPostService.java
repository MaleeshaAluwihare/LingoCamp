package com.skillshareplatform.lingocamp.service.CompanyManagement;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.QueryDocumentSnapshot;
import com.skillshareplatform.lingocamp.model.CompanyManagement.CompanyPostModel;
import com.skillshareplatform.lingocamp.repository.CompanyManagement.CompanyPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;

@Service
public class CompanyPostService {

    @Autowired
    private CompanyPostRepository postRepository;
    @Autowired
    private com.google.cloud.firestore.Firestore firestore;
    
    

    public String createPost(String uid, String description, List<String> mediaUrls) throws ExecutionException, InterruptedException {
        if (mediaUrls == null || mediaUrls.size() > 3) {
            throw new IllegalArgumentException("Maximum 3 media files are allowed.");
        }
    
        // ✅ Fetch email and profile image from Tutors collection
        DocumentSnapshot tutorDoc = firestore.collection("Tutors").document(uid).get().get();
        String email = tutorDoc.contains("email") ? tutorDoc.getString("email") : null;
        String profileImg = tutorDoc.contains("profileImageUrl") ? tutorDoc.getString("profileImageUrl") : null;
    
        CompanyPostModel post = new CompanyPostModel();
        post.setPostId(UUID.randomUUID().toString());
        post.setUid(uid);
        post.setDescription(description);
        post.setMediaUrls(mediaUrls);
        post.setCreatedAt(Timestamp.now());
    
        // ✅ Set additional info
        post.setCompanyEmail(email);
        post.setCompanyProfileImage(profileImg);
    
        postRepository.savePost(uid, post).get();
        return post.getPostId();
    }
    


    public List<CompanyPostModel> getPostsByUid(String uid) throws ExecutionException, InterruptedException {
        return postRepository.getPostsByUid(uid).get();
    }


    public void deletePost(String uid, String postId) throws ExecutionException, InterruptedException {
        DocumentReference postRef = firestore.collection("CompanyPosts")
                .document(uid).collection("posts").document(postId);

        DocumentSnapshot snapshot = postRef.get().get();
        if (!snapshot.exists()) {
            throw new IllegalArgumentException("Post not found.");
        }

        if (!uid.equals(snapshot.getString("uid"))) {
            throw new SecurityException("You are not authorized to delete this post.");
        }

        postRef.delete();
    }

    
    // public void updatePost(String uid, String postId, String newDesc) throws ExecutionException, InterruptedException {
    //         firestore.collection("CompanyPosts").document(uid).collection("posts")
    //                 .document(postId).update("description", newDesc).get();
    // }
    public void updatePost(String uid, String postId, String newDesc, List<String> mediaUrls) throws ExecutionException, InterruptedException {
        DocumentReference postRef = firestore.collection("CompanyPosts").document(uid).collection("posts").document(postId);
        
        Map<String, Object> updates = new HashMap<>();
        updates.put("description", newDesc);
        updates.put("mediaUrls", mediaUrls);  // ✅ Add this line

        postRef.update(updates).get();
    }

    

    public List<CompanyPostModel> getAllPosts() throws ExecutionException, InterruptedException {
        List<CompanyPostModel> allPosts = new ArrayList<>();

        // 🔥 Use collectionGroup to get all documents from all `posts` subcollections
        List<QueryDocumentSnapshot> postDocs = firestore
            .collectionGroup("posts")
            .get()
            .get()
            .getDocuments();

        for (DocumentSnapshot postDoc : postDocs) {
            if (postDoc.exists()) {
                CompanyPostModel post = postDoc.toObject(CompanyPostModel.class);
                allPosts.add(post);
            }
        }

        System.out.println("🔥 All Posts Fetched: " + allPosts.size());
        return allPosts;
    }   
}
