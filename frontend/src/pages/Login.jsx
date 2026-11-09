import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";
import api from "../utils/api";
import { ACCESS_TOKEN } from "../utils/constants";
import { GoogleLogo } from "../assets/Logos";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([ACCESS_TOKEN]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  }, [errorMessage]);

  function getUserProfile(setUser) {
    api
      .get("/api/user/me")
      .then(function (response) {
        const user = {
          name: response.data.name,
          email: response.data.email,
          profile_picture: response.data.profile_picture,
          starting_date: response.data.starting_date,
          currency: response.data.currency,
          access_history: response.data.access_history,
        };
        setUser(user);
      })
      .catch((err) => console.log(err));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api
      .post(
        "/api/user/token/",
        { email, password },
        { headers: { "content-type": "application/json" } },
      )
      .then((response) => response.data)
      .then((data) => {
        setCookie(ACCESS_TOKEN, data.token, { path: "/" });
        getUserProfile(setUser);
        navigate("/dashboard");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          setErrorMessage(err.response.data.non_field_errors[0]);
          console.log(err.response.data.non_field_errors[0]);
        }
      });
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log(tokenResponse);
        const res = await api.post(
          "/api/user/google/",
          {
            access_token: JSON.stringify(tokenResponse.access_token),
          },
          { headers: { "content-type": "application/json" } },
        );
        setCookie(ACCESS_TOKEN, res.data.key, { path: "/" });
        getUserProfile(setUser);
        navigate("/dashboard");
      } catch (error) {
        console.log(error.response.data);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <section className="login-page-container">
      <div className="login-header">
        <h1>Welcome back</h1>
        <span>Sign in to your account</span>
      </div>
      <div className="login-container card frosted-glass">
        <div className="error-message">
          {errorMessage && <span>{errorMessage}</span>}
        </div>
        <form
          onSubmit={handleSubmit}
          id="login-form"
          method="post"
          className="form-container"
        >
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </form>
        <div className="buttons">
          <button type="submit" form="login-form" className="btn">
            Login
          </button>
          <span>or</span>
          <button
            type="button"
            onClick={() => googleLogin()}
            className="btn link"
          >
            <GoogleLogo />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Login;
