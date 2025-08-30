import { useState } from "react"
import socket from "../../../../socket/socket"
import { GiDeer } from "react-icons/gi"
import { RiArrowDownWideLine } from "react-icons/ri"
import "./newPost.css"

function NewPost({ newPost, setNewPost }) {
  const [postText, setPostText] = useState("")

  const hideCreatePost = () => setNewPost(!newPost)
  const handleChange = (e) => {
    const newValue = e.target.value
    const lines = newValue.split("\n")
    if (lines.length <= 8) {
      setPostText(newValue)
    }
  }
  const sendMessage = (e) => {
    e.preventDefault()
    if (postText) {
      socket.emit("new post", { postText }) // Emit a 'chat message' event to the server
      setPostText("")
      hideCreatePost()
    }
  }

  async function createPost(e) {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3001/createPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ postText }),
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (!response.ok) {
        throw new Error(`${response.statusText} - Error code:${response.status}`)
      }
      setPostText("")
      hideCreatePost()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className={newPost ? "newPost-container active" : "newPost-container"}>
      <GiDeer className="newPost-deerIcon" />
      <button onClick={hideCreatePost} className="newPost-icon">
        <RiArrowDownWideLine />
      </button>
      <p>300 characters max</p>
      <form action="" onSubmit={sendMessage}>
        <label htmlFor="post">Post</label>
        <textarea name="post" id="post" maxLength={300} rows={8} spellCheck="false" value={postText} onChange={handleChange}></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  )
}

export default NewPost
