package com.skillshareplatform.lingocamp.controller.CompanyManagement;

import java.util.concurrent.ExecutionException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.skillshareplatform.lingocamp.model.CompanyManagement.CompanyModel;
import com.skillshareplatform.lingocamp.service.CompanyManagement.CompanyService;

@RestController
@RequestMapping("/lingocamp/api/company")
public class CompanyController {
    
    @Autowired
    private CompanyService companyService;

    @Autowired
    private Firestore firestore;

    @PostMapping("/register")
    public ResponseEntity<String> registerCompany(@RequestBody CompanyModel company) {
        try {
            String companyId = companyService.registerCompany(company);
            return ResponseEntity.ok(companyId);  
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred while registering the learner");
        }
    }

    // Get company by UID
    @GetMapping("/{uid}")
    public ResponseEntity<CompanyModel> getCompanyByUid(@PathVariable String uid) {
        try {
            DocumentSnapshot doc = firestore.collection("Companies").document(uid).get().get();
            if (doc.exists()) {
                CompanyModel company = doc.toObject(CompanyModel.class);
                return ResponseEntity.ok(company);
            }
            return ResponseEntity.notFound().build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
