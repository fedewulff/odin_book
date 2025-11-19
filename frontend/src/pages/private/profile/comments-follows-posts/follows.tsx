import { useState, useEffect } from "react";
import { BsFillPersonFill } from "react-icons/bs";
import useSendRequest from "../../../../hook/useSendRequest";
import type { Following, Follower } from "../../../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

function Follows() {
  const [showFollowing, setShowFollowing] = useState(true);
  const [refreshFollows, setRefreshFollows] = useState(true);
  const [following, setFollowing] = useState<Following[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const { fetchAPIs, data, loading, catchErr } = useSendRequest();

  const showFollowingFunction = () => setShowFollowing(!showFollowing);
  const refreshFollowsFunction = () => setRefreshFollows(!refreshFollows);

  useEffect(() => {
    if (!data) return;
    else if (data.message === "following")
      setFollowing(data.profileFollowing ?? []);
    else if (data.message === "followers")
      setFollowers(data.profileFollowers ?? []);
    else if (
      data.message === "delete following" ||
      data.message === "delete follower"
    )
      refreshFollowsFunction();
  }, [data]);
  useEffect(() => {
    if (showFollowing) fetchAPIs("GET", `${URL}/profileFollowing`);
    else fetchAPIs("GET", `${URL}/profileFollowers`);
  }, [showFollowing, refreshFollows]);
  async function deleteFollow(username: string) {
    if (showFollowing)
      fetchAPIs("DELETE", `${URL}/deleteFollowing`, { username });
    else fetchAPIs("DELETE", `${URL}/deleteFollower`, { username });
  }

  if (loading) return <div className="loading">Loading...</div>;
  if (catchErr) return <p className="error">Oops, something went wrong</p>;
  return (
    <div>
      <div className="following-followers-btns">
        <button
          onClick={showFollowingFunction}
          className={showFollowing ? "show-follow" : ""}
        >
          Following
        </button>
        <button
          onClick={showFollowingFunction}
          className={!showFollowing ? "show-follow" : ""}
        >
          Followers
        </button>
      </div>

      {following[0] && showFollowing && (
        <ul className="following-followers-list">
          {following.map((userFollowed, index) => (
            <li key={index} className="following-followers-item">
              <div className="profilePic-name-follows">
                <div className="follows-profilePic">
                  {userFollowed.following.profilePic && (
                    <img src={userFollowed.following.profilePic}></img>
                  )}
                  {!userFollowed.following.profilePic && (
                    <div className="profilePic-icon">
                      {" "}
                      <BsFillPersonFill />
                    </div>
                  )}
                </div>
                <p>{userFollowed.followingUsername}</p>
              </div>

              <button
                className="following-followers-delete-button"
                onClick={() => deleteFollow(userFollowed.followingUsername)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {followers[0] && !showFollowing && (
        <ul className="following-followers-list">
          {followers.map((follower, index) => (
            <li key={index} className="following-followers-item">
              <div className="profilePic-name-follows">
                <div className="follows-profilePic">
                  {follower.followedBy.profilePic && (
                    <img src={follower.followedBy.profilePic}></img>
                  )}
                  {!follower.followedBy.profilePic && (
                    <div className="profilePic-icon">
                      {" "}
                      <BsFillPersonFill />
                    </div>
                  )}
                </div>
                <p>{follower.followedByUsername}</p>
              </div>

              <button
                className="following-followers-delete-button"
                onClick={() => deleteFollow(follower.followedByUsername)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Follows;
