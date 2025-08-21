import { useState } from "react"
import { useNavigate } from "react-router"
import "./login-signup.css"

function LogIn({ showLogin, setShowLogin, setError, setStatusCode }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const showLoginForm = () => setShowLogin(!showLogin)

  async function login(e) {
    e.preventDefault()
    if (!username || !password) return
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })
      if (response.status === 200) {
        navigate("/home")
      }
      if (response.status === 401) {
        const data = await response.json()
        setErrorMessage(data.info.message)
        return
      }
      if (response.status === 409) {
        navigate("/home")
        return
      }
      if (!response.ok) {
        setStatusCode(response.status)
        throw new Error(`${response.statusText} - Error code:${response.status}`)
      }
    } catch (error) {
      console.error(error)
      setError(true)
    }
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
        <div className="error-list-msg">{errorMessage}</div>
        <button type="submit">Log in</button>
      </form>
      <button className="guest-button">Log in as guest</button>
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
