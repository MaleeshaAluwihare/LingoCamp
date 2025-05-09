import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const CompanyProfile = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
      if (!user) {
        navigate("/tutorlogin");
        return;
      }

      try {
        const token = await user.getIdToken();
        const uid = user.uid;

        const res = await axios.get(`http://localhost:8081/lingocamp/api/tutors/${uid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.type !== "company") {
          alert("Access denied. Only company users can view this profile.");
          navigate("/home");
          return;
        }

        setCompanyInfo(res.data);
        setAuthLoaded(true);
      } catch (err) {
        console.error("Failed to load company profile:", err);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (!authLoaded) return <div className="p-6 text-center text-gray-600">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {companyInfo?.profileImageUrl ? (
          <img
            src={companyInfo.profileImageUrl}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full text-3xl font-bold">
            {companyInfo?.companyName?.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{companyInfo?.companyName}</h1>
          <p className="text-gray-600">📧 {companyInfo?.email}</p>
          <p className="text-gray-600">📞 {companyInfo?.phoneNumber || "No phone number provided"}</p>
          <p className="text-gray-600">👤 Username: {companyInfo?.username || "Not set"}</p>
          <p className="text-gray-600">📍 {companyInfo?.address || "No address provided"}</p>
        </div>
      </div>

      {companyInfo?.about && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📝 About</h2>
          <p className="text-gray-700 leading-relaxed">{companyInfo.about}</p>
        </div>
      )}

      {companyInfo?.socialLinks?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">🔗 Social Media</h2>
          <ul className="space-y-2">
            {companyInfo.socialLinks.map((link, idx) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="font-medium">{link.platform}:</span>{" "}
                <a href={link.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                  {link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;
