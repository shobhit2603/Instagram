import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../auth.slice";
import { getMe } from "../service/auth.api";

const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleMessage = async (event) => {
      // Validate origin if strictly needed: if (event.origin !== "http://localhost:3000") return;

      if (event.data === "google-auth-success") {
        try {
          const data = await getMe();
          dispatch(setUser(data.user));
          navigate("/");
        } catch (error) {
          console.error("Failed to fetch user profile post-Google Auth:", error);
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [dispatch, navigate]);

  const handleGoogleAuth = () => {
    const width = 500;
    const height = 600;
    // Calculate center positioned coordinates for the popup
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    // Open the Google Auth popup route
    window.open(
      "http://localhost:3000/api/auth/google", 
      "Google Auth",
      `width=${width},height=${height},left=${left},top=${top},display=popup`
    );
  };

  return { handleGoogleAuth };
};

export default useGoogleAuth;
