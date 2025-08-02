import { useParams } from "react-router"
import Navbar from "./navbar/navbar"
import Home from "./pages/home"
import Profile from "./pages/profile"
import Users from "./pages/users"
import ErrorURL from "../error/errorURL"
import "./app.css"

function App() {
  const { page } = useParams()

  return (
    <div className="app">
      <div className="page-container">
        {page === "home" ? <Home /> : page === "profile" ? <Profile /> : page === "users" ? <Users /> : <ErrorURL />}
      </div>
      <Navbar />
    </div>
  )
}
export default App
