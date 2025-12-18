import { useState, useEffect } from "react";
import socket from "../../../lib/socket/socket";
import ProfilePicForm from "./profilePicForm";
import MyPosts from "./comments-follows-posts/myPosts";
import Follows from "./comments-follows-posts/follows";
import Comments from "./comments-follows-posts/comments";
import "./profile.css";
import { BiImageAdd, BiCommentDetail } from "react-icons/bi";
import { IoMdList } from "react-icons/io";
import { IoPeopleCircleOutline } from "react-icons/io5";
import useSendRequest from "../../../hook/useSendRequest";
import type { ProfileData } from "../../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

type HomeProps = {
  setError: React.Dispatch<React.SetStateAction<boolean>>;
};

function Profile({ setError }: HomeProps) {
  const [showPicForm, setShowPicForm] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | undefined>();
  const [myPosts, setMyPosts] = useState(true);
  const [follows, setFollows] = useState(false);
  const [comments, setComments] = useState(false);
  const { fetchAPIs, data, loading, catchErr } = useSendRequest();

  const showPicFormFunction = () => setShowPicForm(!showPicForm);
  useEffect(() => {
    if (catchErr) setError(true);
  }, [catchErr]);
  useEffect(() => {
    if (!data) return;
    if (data.message === "profile data") setProfileData(data.profileData);
  }, [data]);
  useEffect(() => {
    fetchAPIs("GET", `${URL}/profileData`);
  }, []);
  async function logout() {
    socket.disconnect();
    fetchAPIs("POST", `${URL}/logout`);
  }
  function showPosts(val1: boolean, val2: boolean, val3: boolean) {
    setMyPosts(val1);
    setFollows(val2);
    setComments(val3);
  }

  if (loading || !profileData) return <div className="loading">Loading...</div>;
  return (
    <div className="profile">
      <ProfilePicForm
        profileData={profileData}
        setProfileData={setProfileData}
        showPicForm={showPicForm}
        showPicFormFunction={showPicFormFunction}
      />
      <button className="logout" onClick={logout}>
        Log out
      </button>
      <div className="profile-name-pic">
        <div className="profile-pic">
          {profileData.profilePic && <img src={profileData.profilePic} alt="profile pic" />}
          <button
            onClick={showPicFormFunction}
            className={
              showPicForm ? "btn-not-clickable" : !profileData.profilePic ? "profile-pic-btn" : "profile-pic-btn hide"
            }
          >
            <BiImageAdd className="new-pic-icon" />
          </button>
        </div>
        <p className="profile-name">{profileData.username}</p>
      </div>
      <div className="profile-content">
        <div className="profile-content-icons">
          <button
            className={myPosts ? "profile-icon active" : "profile-icon"}
            onClick={() => showPosts(true, false, false)}
          >
            <IoMdList />
          </button>
          <button
            className={follows ? "profile-icon active" : "profile-icon"}
            onClick={() => showPosts(false, true, false)}
          >
            <IoPeopleCircleOutline />
          </button>
          <button
            className={comments ? "profile-icon active" : "profile-icon"}
            onClick={() => showPosts(false, false, true)}
          >
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
  );
}

export default Profile;
