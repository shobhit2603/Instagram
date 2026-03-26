import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Home from "../features/posts/pages/Home";
import Profile from "../features/posts/pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

export default router;