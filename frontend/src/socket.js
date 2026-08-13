import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL,
  {
    withCredentials: true,
    transports: ["polling", "websocket"],
  }
);

export default socket;