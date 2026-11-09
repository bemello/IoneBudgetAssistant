import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  redirect,
} from "react-router-dom";
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
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Reports from "./pages/Reports";
import Vaults from "./pages/Vaults";
import CreditCards from "./pages/CreditCards";
import Investments from "./pages/Investments";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

function Logout({ setUser, removeCookies }) {
  removeCookies(ACCESS_TOKEN);
  setUser(null);
  redirect("/");
}

function RegisterAndLogout({ removeCookies }) {
  removeCookies(ACCESS_TOKEN);
  return "";
}

function App() {
  const [cookies, setCookies, removeCookies] = useCookies([ACCESS_TOKEN]);
  const [user, setUser] = useState({});

  useEffect(() => {}, [user]);

  function LandingPageLayout() {
    return <Outlet />;
  }

  function BaseLayout() {
    return (
      <div className="wrapper">
        <div className="container">
          <ScrollToTop />
          {cookies.access && <Navbar user={user} />}
          {/* <Navbar user={user} /> */}
          <main className="main-content">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPageLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "login",
          element: <Login setUser={setUser} />,
        },
      ],
    },
    {
      path: "/",
      element: <BaseLayout />,
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/transactions",
          element: (
            <ProtectedRoute>
              <Transactions user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/accounts",
          element: (
            <ProtectedRoute>
              <Accounts user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/budgets",
          element: (
            <ProtectedRoute>
              <Budgets user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/reports",
          element: (
            <ProtectedRoute>
              <Reports user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/vaults",
          element: (
            <ProtectedRoute>
              <Vaults user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/credit-cards",
          element: (
            <ProtectedRoute>
              <CreditCards user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/investments",
          element: (
            <ProtectedRoute>
              <Investments user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute>
              <Settings user={user} />
            </ProtectedRoute>
          ),
        },
        {
          path: "/logout",
          element: <Logout setUser={setUser} removeCookies={removeCookies} />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
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
