import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import "./users.css"
import { IoSearch } from "react-icons/io5"

function Users({ setError, setStatusCode }) {
  const [loading, setLoading] = useState(true)
  const [friendRequests, setFriendRequests] = useState([])
  const [refreshFriendRequests, setRefreshFriendRequests] = useState(true)
  const [users, setUsers] = useState([])
  const [searchUser, setSearchUser] = useState("")
  const [refreshUsers, setRefreshUsers] = useState(true)

  const navigate = useNavigate()

  const refreshUsersFunction = () => setRefreshUsers(!refreshUsers)
  const refreshFriendRequestsFunction = () => setRefreshFriendRequests(!refreshFriendRequests)

  useEffect(() => {
    getUsersList(searchUser)
  }, [refreshUsers])

  useEffect(() => {
    getFriendRequests()
  }, [refreshFriendRequests])

  async function getFriendRequests() {
    try {
      const response = await fetch("http://localhost:3001/getFriendRequests", {
        credentials: "include",
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (response.status === 404) {
        setFriendRequests([])
        return
      }
      if (!response.ok) {
        setStatusCode(response.status)
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      const data = await response.json()
      setFriendRequests(data.friendRequests)
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  async function acceptFriendReq(username) {
    try {
      const response = await fetch("http://localhost:3001/acceptFriendRequest", {
        method: "POST",
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
      denyFriendReq(username) // function called to delete the friend request
    } catch (error) {
      console.error(error)
    }
  }
  async function denyFriendReq(username) {
    try {
      const response = await fetch("http://localhost:3001/denyFriendReq", {
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
      refreshFriendRequestsFunction()
    } catch (error) {
      console.error(error)
    }
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
    if (userToSearch === ".") userToSearch = "Z"
    if (userToSearch === "..") userToSearch = "ZZ"
    try {
      const response = await fetch(userToSearch ? `http://localhost:3001/searchUser/${userToSearch}` : "http://localhost:3001/users", {
        credentials: "include",
      })
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (response.status === 404) {
        setUsers([])
        return
      }
      if (!response.ok) {
        setStatusCode(response.status)
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error(error)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  async function sendFriendReq(username) {
    try {
      const response = await fetch("http://localhost:3001/sendFriendReq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username }),
      })
      if (response.status === 200) {
        refreshUsersFunction()
        return
      }
      if (response.status === 401) {
        navigate("/")
        return
      }
      if (!response.ok) {
        setStatusCode(response.status)
        throw new Error(`${response.statusText} - Error code:${response.status} - ${response.url}`)
      }
    } catch (error) {
      console.error(error)
    }
  }
  async function deleteFriendReq(username) {
    try {
      const response = await fetch("http://localhost:3001/deleteFriendReq", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username }),
      })
      if (response.status === 200) {
        refreshUsersFunction()
        return
      }
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
                <p>{friendReq.followReqFromUsername}</p>
                <div>
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
                <p>{user.username}</p>
                {!user.followReqs[0] && (
                  <button className="follow-button" onClick={() => sendFriendReq(user.username)}>
                    Follow
                  </button>
                )}
                {user.followReqs[0] && (
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
