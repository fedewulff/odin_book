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
    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      console.log(response)

      if (response.status === 200) {
        console.log("pipipi")
      }
      if (response.status === 401) {
        const data = await response.json()
        setErrorMessage(data.info.message)
        return
      }
      if (response.status === 409) {
        console.log(909090)
        navigate("/home")
        return
      }
      if (!response.ok) {
        setStatusCode(response.status)
        throw new Error(`${response.statusText} - Error code:${response.status}`)
      }
      // if (response.ok) {
      //   navigate("/home", { state: { token: data.accessToken } })
      // } else {
      //   console.error("Login error:", data.errorMessage)
      //   setErrorMessage(data.errorMessage)
      // }
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
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="passwordLogin">Password</label>
        <input
          type="password"
          name="password"
          id="passwordLogin"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="errorMsg">{errorMessage}</div>
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
