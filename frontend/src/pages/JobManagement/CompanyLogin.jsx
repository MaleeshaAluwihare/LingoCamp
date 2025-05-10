import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, signInWithPopup } from "../../firebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import { FiArrowRight } from 'react-icons/fi';

const TutorLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.removeItem('isGuest');
            navigate("/JobDashboard");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            try {
                await axios.get(`http://localhost:8081/lingocamp/api/company/${result.user.uid}`);
                localStorage.removeItem('isGuest'); 
                navigate('/JobDashboard');
            } catch (error) {
                if(error.response?.status === 404) {
                    navigate('/CompanyProfile');
                }
            }
        } catch (err) {
            setError("Google sign-in failed");
        }
    };

    const handleGuest = async () => {
        localStorage.setItem('isGuest', 'true');
        navigate('/JobDashboard');
      };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to continue to LingoCamp</p>
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        Sign In
                        <FiArrowRight className="w-5 h-5" />
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FcGoogle className="w-6 h-6" />
                        <span>Google</span>
                    </button>

                    <button
                        onClick={handleGuest}
                        className="w-full p-3 border rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                    >
                        Continue as Guest
                    </button>
                </div>

                <p className="text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link
                        to="/tutorregistration"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Sign up here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default TutorLogin;