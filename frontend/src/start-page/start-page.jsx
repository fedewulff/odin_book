import { useState } from "react"
import { GiDeer } from "react-icons/gi"
import LogIn from "./login-signup/login"
import SignUp from "./login-signup/signup"
import ErrorInRequest from "../error/errorInRequest"
import "./start-page.css"

function StartPage() {
  const [showLogin, setShowLogin] = useState(true)
  const [error, setError] = useState(false)
  const [statusCode, setStatusCode] = useState()

  if (error) return <ErrorInRequest statusCode={statusCode} />
  return (
    <div className="startPage-container">
      <div className="title-logo">
        <GiDeer className="deer-icon" />
        <h1>Welcome to deer </h1>
      </div>
      <LogIn showLogin={showLogin} setShowLogin={setShowLogin} setError={setError} setStatusCode={setStatusCode} />
      <SignUp showLogin={showLogin} setShowLogin={setShowLogin} setError={setError} setStatusCode={setStatusCode} />
    </div>
  )
}

export default StartPage
