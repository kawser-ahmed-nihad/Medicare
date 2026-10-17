import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";

const SERVER_URL = "http://localhost:3000";

export default function useSocket() {
    const { accessToken } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!accessToken) {
            setSocket(null);
            return;
        }
        const s = io(SERVER_URL, { auth: { token: accessToken } });
        setSocket(s);
        return () => s.disconnect();
    }, [accessToken]);

    return socket;
}