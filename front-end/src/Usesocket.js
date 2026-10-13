import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

const SERVER_URL = "https://medicare-s8om.onrender.com";

// One socket connection is shared across the app; previously, each component opened its own connection.
let shared = { token: null, socket: null };

function ensureSocket(token) {
    if (!token) {
        shared.socket?.disconnect();
        shared = { token: null, socket: null };
        return null;
    }
    if (shared.socket && shared.token === token) return shared.socket;
    shared.socket?.disconnect(); // Close the old connection when the token changes.
    const socket = io(SERVER_URL, { auth: { token } });
    shared = { token, socket };
    return socket;
}

export default function useSocket() {
    const { accessToken } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(ensureSocket(accessToken));
        // Do not disconnect on unmount because other components also use this socket.
    }, [accessToken]);

    return socket;
}