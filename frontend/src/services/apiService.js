
import getToken from "../authHelper";

const API_BASE_URL = "http://localhost:8081/lingocamp/api";

// 🔒 Authenticated GET
export const getAuth = async (endpoint) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("GET error:", error);
    return null;
  }
};

// 🔒 Authenticated POST
export const postAuth = async (endpoint, data) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("User not authenticated");

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Failed to POST data");
    return await response.json();
  } catch (error) {
    console.error("POST error:", error);
    return null;
  }


};
export const fetchAllCompanyPosts = async () => {
  try {
    const response = await fetch("http://localhost:8081/lingocamp/api/company/posts/all");
    if (!response.ok) throw new Error("Failed to fetch posts");
    return await response.json(); // ✅ This should return an array of posts
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
};


