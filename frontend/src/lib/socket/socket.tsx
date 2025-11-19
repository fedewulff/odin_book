import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL;

const socket: Socket = io(`${URL}`, {
  // autoConnect: false,
  withCredentials: true,
});

export default socket;
