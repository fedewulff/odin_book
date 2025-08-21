import { useState, useEffect } from "react"
import { useNavigate } from "react-router"

function Follows() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showFollowing, setShowFollowing] = useState(true)
  const [refreshFollows, setRefreshFollows] = useState(true)
  const [following, setFollowing] = useState([])
  const [followers, setFollowers] = useState([])
  const navigate = useNavigate()

  const showFollowingFunction = () => setShowFollowing(!showFollowing)
  const refreshFollowsFunction = () => setRefreshFollows(!refreshFollows)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetch(showFollowing ? "http://localhost:3001/profileFollowing" : "http://localhost:3001/profileFollowers", {
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
        if (showFollowing) setFollowing(data.profileFollowing)
        if (!showFollowing) setFollowers(data.profileFollowers)
      } catch (error) {
        console.error(error)
        setError(true)
      } finally {
        setLoading(false)
      }
    })()
  }, [showFollowing, refreshFollows])

  async function deleteFollow(username) {
    try {
      const response = await fetch(showFollowing ? "http://localhost:3001/deleteFollowing" : "http://localhost:3001/deleteFollower", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username }),
      })

      if (response.status === 401) {
        navigate("/")
        return
      }
      if (!response.ok) {
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      refreshFollowsFunction()
    } catch {
      console.error(error)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <p className="error">Oops, something went wrong</p>
  return (
    <div>
      <div className="following-followers-btns">
        <button onClick={showFollowingFunction} className={showFollowing ? "show-follow" : ""}>
          Following
        </button>
        <button onClick={showFollowingFunction} className={!showFollowing ? "show-follow" : ""}>
          Followers
        </button>
      </div>

      {following[0] && showFollowing && (
        <ul className="following-followers-list">
          {following.map((userFollowed, index) => (
            <li key={index} className="following-followers-item">
              {userFollowed.followingUsername}
              <button className="following-followers-delete-button" onClick={() => deleteFollow(userFollowed.followingUsername)}>
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
              {follower.followedByUsername}
              <button className="following-followers-delete-button" onClick={() => deleteFollow(follower.followedByUsername)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Follows
