import { useState, useEffect } from "react"
import useSendRequest from "../../../../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function Comments() {
  const [profComments, setProfComments] = useState([])
  const [loadMyComments, setLoadMyComments] = useState(true)
  const { fetchAPIs, data, loading, catchErr } = useSendRequest()

  const loadMyCommentsFunction = () => setLoadMyComments(!loadMyComments)

  useEffect(() => {
    if (!data) return
    else if (data.message === "get profile comments") setProfComments(data.profileComments)
    else if (data.message === "comment deleted") loadMyCommentsFunction()
  }, [data])
  useEffect(() => {
    fetchAPIs("GET", `${URL}/profileComments`)
  }, [loadMyComments])
  async function deleteComment(commentId) {
    fetchAPIs("DELETE", `${URL}/deleteComment`, { commentId })
  }

  if (loading) return <div className="loading">Loading...</div>
  if (catchErr) return <p className="error">Oops, something went wrong</p>
  return (
    <div>
      {profComments[0] && (
        <ul className="comments-list">
          {profComments.map((comment, index) => (
            <li key={index} className="comment">
              {comment.text}
              <button className="delete-comment-button" onClick={() => deleteComment(comment.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Comments
