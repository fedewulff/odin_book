import { useState, useEffect } from "react"
import useSendRequest from "../../../../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function MyPosts() {
  const [loadMyPosts, setLoadMyPosts] = useState(true)
  const [profPosts, setProfPosts] = useState([])
  const { fetchAPIs, data, loading, catchErr } = useSendRequest()

  const loadMyPostsFunction = () => setLoadMyPosts(!loadMyPosts)
  useEffect(() => {
    if (!data) return
    else if (data.message === "my posts") setProfPosts(data.profilePosts)
    else if (data.message === "delete post") loadMyPostsFunction()
  }, [data])
  useEffect(() => {
    fetchAPIs("GET", `${URL}/profilePosts`)
  }, [loadMyPosts])
  async function deletePost(postId) {
    fetchAPIs("DELETE", `${URL}/deletePost`, { postId })
  }

  if (loading) return <div className="loading">Loading...</div>
  if (catchErr) return <p className="error">Oops, something went wrong</p>
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
