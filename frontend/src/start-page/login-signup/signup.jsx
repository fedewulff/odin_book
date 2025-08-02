import { useState } from "react"
import { FaArrowDown } from "react-icons/fa"

function SignUp({ showLogin, setShowLogin, setError, setStatusCode }) {
  const [username, setUsername] = useState("")
  const [isValidUsername, setIsValidUsername] = useState(false)
  const [password, setPassword] = useState("")
  const [isValidPwd, setIsValidPwd] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isValidConfPwd, setIsValidConfPwd] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(false)
  const [signUpError, setSignUpError] = useState([])

  const showLoginForm = () => setShowLogin(!showLogin)

  function validateUsername(e) {
    const username = e.target.value
    setUsername(username)
    const usernameRegex = /^.{4,20}$/
    setIsValidUsername(usernameRegex.test(username))
  }
  function validatePassword(e) {
    const newPassword = e.target.value
    setPassword(newPassword)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+])[A-Za-z\d.!@#$%^&*()_+]{8,25}$/
    setIsValidPwd(passwordRegex.test(newPassword))
    if (confirmPassword === newPassword) {
      setPasswordsMatch(true)
    } else setPasswordsMatch(false)
  }
  function validateConfPassword(e) {
    const newConfPassword = e.target.value
    setConfirmPassword(newConfPassword)
    const confirmPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[.!@#$%^&*()_+])[A-Za-z\d.!@#$%^&*()_+]{8,25}$/
    setIsValidConfPwd(confirmPasswordRegex.test(newConfPassword))
    if (newConfPassword === password) {
      setPasswordsMatch(true)
    } else setPasswordsMatch(false)
  }

  async function signUp(e) {
    e.preventDefault()
    errorSigningUp()
    if (!isValidUsername || !isValidPwd || !isValidConfPwd || !passwordsMatch) return
    try {
      const response = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, confirmPassword }),
      })

      if (response.status === 200) {
        setUsername("")
        setPassword("")
        setConfirmPassword("")
        setSignUpError([])
        showLoginForm()
        return
      }
      if (response.status === 400) {
        const data = await response.json()
        setSignUpError(data.errors)
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
    <div className={!showLogin ? "formContainer active" : "formContainer"}>
      <form action="http://localhost:9000/admin/signup" method="post" onSubmit={signUp}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          placeholder="Username"
          className={!username || isValidUsername ? "valid-input" : "not-valid-input"}
          value={username.replace(/\s/g, "")}
          onChange={validateUsername}
        />
        <div className="input-requirements">Must be 4-20 characters long</div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className={!password || isValidPwd ? "valid-input" : "not-valid-input"}
          value={password.replace(/\s/g, "")}
          onChange={validatePassword}
        />
        <div className="input-requirements">
          Must be 8-25 characters long, include uppercase, lowercase, number, and special character: .!@#$%^&*()_+{" "}
        </div>
        <label htmlFor="confirmPassword">Confirm password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm password"
          className={!confirmPassword || (isValidConfPwd && passwordsMatch) ? "valid-input" : "not-valid-input"}
          value={confirmPassword.replace(/\s/g, "")}
          onChange={validateConfPassword}
        />
        <ul className="error-list">
          {signUpError.map((error, index) => (
            <li key={index} className="errorMsg">
              {error.msg}
            </li>
          ))}
        </ul>
        <button type="submit">Sign up</button>
      </form>
      <FaArrowDown onClick={showLoginForm} className="hide-signup" />
    </div>
  )
}
export default SignUp
