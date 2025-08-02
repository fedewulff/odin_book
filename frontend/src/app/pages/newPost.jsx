import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { GiDeer } from "react-icons/gi"
import { RiArrowDownWideLine } from "react-icons/ri"
import "./pages.css"

function NewPost({ newPost, setNewPost }) {
  const hideCreatePost = () => setNewPost(!newPost)

  return (
    <div className={newPost ? "newPost-container active" : "newPost-container"}>
      <GiDeer className="newPost-deerIcon" />
      <button onClick={hideCreatePost} className="newPost-icon">
        <RiArrowDownWideLine />
      </button>

      <p>300 characters max</p>
      <form action="">
        <label htmlFor="post">Post</label>
        <textarea name="post" id="post" maxLength={300} rows={8}></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  )
}

export default NewPost
