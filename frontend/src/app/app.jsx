import { useState } from "react"
import { useParams } from "react-router"
import Navbar from "./navbar/navbar"
import Home from "./pages/home/home"
import Profile from "./pages/profile/profile"
import Users from "./pages/users/users"
import ErrorURL from "../error/errorURL"
import ErrorInRequest from "../error/errorInRequest"
import "./app.css"

function App() {
  const { page } = useParams()
  const [error, setError] = useState(false)
  const [statusCode, setStatusCode] = useState()

  if (error) return <ErrorInRequest statusCode={statusCode || "unknown"} />
  return (
    <div className="app">
      <div className="page-container">
        {page === "home" ? (
          <Home setError={setError} setStatusCode={setStatusCode} />
        ) : page === "profile" ? (
          <Profile setError={setError} setStatusCode={setStatusCode} />
        ) : page === "users" ? (
          <Users setError={setError} setStatusCode={setStatusCode} />
        ) : (
          <ErrorURL />
        )}
      </div>
      <Navbar />
    </div>
  )
}
export default App
