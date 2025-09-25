import { useState, useEffect } from "react"
import "./users.css"
import { IoSearch } from "react-icons/io5"
import { BsFillPersonFill } from "react-icons/bs"
import useSendRequest from "../../../hook/useSendRequest"
const URL = import.meta.env.VITE_BACKEND_URL

function Users({ setError }) {
  const [friendRequests, setFriendRequests] = useState([])
  const [refreshFriendRequests, setRefreshFriendRequests] = useState(true)
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState("")
  const [refreshUsers, setRefreshUsers] = useState(true)
  const { fetchAPIs, data, loading, catchErr, friendReq } = useSendRequest()

  const refreshUsersFunction = () => setRefreshUsers(!refreshUsers)
  const refreshFriendRequestsFunction = () => setRefreshFriendRequests(!refreshFriendRequests)

  useEffect(() => {
    if (catchErr) setError(true)
  }, [catchErr])
  useEffect(() => {
    if (!friendReq) return
    else if (friendReq.message === "friend requests") setFriendRequests(friendReq.friendRequests)
    else if (friendReq.message === "accept friend") denyFriendReq(friendReq.fromUser) /*accepted friend and now i delete request */
    else if (friendReq.message === "deny friend") refreshFriendRequestsFunction()
  }, [friendReq])
  useEffect(() => {
    if (!data) return
    else if (data.message === "users") setUsers(data.users)
    else if (data.message === "friend request sent" || data.message === "delete friend request") refreshUsersFunction()
  }, [data])
  useEffect(() => {
    getUsersList(searchUser)
  }, [refreshUsers])
  useEffect(() => {
    getFriendRequests()
  }, [refreshFriendRequests])
  async function getFriendRequests() {
    fetchAPIs("GET", `${URL}/getFriendRequests`)
  }
  async function acceptFriendReq(username) {
    fetchAPIs("POST", `${URL}/acceptFriendRequest`, { username })
  }
  async function denyFriendReq(username) {
    fetchAPIs("DELETE", `${URL}/denyFriendReq`, { username })
  }
  function handleChange(e) {
    setSearchUser(e.target.value)
    const usernameRegex = /^[a-z0-9_.-]*$/
    if (!usernameRegex.test(e.target.value)) {
      setUsers([])
      return
    }
    getUsersList(e.target.value)
  }
  async function getUsersList(userToSearch) {
    if (!userToSearch) fetchAPIs("GET", `${URL}/users`)
    if (userToSearch === ".") userToSearch = "Z"
    if (userToSearch === "..") userToSearch = "ZZ"
    if (userToSearch) {
      fetchAPIs("GET", `${URL}/searchUser/${userToSearch}`)
    }
  }
  async function sendFriendReq(username) {
    fetchAPIs("POST", `${URL}/sendFriendReq`, { username })
  }
  async function deleteFriendReq(username) {
    fetchAPIs("DELETE", `${URL}/deleteFriendReq`, { username })
  }

  if (loading) return <div className="loading">Loading...</div>
  return (
    <div className="users-container">
      <form action="">
        <label htmlFor="searchUser"></label>
        <div className="input-container">
          <input
            type="text"
            name="searchUser"
            id="searchUser"
            placeholder="Search user"
            autoComplete="off"
            maxLength={20}
            value={searchUser.replace(/\s/g, "")}
            onChange={handleChange}
          />
          <button type="submit">
            <IoSearch className="input-container-icon" />
          </button>
        </div>
      </form>
      <div className="friendReqs-users-container">
        {friendRequests[0] && (
          <ul className="friend-req-list">
            <h3>Friend requests:</h3>
            {friendRequests.map((friendReq, index) => (
              <li key={index}>
                <div className="profilePic-name-users">
                  <div className="users-profilePic">
                    {friendReq.followReqFrom.profilePic && <img src={friendReq.followReqFrom.profilePic}></img>}
                    {!friendReq.followReqFrom.profilePic && (
                      <div className="profilePic-icon-users">
                        {" "}
                        <BsFillPersonFill />
                      </div>
                    )}
                  </div>
                  <p>{friendReq.followReqFromUsername}</p>
                </div>

                <div className="accept-deny-buttons">
                  <button className="accept-friend-button" onClick={() => acceptFriendReq(friendReq.followReqFromUsername)}>
                    Accept
                  </button>
                  <button className="deny-friend-button" onClick={() => denyFriendReq(friendReq.followReqFromUsername)}>
                    Deny
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {users[0] && (
          <ul className="users-list">
            <h3>Users:</h3>
            {users.map((user, index) => (
              <li key={index}>
                <div className="profilePic-name-users">
                  <div className="users-profilePic">
                    {user.profilePic && <img src={user.profilePic}></img>}
                    {!user.profilePic && (
                      <div className="profilePic-icon-users">
                        {" "}
                        <BsFillPersonFill />
                      </div>
                    )}
                  </div>
                  <p>{user.username}</p>
                </div>

                {!user.followReqTo[0] && (
                  <button className="follow-button" onClick={() => sendFriendReq(user.username)}>
                    Follow
                  </button>
                )}
                {user.followReqTo[0] && (
                  <button className="requested-button" onClick={() => deleteFriendReq(user.username)}>
                    Requested
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
export default Users
