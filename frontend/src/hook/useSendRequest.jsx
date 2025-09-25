import { useState } from "react"
import { useNavigate } from "react-router"
import socket from "../../socket/socket"

function useFetchData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [catchErr, setCatchErr] = useState(false)
  const [loginErr, setLoginErr] = useState("")
  const [signupErr, setSignupErr] = useState([])
  const [friendReq, setFriendReq] = useState(null)
  const statusErrors = [400, 401, 409]
  const friendReqJson = ["friend requests", "accept friend", "deny friend"]
  const navigate = useNavigate()

  async function fetchAPI(method, url, info = null) {
    const response = await fetch(url, {
      method: method,
      credentials: "include",
      headers: info
        ? {
            "Content-Type": "application/json",
          }
        : {},
      body: info ? JSON.stringify(info) : undefined,
    })
    return response
  }
  async function statusCode(status, response) {
    if (status === 200) {
      const result = await response.json()
      if (result.message === "login successful") {
        socket.disconnect().connect()
        navigate("/home")
      } else if (result.message === "logout") {
        navigate("/")
      } else if (friendReqJson.includes(result.message)) {
        setFriendReq(result)
      } else {
        setData(result)
      }
    } else if (status === 400) {
      const result = await response.json()
      if (result.errors) setSignupErr(result.errors)
    } else if (status === 401) {
      const result = await response.json()
      if (result.message === "wrong credentials") {
        setLoginErr(result.info.message)
      } else {
        navigate("/")
      }
    } else if (status === 409) {
      navigate("/home")
    }
  }
  const fetchAPIs = async (method, url, info = null) => {
    try {
      const response = await fetchAPI(method, url, info)
      statusCode(response.status, response)
      if (!response.ok && !statusErrors.includes(response.status)) throw new Error(`HTTP error! status: ${response.status}`)
    } catch (err) {
      console.error(err)
      setCatchErr(true)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    catchErr,
    loginErr,
    signupErr,
    friendReq,
    fetchAPIs,
  }
}

export default useFetchData
