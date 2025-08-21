import { useState } from "react"
import { IoClose } from "react-icons/io5"

function PostComment({ setShowCommentForm, postData, allPosts, setAllPosts }) {
  const hideCommentFormFunction = () => setShowCommentForm(false)
  const [postComment, setPostComment] = useState("")

  const handleChange = (e) => {
    const newValue = e.target.value
    const lines = newValue.split("\n")
    if (lines.length <= 3) {
      setPostComment(newValue)
    }
  }
  async function commentPost(e, postId, postComment, postIndex) {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3001/commentPost", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, postComment }),
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      setPostComment("")
      const data = await response.json()
      const updatedPostComments = [...allPosts[postIndex].coments, data.newComment]
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, coments: updatedPostComments } : post)))
      hideCommentFormFunction()
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <>
      <button type="button" onClick={hideCommentFormFunction} className="close-form-button">
        <IoClose />
      </button>
      <form action="" onSubmit={(e) => commentPost(e, postData.postId, postComment, postData.index)} className={"comment-form"}>
        <label htmlFor="postComment">Comment on post</label>
        <textarea
          name="postComment"
          id="postComment"
          maxLength={150}
          rows={4}
          spellCheck="false"
          placeholder={`Comment on ${postData.postAuthor}'s post`}
          value={postComment}
          onChange={handleChange}
        ></textarea>
        <button type="submit">Comment</button>
      </form>
    </>
  )
}

export default PostComment
