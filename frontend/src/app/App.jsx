import "./App.css";
import { RouterProvider } from "react-router-dom";
import router from "./app.route.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.js";
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    handleGetMe();
    // Run once on app bootstrap to restore the session from the auth cookie.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
