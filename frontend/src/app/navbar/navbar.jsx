import { useState } from "react"
import { NavLink } from "react-router"
import { CgAddR } from "react-icons/cg"
import { BsFillPersonFill, BsPeopleFill } from "react-icons/bs"
import { FaHome } from "react-icons/fa"
import NewPost from "../pages/newPost/newPost"
import "./navbar.css"

function Navbar() {
  const [newPost, setNewPost] = useState(false)

  const showCreatePost = () => setNewPost(!newPost)

  return (
    <>
      <NewPost newPost={newPost} setNewPost={setNewPost} />
      <nav className="navbar">
        <NavLink to={"/profile"}>
          <div class="icon-container">
            <BsFillPersonFill className="icon" />
          </div>
        </NavLink>
        <button onClick={showCreatePost}>
          <div class="icon-container">
            <CgAddR className="icon" />
          </div>
        </button>
        <NavLink to={"/home"}>
          <div class="icon-container">
            <FaHome className="icon" />
          </div>
        </NavLink>
        <NavLink to={"/users"} className={"navlink"}>
          <div class="icon-container">
            <BsPeopleFill className="icon" />
          </div>
        </NavLink>
      </nav>
    </>
  )
}
export default Navbar
