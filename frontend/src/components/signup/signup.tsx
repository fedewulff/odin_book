import { useState, useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import useSendRequest from "../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

type SignUpProps = {
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
};

function SignUp({ showLogin, setShowLogin, setError }: SignUpProps) {
  const [username, setUsername] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPwd, setIsValidPwd] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const { fetchAPIs, data, signupErr, catchErr } = useSendRequest();

  const showLoginForm = () => setShowLogin(!showLogin);

  useEffect(() => {
    if (catchErr) setError(true);
  }, [catchErr]);
  useEffect(() => {
    if (!data) return;
    if (data.message === "signup successful") {
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      showLoginForm();
      return;
    }
  }, [data]);
  function validateUsername(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
    const usernameRegex = /^[a-z0-9_.-]{4,16}$/;
    setIsValidUsername(usernameRegex.test(e.target.value));
  }
  function validatePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+])[A-Za-z\d.!@#$%^&*()_+]{8,25}$/;
    setIsValidPwd(passwordRegex.test(e.target.value));
    if (confirmPassword === e.target.value) {
      setPasswordsMatch(true);
    } else setPasswordsMatch(false);
  }
  function validateConfPassword(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value === password) {
      setPasswordsMatch(true);
    } else setPasswordsMatch(false);
  }
  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidUsername || !isValidPwd || !passwordsMatch) return;
    fetchAPIs("POST", `${URL}/signup`, { username, password, confirmPassword });
  }

  return (
    <div className={!showLogin ? "formContainer active" : "formContainer"}>
      <form
        action="http://localhost:9000/admin/signup"
        method="post"
        onSubmit={signUp}
      >
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          placeholder="Username"
          className={
            !username || isValidUsername ? "valid-input" : "not-valid-input"
          }
          value={username.replace(/\s/g, "")}
          onChange={validateUsername}
        />
        <div className="input-requirements">
          Must be 4-16 characters long.Use only lowercase, numbers and _ . -
        </div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          maxLength={25}
          className={
            !password || isValidPwd ? "valid-input" : "not-valid-input"
          }
          value={password.replace(/\s/g, "")}
          onChange={validatePassword}
        />
        <div className="input-requirements">
          Must be 8-25 characters long, include uppercase, lowercase, number,
          and special character .!@#$%^&*()_+{" "}
        </div>
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm password"
          maxLength={25}
          className={
            !confirmPassword || passwordsMatch
              ? "valid-input"
              : "not-valid-input"
          }
          value={confirmPassword.replace(/\s/g, "")}
          onChange={validateConfPassword}
        />
        <ul className="error-list">
          {signupErr.map((error, index) => (
            <li key={index} className="error-list-msg">
              {error.msg}
            </li>
          ))}
        </ul>
        <button type="submit">Sign up</button>
        <button type="button" onClick={showLoginForm} className="hide-signup">
          <FaArrowDown />
        </button>
      </form>
    </div>
  );
}
export default SignUp;
