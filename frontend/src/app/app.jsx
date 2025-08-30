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

  socket.on("connect", () => {
    console.log("connected")
  })
  socket.once("mensaje", (data) => {
    console.log(data)
  })
  function connectSocket() {
    console.log(99)
    socket.once("connect", () => {
      console.log("connected")
    })
    socket.on("new post", () => {
      setRefreshBtn(true)
    })
    socket.once("mensaje", (data) => {
      console.log(data)
    })
    socket.once("disconnect", () => {
      console.log("Disconnected from server:")
    })
    return () => {
      socket.off("connect")
      socket.off("new post")
      socket.off("disconnect")
    }
  }

  async function getUsername() {
    console.log("get username")
    console.log(socket.connected)

    try {
      const response = await fetch("http://localhost:3001/getUsername", {
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
      const data = await response.json()
      console.log(socket.connected)
      ;(() => socket.emit("addUserToSocket", { user: data.user.username }))()
    } catch (error) {
      console.error(error)
      setError(true)
    }
  }
  useEffect(() => {
    // console.log(socket)
    // if (socket.connected) {
    //   getUsername()
    // }
    // connectSocket()
  }, [])

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
