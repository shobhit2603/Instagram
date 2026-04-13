import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Home from "../features/posts/pages/Home";
import Profile from "../features/users/pages/Profile";
import AppLayout from "../components/layouts/AppLayout";
import Search from "../features/users/pages/Search";
import CreatePost from "../features/posts/pages/CreatePost";
import { ProtectedRoute, GuestRoute } from "./ProtectedRoute";
import Notifications from "../features/users/pages/Notifications";
import Messages from "../features/chats/pages/Messages";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      // Protected Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "/search",
            element: <Search />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
          {
            path: "/create",
            element: <CreatePost />,
          },
          {
            path: "/notifications",
            element: <Notifications />,
          },
          {
            path: "/messages",
            element: <Messages />,
          },
        ],
      },
    ],
  },

  // Guest Routes
  {
    element: <GuestRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
]);

export default router;
