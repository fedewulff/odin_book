import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import socket from "../../socket/socket"
import { GiDeer } from "react-icons/gi"
import LogIn from "./login-signup/login"
import SignUp from "./login-signup/signup"
import ErrorInRequest from "../error/errorInRequest"
import "./start-page.css"
import useSendRequest from "../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function StartPage() {
  const [error, setError] = useState(false)
  const [showLogin, setShowLogin] = useState(true)
  const { fetchAPIs, loading, catchErr } = useSendRequest()

  useEffect(() => {
    fetchAPIs("GET", `${URL}/isNotAuthenticated`)
  }, [])

  if (loading)
    return (
      <div className=" minute">
        <p className="loading">Loading...</p>
        <p className="loading-message">this might take a minute</p>
      </div>
    )
  if (catchErr || error) return <ErrorInRequest />

  return (
    <div className="startPage-container">
      <GiDeer className="deer-icon" />
      <h1>Welcome to deer </h1>
      <LogIn showLogin={showLogin} setShowLogin={setShowLogin} setError={setError} />
      <SignUp showLogin={showLogin} setShowLogin={setShowLogin} setError={setError} />
    </div>
  )
}

export default StartPage
