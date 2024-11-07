import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

// Function to initialize socket connection
export const initSocketConnection = (token: string) => {
    
let baseURL = import.meta.env.VITE_BASE_URL; 

// Trim `/api` from the base URL if it exists
if (baseURL.endsWith("/api")) {
  baseURL = baseURL.replace("/api", "");
}

  if (!socket) {
    socket = io(baseURL, {
      query: {
        token: token // Pass JWT token for authentication
      },
    });

    // Optionally listen to the connection event
    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

// Function to get the active socket instance
export const getSocket = () => {
  return socket;
};

// Function to close the socket connection (optional)
export const closeSocketConnection = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
