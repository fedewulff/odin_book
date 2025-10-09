import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import PostComment from "./postComment"
import "./home.css"
import { GiDeer } from "react-icons/gi"
import { BsFillPersonFill } from "react-icons/bs"
import { IoMdHeart } from "react-icons/io"
import { RiArrowDownWideLine } from "react-icons/ri"
import useSendRequest from "../../../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function Home({ setError, refreshBtn, setRefreshBtn }) {
  const [allPosts, setAllPosts] = useState([])
  const [postData, setPostData] = useState({})
  const [showCommentForm, setShowCommentForm] = useState(false)
  const { fetchAPIs, data, loading, catchErr } = useSendRequest()

  function showCommentFormFunction(postId, postAuthor, index) {
    setPostData({ postId, postAuthor, index })
    setShowCommentForm(true)
  }
  useEffect(() => {
    if (catchErr) setError(true)
  }, [catchErr])
  useEffect(() => {
    if (!data) return
    if (data.message === "all posts") setAllPosts(data.allPosts)
    if (data.message === "post comments")
      setAllPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === data.postId ? { ...post, showComments: true, coments: data.postComments } : post))
      )
  }, [data])
  useEffect(() => {
    fetchAPIs("GET", `${URL}/allPosts`)
  }, [])
  function refreshPosts() {
    fetchAPIs("GET", `${URL}/allPosts`)
    setRefreshBtn(false)
  }
  async function likePost(postId, index) {
    if (!allPosts[index].likes[0]) {
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: ["likedPost"] } : post)))
      fetchAPIs("POST", `${URL}/likePost`, { postId })
    } else {
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, likes: [] } : post)))
      fetchAPIs("DELETE", `${URL}/dislikePost`, { postId })
    }
  }
  async function getComments(postId, index) {
    if (allPosts[index].showComments) {
      setAllPosts((prevPosts) => prevPosts.map((post) => (post.id === postId ? { ...post, showComments: false } : post)))
      return
    }
    fetchAPIs("GET", `${URL}/getPostComments/${postId}`)
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
