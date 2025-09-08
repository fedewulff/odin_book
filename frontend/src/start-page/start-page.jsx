import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import socket from "../../socket/socket"
import { GiDeer } from "react-icons/gi"
import LogIn from "./login-signup/login"
import SignUp from "./login-signup/signup"
import ErrorInRequest from "../error/errorInRequest"
import "./start-page.css"

function StartPage() {
  const [showStartPage, setShowStartPage] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(true)
  const [statusCode, setStatusCode] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch("http://localhost:3001/isNotAuthenticated", {
          credentials: "include",
        })
        if (response.status === 409) {
          navigate("/home")
          return
        }
        if (!response.ok) {
          setStatusCode(response.status)
          throw new Error(`${response.statusText} - Error code:${response.status}`)
        }
        setShowStartPage(true)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <ErrorInRequest statusCode={statusCode} />
  if (showStartPage)
    return (
      <div className="startPage-container">
        <GiDeer className="deer-icon" />
        <h1>Welcome to deer </h1>
        <LogIn showLogin={showLogin} setShowLogin={setShowLogin} setError={setError} setStatusCode={setStatusCode} />
        <SignUp showLogin={showLogin} setShowLogin={setShowLogin} setError={setError} setStatusCode={setStatusCode} />
      </div>
    )
}

export default StartPage
