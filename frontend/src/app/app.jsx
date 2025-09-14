import { useState, useEffect } from "react"
import { useParams } from "react-router"
import socket from "../../socket/socket"
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
  const [refreshBtn, setRefreshBtn] = useState(false)

  useEffect(() => {
    socket.once("connect", () => {
      console.log("connected to socket")
      socket.once("disconnect", () => {
        console.log("Disconnected from socket")
      })
    })
    socket.on("new post", () => setRefreshBtn(true))
    socket.on("server error", () => {
      setStatusCode(500)
      setError(true)
    })
    return () => {
      socket.off("connect")
      socket.off("new post")
      socket.off("disconnect")
      socket.off("server error")
    }
  }, [])

  // async function getUsername() {
  //   try {
  //     const response = await fetch("http://localhost:3001/getUsername", {
  //       credentials: "include",
  //     })
  //     if (response.status === 409) {
  //       navigate("/home")
  //       return
  //     }
  //     if (!response.ok) {
  //       setStatusCode(response.status)
  //       throw new Error(`${response.statusText} - Error code:${response.status}`)
  //     }
  //     const data = await response.json()
  //     ;(() => socket.emit("addUserToSocket", { user: data.user.username }))()
  //   } catch (error) {
  //     console.error(error)
  //     setError(true)
  //   }
  // }

  if (error) return <ErrorInRequest statusCode={statusCode || "unknown"} />
  return (
    <div className="app">
      <div className="page-container">
        {page === "home" ? (
          <Home setError={setError} setStatusCode={setStatusCode} refreshBtn={refreshBtn} setRefreshBtn={setRefreshBtn} />
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
