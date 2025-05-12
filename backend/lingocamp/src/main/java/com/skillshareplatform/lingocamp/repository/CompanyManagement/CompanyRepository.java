package com.skillshareplatform.lingocamp.repository.CompanyManagement;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.skillshareplatform.lingocamp.model.CompanyManagement.CompanyModel;

@Repository
public class CompanyRepository {
    @Autowired
    private Firestore firestore;

    public ApiFuture<WriteResult> saveCompany(CompanyModel company){
        return firestore.collection("Companies").document(company.getUid()).set(company);
    }
}
