import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, signInWithPopup } from "../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const TutorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Email/Password Login
    // const handleEmailLogin = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const userCredential = await signInWithEmailAndPassword(auth, email, password);
    //         const user = userCredential.user;
    //         console.log(user)
    //         navigate("/home");
    //     } catch (err) {
    //         console.log(err.code);
    //         console.log(err.message);
    //         setError("Invalid email or password");
    //     }
    // };
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
      
          const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`);
          const userType = response.data.type;
      
          if (userType === "company") {
            navigate("/jobdashboard");
          } else {
            navigate("/home");
          }
        } catch (err) {
          console.log(err.code);
          console.log(err.message);
          setError("Invalid email or password");
        }
      };
      
    // Google Login
    // const handleGoogleLogin = async () => {
    //     try {
    //         const result = await signInWithPopup(auth, googleProvider);
    //         const user = result.user;
            
    //         try {
    //             // Check if profile exists and is complete
    //             await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`);
    //             navigate('/home');
    //         } catch (error) {
    //             if(error.response?.status === 404) { // Profile incomplete
    //                 navigate('/tutorcompleteprofile');
    //             } else {
    //                 throw error;
    //             }
    //         }
    //     } catch (err) {
    //         setError("Google sign-in failed");
    //     }
    // };
    const handleGoogleLogin = async () => {
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
      
          try {
            // 🔍 Check if the user exists in Firestore
            const response = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${user.uid}`);
            const userType = response.data?.type;
      
            // 🧭 Route based on user type
            if (userType === "company") {
              navigate("/jobdashboard");
            } else {
              navigate("/home");
            }
          } catch (error) {
            if (error.response?.status === 404) {
              // 👤 User not found in DB → Send to complete profile page
              navigate("/tutorcompleteprofile");
            } else {
              throw error;
            }
          }
        } catch (err) {
          console.error(err);
          setError("Google sign-in failed");
        }
      };
      

    const handleGuest = async () => {
        localStorage.setItem('isGuest', 'true');
        navigate('/home');
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        required
                    />
                    <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg">
                        Login
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button onClick={handleGoogleLogin} className="w-full bg-red-500 text-white p-3 rounded-lg">
                        Sign in with Google
                    </button>
                </div>
                <div className="mt-4 text-center">
                    <button onClick={handleGuest} className="w-full bg-green-500 text-white p-3 rounded-lg">
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TutorLogin;
