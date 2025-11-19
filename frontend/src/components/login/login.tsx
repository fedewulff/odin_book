import { useState, useEffect } from "react";
import "./login-signup.css";
import useSendRequest from "../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

type LogInProps = {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
};

function LogIn({ showLogin, setShowLogin, setError }: LogInProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { fetchAPIs, loginErr, catchErr, clearLoginErr } = useSendRequest();

  const showLoginForm = () => setShowLogin(!showLogin);

  useEffect(() => {
    if (catchErr) setError(true);
  }, [catchErr]);

  function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!username || !password) return;
    fetchAPIs("POST", `${URL}/login`, { username, password });
  }
  function loginAsGuest(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    fetchAPIs("POST", `${URL}/login`, {
      username: "guest",
      password: "Guest.1234",
    });
  }

  return (
    <div className={showLogin ? "formContainer active" : "formContainer "}>
      <form action="" method="post" className="vertical" onSubmit={login}>
        <label htmlFor="usernameLogin">Username</label>
        <input
          type="text"
          name="username"
          id="usernameLogin"
          autoComplete="off"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (loginErr) clearLoginErr();
          }}
        />
        <label htmlFor="passwordLogin">Password</label>
        <input
          type="password"
          name="password"
          id="passwordLogin"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (loginErr) clearLoginErr();
          }}
        />
        <div className="error-list-msg">{loginErr}</div>
        <button type="submit">Log in</button>
      </form>
      <button className="guest-button" onClick={loginAsGuest}>
        Log in as guest
      </button>
      <div className="division-line-container">
        <div className="division-line"></div>
        <div>or</div>
        <div className="division-line"></div>
      </div>
      <button className="signup-button" onClick={showLoginForm}>
        Sign up
      </button>
    </div>
  );
}
export default LogIn;
