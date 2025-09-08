import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import PostComment from "./postComment"
import "./home.css"
import { GiDeer } from "react-icons/gi"
import { BsFillPersonFill } from "react-icons/bs"
import { IoMdHeart } from "react-icons/io"
import { RiArrowDownWideLine } from "react-icons/ri"

function Home({ setError, setStatusCode, refreshBtn, setRefreshBtn }) {
  const [message, setMessage] = useState("")
  const [allPosts, setAllPosts] = useState([])
  const [postData, setPostData] = useState({})
  const [showCommentForm, setShowCommentForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  function showCommentFormFunction(postId, postAuthor, index) {
    setPostData({ postId, postAuthor, index })
    setShowCommentForm(true)
  }

  useEffect(() => {
    getAllPosts()
  }, [])
  function refreshPosts() {
    getAllPosts()
    setRefreshBtn(false)
  }
  async function getAllPosts() {
    try {
      const response = await fetch("http://localhost:3001/allPosts", {
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
      setRefreshBtn(false)
      setAllPosts(data.allPosts)
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  async function likePost(postId, index) {
    if (!allPosts[index].likes[0]) {
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: ["likedPost"] } : post)))
    } else {
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: [] } : post)))
    }
    try {
      const response = await fetch(!allPosts[index].likes[0] ? "http://localhost:3001/likePost" : "http://localhost:3001/dislikePost", {
        method: !allPosts[index].likes[0] ? "POST" : "DELETE",
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
    } catch (error) {
      console.error(error)
    }
  }
  async function getComments(postId, index) {
    if (allPosts[index].showComments) {
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, showComments: false } : post)))
      return
    }
    try {
      const response = await fetch(`http://localhost:3001/getPostComments/${postId}`, {
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
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, showComments: true, coments: data.postComments } : post)))
    } catch (error) {
      console.error(error)
    }
  }
  if (loading) return <div className="loading">Loading...</div>
  return (
    <div className={showCommentForm ? "home-posts-container no-scroll" : "home-posts-container"}>
      {refreshBtn && (
        <button className="refreshBtn" onClick={refreshPosts}>
          Refresh
        </button>
      )}
      <GiDeer className="deer-icon-home" />
      {allPosts[0] && (
        <ul className={"allPosts-list"}>
          {allPosts.map((post, index) => (
            <div key={index} className={showCommentForm ? "post-and-comments blur" : "post-and-comments"}>
              <li>
                <div className="profilePic-author">
                  <div className="home-profilePic">
                    {post.author.profilePic && <img src={post.author.profilePic}></img>}
                    {!post.author.profilePic && (
                      <div className="profilePic-icon-home">
                        {" "}
                        <BsFillPersonFill />
                      </div>
                    )}
                  </div>
                  <h3>{post.authorUsername}</h3>
                </div>
                <p>{post.text}</p>
                <div className="allPosts-list-buttons">
                  <button
                    onClick={() => getComments(post.id, index)}
                    className={post.showComments ? "arrow-button active" : "arrow-button not-active"}
                  >
                    <RiArrowDownWideLine />
                  </button>
                  <button className={post.likes[0] ? "like-button liked" : "like-button"}>
                    <IoMdHeart onClick={() => likePost(post.id, index)} />
                  </button>
                </div>
              </li>
              {post.showComments && (
                <div className="post-comments-section">
                  <h4>Comments</h4>
                  <ul className="comments-container">
                    {!post.coments[0] && <p className="no-comments-made">No comments made</p>}
                    {post.coments.map((comment, index) => (
                      <li key={index}>
                        <div className="comment-container">
                          <h5>{comment.commentedByUsername}</h5>
                          <p>{comment.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button onClick={() => showCommentFormFunction(post.id, post.authorUsername, index)}>Add comment</button>
                </div>
              )}
            </div>
          ))}
          <div className={showCommentForm ? "comment-form-container active" : "comment-form-container"}>
            <PostComment setShowCommentForm={setShowCommentForm} postData={postData} allPosts={allPosts} setAllPosts={setAllPosts} />
          </div>
        </ul>
      )}
    </div>
  )
}

export default Home
