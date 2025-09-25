import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import socket from "../../../socket/socket"
import "./login-signup.css"
import useSendRequest from "../../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function LogIn({ showLogin, setShowLogin, setError }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { fetchAPIs, loginErr, catchErr } = useSendRequest()

  const showLoginForm = () => setShowLogin(!showLogin)

  useEffect(() => {
    if (catchErr) setError(true)
  }, [catchErr])

  async function login(e, username, password) {
    e.preventDefault()
    if (!username || !password) return
    fetchAPIs("POST", `${URL}/login`, { username, password })
  }

  return (
    <div className={showLogin ? "formContainer active" : "formContainer "}>
      <form action="" method="post" className="vertical" onSubmit={(e) => login(e, username, password)}>
        <label htmlFor="usernameLogin">Username</label>
        <input
          type="text"
          name="username"
          id="usernameLogin"
          autoComplete="off"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="passwordLogin">Password</label>
        <input
          type="password"
          name="password"
          id="passwordLogin"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="error-list-msg">{loginErr}</div>
        <button type="submit">Log in</button>
      </form>
      <button className="guest-button" onClick={(e) => login(e, "guest", "Guest.1234")}>
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
  )
}
export default LogIn
