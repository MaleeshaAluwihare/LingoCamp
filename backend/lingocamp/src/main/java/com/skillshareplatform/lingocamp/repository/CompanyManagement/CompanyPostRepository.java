package com.skillshareplatform.lingocamp.repository.CompanyManagement;

import com.google.api.core.ApiFuture;
import com.google.api.core.ApiFutures;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.common.util.concurrent.MoreExecutors;
import com.skillshareplatform.lingocamp.model.CompanyManagement.CompanyPostModel;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class CompanyPostRepository {

    @Autowired
    private Firestore firestore;

    public ApiFuture<WriteResult> savePost(String uid, CompanyPostModel post) {
        return firestore
            .collection("CompanyPosts") // parent collection
            .document(uid) // doc for each company
            .collection("posts") // subcollection for posts
            .document(post.getPostId())
            .set(post);
    }
    public ApiFuture<List<CompanyPostModel>> getPostsByUid(String uid) {
    return ApiFutures.transform(
        firestore.collection("CompanyPosts").document(uid).collection("posts").get(),
        querySnapshot -> {
            List<CompanyPostModel> posts = new ArrayList<>();
            for (DocumentSnapshot doc : querySnapshot.getDocuments()) {
                posts.add(doc.toObject(CompanyPostModel.class));
            }
            return posts;
        },
        MoreExecutors.directExecutor()
    );
}
public ApiFuture<List<CompanyPostModel>> getAllPosts() {
    CollectionReference companyPostsRef = firestore.collection("CompanyPosts");

    // Step 1: Fetch all company user documents
    ApiFuture<QuerySnapshot> usersFuture = companyPostsRef.get();

    return ApiFutures.transformAsync(usersFuture, usersSnapshot -> {
        List<ApiFuture<QuerySnapshot>> allPostsFutures = new ArrayList<>();

        for (DocumentSnapshot userDoc : usersSnapshot.getDocuments()) {
            String uid = userDoc.getId();
            CollectionReference postsRef = companyPostsRef.document(uid).collection("posts");
            allPostsFutures.add(postsRef.get());
        }

        // Step 2: Combine all post collections
        ApiFuture<List<QuerySnapshot>> combinedFutures = ApiFutures.allAsList(allPostsFutures);
        return ApiFutures.transform(combinedFutures, allSnapshots -> {
            List<CompanyPostModel> allPosts = new ArrayList<>();
            for (QuerySnapshot snapshot : allSnapshots) {
                for (DocumentSnapshot doc : snapshot.getDocuments()) {
                    CompanyPostModel post = doc.toObject(CompanyPostModel.class);
                    allPosts.add(post);
                }
            }
            return allPosts;
        }, MoreExecutors.directExecutor());

    }, MoreExecutors.directExecutor());
}


}
