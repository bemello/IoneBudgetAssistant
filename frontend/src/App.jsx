import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";

import api from "./utils/api";
import { ACCESS_TOKEN } from "./utils/constants";
import ScrollToTop from "./utils/scrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";

function Logout({ setUser }) {
  cookies.remove(ACCESS_TOKEN);
  setUser(null);
  return <Home />;
}

function RegisterAndLogout() {
  cookies.remove(ACCESS_TOKEN);
  return "";
}

function App() {
  const [cookies, setCookie, removeCookie] = useCookies([ACCESS_TOKEN]);
  const [user, setUser] = useState(() => {
    return cookies.access_token ? JSON.parse(cookies.access_token) : null;
  });

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  function Layout() {
    return (
      <>
        <ScrollToTop />
        <Navbar user={user} />
        <main className="main-content">
          <Outlet />
        </main>
      </>
    );
  }

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: "/",
          element: user ? <Dashboard /> : <Home />,
        },
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
        // {
        //   path: "/dashboard",
        //   element: (
        //     <ProtectedRoute>
        //       <Dashboard user={user} setUser={setUser} />
        //     </ProtectedRoute>
        //   ),
        // },
        // {
        //   path: "/login",
        //   element: <Login setUser={setUser} />,
        // },
        // {
        //   path: "/logout",
        //   element: <Logout setUser={setUser} />,
        // },
        // {
        //   path: "/register",
        //   element: <RegisterAndLogout />,
        // },
        // {
        //   path: "*",
        //   element: <NotFound />,
        // },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
