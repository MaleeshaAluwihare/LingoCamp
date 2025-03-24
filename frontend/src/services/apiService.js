import getToken from "../authHelper";

const API_BASE_URL = "http://localhost:8081/lingocamp/api";

export const fetchProtectedData = async () => {
    try {
        const token = await getToken();
        if (!token) throw new Error("User not authenticated");

        const response = await fetch(`${API_BASE_URL}/protected`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Failed to fetch data");
        return await response.json();

    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
};
