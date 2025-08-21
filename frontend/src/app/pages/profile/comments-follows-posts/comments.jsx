import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

function Comments() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profComments, setProfComments] = useState([])
  const [loadMyComments, setLoadMyComments] = useState(true)
  const navigate = useNavigate()

  const loadMyCommentsFunction = () => setLoadMyComments(!loadMyComments)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch("http://localhost:3001/profileComments", {
          credentials: "include",
        })
        if (response.status === 401) {
          navigate("/")
          return
        }
        if (!response.ok) {
          setStatusCode(response.status)
          throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
        }
        const data = await response.json()
        setProfComments(data.profileComments)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [loadMyComments])

  async function deleteComment(commentId) {
    try {
      const response = await fetch("http://localhost:3001/deleteComment", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (!response.ok) {
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      loadMyCommentsFunction()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <p className="error">Oops, something went wrong</p>
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
