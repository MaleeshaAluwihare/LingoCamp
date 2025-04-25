# LingoCamp Post API (Spring Boot + Firebase)

### 🔧 Setup Instructions

1. Place your Firebase `serviceAccountKey.json` in the root folder.
2. Make sure the Firebase Realtime Database is set up in your Firebase console.
3. Run the application using your IDE or `mvn spring-boot:run`
4. Test endpoint:
   - POST: http://localhost:8080/api/posts/create

### ✅ Post JSON Example
```json
{
  "userId": "learner123",
  "description": "My first post on LingoCamp!",
  "mediaUrls": ["https://example.com/image.jpg"],
  "timestamp": 1714089394000
}
```
