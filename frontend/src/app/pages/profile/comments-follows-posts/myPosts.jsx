import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
const URL = import.meta.env.VITE_BACKEND_URL

function MyPosts() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadMyPosts, setLoadMyPosts] = useState(true)
  const [profPosts, setProfPosts] = useState([])
  const navigate = useNavigate()

  const loadMyPostsFunction = () => setLoadMyPosts(!loadMyPosts)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch(`${URL}/profilePosts`, {
          credentials: "include",
        })
        if (response.status === 401) {
          navigate("/")
          return
        }
        if (!response.ok) {
          throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
        }
        const data = await response.json()
        setProfPosts(data.profilePosts)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [loadMyPosts])

  async function deletePost(postId) {
    try {
      const response = await fetch(`${URL}/deletePost`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (!response.ok) {
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      loadMyPostsFunction()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <p className="error">Oops, something went wrong</p>
  return (
    <div>
      {profPosts[0] && (
        <ul className="posts-list">
          {profPosts.map((post, index) => (
            <li key={index} className="post">
              {post.text}
              <button className="delete-post-button" onClick={() => deletePost(post.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyPosts
