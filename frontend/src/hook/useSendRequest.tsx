import { useState } from "react";
import { useNavigate } from "react-router";
import socket from "../lib/socket/socket";

//HOME
export type AllPostsData = {
  id: number;
  text: string;
  image: null;
  showComments: boolean;
  authorUsername: string;
  likes: { likedByUsername?: string }[];
  author: { profilePic?: string };
  comments?: PostComment[];
};
type PostId = number;
export type PostComment = {
  id: number;
  text: string;
  postId: number;
  commentedByUsername: string;
};
//PROFILE
export type ProfileData = {
  id: number;
  username: string;
  profilePic: string | null;
};
export type ProfilePost = {
  id: number;
  text: string;
  image: string | null;
  showComments: boolean;
  authorUsername: string;
};
export type Following = {
  followingUsername: string;
  following: {
    profilePic: string | null;
  };
};
export type Follower = {
  followedByUsername: string;
  followedBy: {
    profilePic: string | null;
  };
};
export type MyComments = {
  id: number;
  text: string;
  postId: number;
  commentedByUsername: string;
};
//USERS
export type FriendInvite = {
  followReqToUsername: string;
  followReqFromUsername: string;
  followReqFrom: {
    profilePic: string | null;
  };
};
export type User = {
  id: number;
  username: string;
  profilePic: string | null;
  followReqTo: {
    followReqFromUsername: string;
  }[];
};

type Data = {
  message: string;
  allPosts?: AllPostsData[];
  postId?: PostId;
  postComments?: PostComment[];
  newComment?: PostComment;
  profileData?: ProfileData;
  profilePosts?: ProfilePost[];
  profileFollowing?: Following[];
  profileFollowers?: Follower[];
  profileComments?: MyComments[];
  users?: User[];
};

type FriendReq = {
  message: string;
  friendRequests?: FriendInvite[];
  fromUser?: string;
};

type JsonObject = Record<string, any>;
type FetchMethod = "GET" | "POST" | "PUT" | "DELETE";
type ApiError = {
  msg: string;
};

function useFetchData() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [catchErr, setCatchErr] = useState(false);
  const [loginErr, setLoginErr] = useState("");
  const [signupErr, setSignupErr] = useState<ApiError[]>([]);
  const [friendReq, setFriendReq] = useState<FriendReq | null>(null);
  const statusErrors = [400, 401, 409];
  const friendReqJson = ["friend requests", "accept friend", "deny friend"];
  const navigate = useNavigate();

  async function fetchAPI(method: FetchMethod, url: string, info: JsonObject | null, signal?: AbortSignal) {
    return fetch(url, {
      method: method,
      credentials: "include",
      signal,
      headers: info
        ? {
            "Content-Type": "application/json",
          }
        : {},
      body: info ? JSON.stringify(info) : undefined,
    });
  }
  async function statusCode(status: number, response: Response) {
    if (status === 200) {
      const result: Data = await response.json();
      if (result.message === "login successful") {
        socket.disconnect().connect();
        navigate("/home");
      } else if (result.message === "logout") {
        navigate("/");
      } else if (friendReqJson.includes(result.message)) {
        setFriendReq(result);
      } else {
        setData(result);
      }
    } else if (status === 400) {
      const result = await response.json();
      if (result.errors) setSignupErr(result.errors);
    } else if (status === 401) {
      const result = await response.json();
      if (result.message === "wrong credentials") {
        setLoginErr(result.info.message);
      } else {
        navigate("/");
      }
    } else if (status === 409) {
      navigate("/home");
    }
  }
  const fetchAPIs = async (method: FetchMethod, url: string, info: JsonObject | null = null, signal?: AbortSignal) => {
    try {
      const response = await fetchAPI(method, url, info, signal);
      if (!response.ok && !statusErrors.includes(response.status))
        throw new Error(`HTTP error! status: ${response.status}`);
      await statusCode(response.status, response);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Request aborted");
      } else {
        console.error(err);
        setCatchErr(true);
      }
    } finally {
      setLoading(false);
    }
  };

  function clearLoginErr() {
    setLoginErr("");
  }

  return {
    data,
    loading,
    catchErr,
    loginErr,
    signupErr,
    friendReq,
    fetchAPIs,
    clearLoginErr,
  };
}

export default useFetchData;
