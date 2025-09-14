const URL = import.meta.env.VITE_BACKEND_URL
import io from "socket.io-client"
const socket = io(`${URL}`, {
  // autoConnect: false,
  withCredentials: true,
})

export default socket
