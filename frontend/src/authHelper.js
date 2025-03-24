import { getAuth } from "firebase/auth";

// Function to get Firebase ID Token
const getToken = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
};

export default getToken;
