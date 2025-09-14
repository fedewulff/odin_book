import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import socket from "../../../../socket/socket"
import ErrorInRequest from "../../../error/errorInRequest"
import ProfilePicForm from "./profilePicForm"
import MyPosts from "./comments-follows-posts/myPosts"
import Follows from "./comments-follows-posts/follows"
import Comments from "./comments-follows-posts/comments"
import "./profile.css"
import { BiImageAdd } from "react-icons/bi"
import { IoMdList } from "react-icons/io"
import { IoPeopleCircleOutline } from "react-icons/io5"
import { BiCommentDetail } from "react-icons/bi"
const URL = import.meta.env.VITE_BACKEND_URL

function Profile({ setError, setStatusCode }) {
  const [loading, setLoading] = useState(true)
  const [showPicForm, setShowPicForm] = useState(false)
  const [profileData, setProfileData] = useState({})
  const [myPosts, setMyPosts] = useState(true)
  const [follows, setFollows] = useState(false)
  const [comments, setComments] = useState(false)
  const navigate = useNavigate()

  const showPicFormFunction = () => setShowPicForm(!showPicForm)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch(`${URL}/profileData`, {
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

        setProfileData(data.profileData)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [])
  async function logout() {
    socket.disconnect()
    try {
      const response = await fetch(`${URL}/logout`, {
        method: "POST",
        credentials: "include",
      })
      if (response.ok) {
        navigate("/")
        return
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error(error)
    }
  }
  function showPosts(val1, val2, val3) {
    setMyPosts(val1)
    setFollows(val2)
    setComments(val3)
  }

  if (loading) return <div className="loading">Loading...</div>
  return (
    <div className="profile">
      <ProfilePicForm profileData={profileData} setProfileData={setProfileData} showPicForm={showPicForm} showPicFormFunction={showPicFormFunction} />
      <button className="logout" onClick={logout}>
        Log out
      </button>
      <div className="profile-name-pic">
        <div className="profile-pic">
          {profileData.profilePic && <img src={profileData.profilePic} alt="profile pic" />}
          <button
            onClick={showPicFormFunction}
            className={showPicForm ? "btn-not-clickable" : !profileData.profilePic ? "profile-pic-btn" : "profile-pic-btn hide"}
          >
            <BiImageAdd className="new-pic-icon" />
          </button>
        </div>
        <p className="profile-name">{profileData.username}</p>
      </div>
      <div className="profile-content">
        <div className="profile-content-icons">
          <button className={myPosts ? "profile-icon active" : "profile-icon"} onClick={() => showPosts(true, false, false)}>
            <IoMdList />
          </button>
          <button className={follows ? "profile-icon active" : "profile-icon"} onClick={() => showPosts(false, true, false)}>
            <IoPeopleCircleOutline />
          </button>
          <button className={comments ? "profile-icon active" : "profile-icon"} onClick={() => showPosts(false, false, true)}>
            {" "}
            <BiCommentDetail />
          </button>
        </div>
        <div className="profile-content-data">
          {myPosts && <MyPosts />}
          {comments && <Comments />}
          {follows && <Follows />}
        </div>
      </div>
    </div>
  )
}

export default Profile
