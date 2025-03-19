# LingoCamp - An Interactive Camp for Language Learners

## 📌 Overview

LingoCamp is a skill-sharing and learning platform where users can share and learn various skills, with a primary focus on **language learning**. It allows users to **share knowledge, create structured learning plans, engage in discussions, and even register as tutors to sell courses**.

## ✨ Features

### **General Features:**

- Users can **share skill-based posts** with images and short videos.
- Users can **track and update their learning progress**.
- Users can **create structured learning plans** with resources and completion timelines.
- Interactive community with **likes, comments, and follow features**.
- **Notifications** for likes, comments, and course-related updates.
- **OAuth 2.0 Authentication** for secure login using social media accounts.

### **Course & Tutor Features:**

- Tutors can **create and sell** courses.
- Learners can **purchase courses** and access materials.
- Courses include **videos, PDFs, quizzes, and assignments**.
- **Course progress tracking** and completion certificates.
- Tutors can track **earnings and revenue management**.

### **Chatbot Feature:**

- AI-powered chatbot for **language learning assistance**.
- Users can **ask questions** and get instant responses.
- Adaptive **learning recommendations** based on user activity.

## 🏗️ Tech Stack

### **Frontend:**

- React.js
- Tailwind CSS / Bootstrap

### **Backend:**

- Spring Boot (Java)
- Firebase & Firestore (Database)
- OAuth 2.0 Authentication

### **Additional Integrations:**

- Firebase Storage (for image/video uploads)
- Firebase Cloud Messaging (for notifications)
- AI Chatbot (for language learning assistance)

## 🛠️ Installation & Setup

### **Prerequisites:**

- Node.js & npm (for React frontend)
- Java & Spring Boot (for backend)
- Firebase Account (for authentication & storage)

### **1. Clone the Repository**

```sh
  git clone https://github.com/maleeshaaluwihare/LingoCamp.git
  cd LingoCamp
```

### **2. Setup Backend (Spring Boot)**

```sh
  cd backend
  mvn clean install
  mvn spring-boot:run
```

### **3. Setup Frontend (React)**

```sh
  cd frontend
  npm install
  npm start
```

### **4. Configure Firebase**

- Create a Firebase project.
- Enable Firestore, Authentication, and Storage.
- Add Firebase config details to `src/config/firebaseConfig.js`.


## 📜 License

This project is licensed under the **MIT License**.

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.


