import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/en-gb";

import api from "./utils/api";
import { ACCESS_TOKEN } from "./utils/constants";
import ScrollToTop from "./utils/scrollToTop";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Vaults from "./pages/Vaults";
import CreditCards from "./pages/CreditCards";
import Investments from "./pages/Investments";

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

  useEffect(() => {}, [user]);

  function Layout() {
    return (
      <div className="container">
        <ScrollToTop />
        <Navbar user={user} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
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
        {
          path: "/transactions",
          element: <Transactions />,
        },
        {
          path: "/budgets",
          element: <Budgets />,
        },
        {
          path: "/reports",
          element: <Reports />,
        },
        {
          path: "/vaults",
          element: <Vaults />,
        },
        {
          path: "/credit-cards",
          element: <CreditCards />,
        },
        {
          path: "/investments",
          element: <Investments />,
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

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
      <RouterProvider router={router} />
    </LocalizationProvider>
  );
}

export default App;
