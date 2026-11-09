import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../utils/constants";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [cookies] = useCookies([ACCESS_TOKEN]);

  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const auth = async () => {
    const token = cookies.access;
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    setIsAuthorized(true);
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
