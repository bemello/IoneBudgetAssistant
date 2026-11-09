import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CookiesProvider } from "react-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./css/base.css";

const CLIENT_ID =
  "475227107720-gpdjkdidnlr9bt011713056k1nufjafl.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
