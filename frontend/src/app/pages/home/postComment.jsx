import { useState, useEffect } from "react"
import { IoClose } from "react-icons/io5"
import useSendRequest from "../../../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function PostComment({ setShowCommentForm, postData, allPosts, setAllPosts }) {
  const [postComment, setPostComment] = useState("")
  const [postIndex, setPostIndex] = useState()
  const { fetchAPIs, data } = useSendRequest()
  const hideCommentFormFunction = () => setShowCommentForm(false)

  useEffect(() => {
    if (!data) return
    if (data.message === "comment on post") {
      const updatedPostComments = [...allPosts[postIndex].coments, data.newComment]
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === data.postId ? { ...post, coments: updatedPostComments } : post)))
    }
  }, [data])

  const handleChange = (e) => {
    const newValue = e.target.value
    const lines = newValue.split("\n")
    if (lines.length <= 3) {
      setPostComment(newValue)
    }
  }
  async function commentPost(e, postId, postComment, postIndex) {
    e.preventDefault()
    fetchAPIs("POST", `${URL}/commentPost`, { postId, postComment })
    setPostIndex(postIndex)
    setPostComment("")
    hideCommentFormFunction()
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
