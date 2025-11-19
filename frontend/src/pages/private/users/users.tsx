import { useState, useEffect } from "react";
import "./users.css";
import { IoSearch } from "react-icons/io5";
import { BsFillPersonFill } from "react-icons/bs";
import useSendRequest from "../../../hook/useSendRequest";
import type { FriendInvite, User } from "../../../hook/useSendRequest";
const URL = import.meta.env.VITE_BACKEND_URL;

type UsersProps = {
  setError: React.Dispatch<React.SetStateAction<boolean>>;
};

function Users({ setError }: UsersProps) {
  const [friendRequests, setFriendRequests] = useState<FriendInvite[]>([]);
  const [refreshFriendRequests, setRefreshFriendRequests] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [refreshUsers, setRefreshUsers] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const usernameRegex = /^[a-z0-9_.-]*$/;
  const { fetchAPIs, data, loading, catchErr, friendReq } = useSendRequest();

  const refreshUsersFunction = () => setRefreshUsers(!refreshUsers);
  const refreshFriendRequestsFunction = () =>
    setRefreshFriendRequests(!refreshFriendRequests);

  //SEARCH USER
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchUser), 400);
    return () => clearTimeout(timer);
  }, [searchUser]);
  useEffect(() => {
    const controller = new AbortController(); // used to cancel ongoing request
    const signal = controller.signal;

    async function fetchData() {
      if (!usernameRegex.test(debouncedQuery)) {
        setUsers([]);
        return; // stop if input is invalid
      }
      if (!debouncedQuery.trim()) {
        await fetchAPIs("GET", `${URL}/users`, null, signal); // trigger if input is empty
      } else await getUsersList(debouncedQuery, signal);
    }
    fetchData();
    return () => controller.abort();
  }, [debouncedQuery]);
  async function getUsersList(userToSearch: string, signal?: AbortSignal) {
    if (userToSearch === ".") userToSearch = "Z";
    else if (userToSearch === "..") userToSearch = "ZZ";
    else if (userToSearch) {
      await fetchAPIs("GET", `${URL}/searchUser/${userToSearch}`, null, signal);
    } else fetchAPIs("GET", `${URL}/users`);
  }

  //GET FRIEND REQUESTS AND ACCEPT OR DENY
  useEffect(() => {
    getFriendRequests();
  }, [refreshFriendRequests]);
  useEffect(() => {
    if (!friendReq) return;
    else if (friendReq.message === "friend requests")
      setFriendRequests(friendReq.friendRequests ?? []);
    else if (friendReq.message === "accept friend" && friendReq?.fromUser)
      denyFriendReq(friendReq.fromUser);
    else if (friendReq.message === "deny friend")
      refreshFriendRequestsFunction();
  }, [friendReq]);
  async function getFriendRequests() {
    fetchAPIs("GET", `${URL}/getFriendRequests`);
  }
  async function acceptFriendReq(username: string) {
    fetchAPIs("POST", `${URL}/acceptFriendRequest`, { username });
  }
  async function denyFriendReq(username: string) {
    fetchAPIs("DELETE", `${URL}/denyFriendReq`, { username });
  }

  //GET ALL USERS AND UPDATE WHEN SENDING AND UNSENDING FRIEND REQUESTS
  useEffect(() => {
    getUsersList(searchUser);
  }, [refreshUsers]);
  useEffect(() => {
    if (!data) return;
    else if (data.message === "users") setUsers(data.users ?? []);
    else if (
      data.message === "friend request sent" ||
      data.message === "delete friend request"
    )
      refreshUsersFunction();
  }, [data]);

  //SEND OR UNSEND FRIEND REQUESTS
  async function sendFriendReq(username: string) {
    fetchAPIs("POST", `${URL}/sendFriendReq`, { username });
  }
  async function deleteFriendReq(username: string) {
    fetchAPIs("DELETE", `${URL}/deleteFriendReq`, { username });
  }

  //CATCH ERRORS IN FETCH
  useEffect(() => {
    if (catchErr) setError(true);
  }, [catchErr]);

  if (loading) return <div className="loading">Loading...</div>;
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
            onChange={(e) => setSearchUser(e.target.value)}
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
                    {friendReq.followReqFrom.profilePic && (
                      <img src={friendReq.followReqFrom.profilePic}></img>
                    )}
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
                  <button
                    className="accept-friend-button"
                    onClick={() =>
                      acceptFriendReq(friendReq.followReqFromUsername)
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="deny-friend-button"
                    onClick={() =>
                      denyFriendReq(friendReq.followReqFromUsername)
                    }
                  >
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
                  <button
                    className="follow-button"
                    onClick={() => sendFriendReq(user.username)}
                  >
                    Follow
                  </button>
                )}
                {user.followReqTo[0] && (
                  <button
                    className="requested-button"
                    onClick={() => deleteFriendReq(user.username)}
                  >
                    Requested
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default Users;
