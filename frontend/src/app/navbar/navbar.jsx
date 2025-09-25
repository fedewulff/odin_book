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
          <BsFillPersonFill className="icon" />
        </NavLink>
        <button onClick={showCreatePost}>
          <CgAddR className="icon" />
        </button>
        <NavLink to={"/home"}>
          <FaHome className="icon" />
        </NavLink>
        <NavLink to={"/users"} className={"navlink"}>
          <BsPeopleFill className="icon" />
        </NavLink>
      </nav>
    </>
  )
}
export default Navbar
