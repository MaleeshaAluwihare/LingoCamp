package com.skillshareplatform.lingocamp.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import java.io.FileInputStream;
import java.io.IOException;

public class FirebaseConfig {

    public void initializeFirebase() throws IOException {

        FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");

        // Initialize Firebase with the service account credentials
        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        // Initialize the default FirebaseApp instance
        if (FirebaseApp.getApps().isEmpty()) {
            FirebaseApp.initializeApp(options);
        }
    }
}
