package com.skillshareplatform.lingocamp.service.CompanyManagement;

import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.cloud.Timestamp;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.skillshareplatform.lingocamp.model.CompanyManagement.CompanyModel;
import com.skillshareplatform.lingocamp.repository.CompanyManagement.CompanyRepository;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private Firestore firestore;

    // Validate email format using regex
    private boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        Matcher matcher = pattern.matcher(email);
        return matcher.matches();
    }

     // Register a new learner
    public String registerCompany(CompanyModel company) throws ExecutionException, InterruptedException {
        if (!isValidEmail(company.getEmail())) {
            throw new IllegalArgumentException("Invalid Email Format");
        }
    
        // Check for duplicate email
        QuerySnapshot existingCompany = firestore.collection("Companies")
            .whereEqualTo("email", company.getEmail()).get().get();
        if (!existingCompany.isEmpty()) {
            throw new IllegalArgumentException("Email is already in use");
        }
    
        company.setCreateAt(Timestamp.now());
        company.setProfileComplete(false); // Initially, profile is not complete
    
        companyRepository.saveCompany(company).get();
        return company.getUid(); // Return UID
    }
}
