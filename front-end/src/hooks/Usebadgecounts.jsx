import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import useSocket from "./useSocket";

/*
    The actual counts for the red badges in the sidebar and navbar.
    The ["my-notifications"] query key matches NotificationsPage, preventing duplicate fetches.
*/
export default function useBadgeCounts() {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const socket = useSocket();

    const role = user?.role;
    const enabled = Boolean(user) && role !== "admin"; // Unread counts do not apply to admins.
    const hasChat = role === "patient" || role === "doctor";

    const notifications = useQuery({
        queryKey: ["my-notifications"],
        queryFn: async () => (await axiosSecure.get("/api/notifications/mine")).data.notifications,
        enabled,
        staleTime: 30_000,
    });

    const messages = useQuery({
        queryKey: ["unread-messages"],
        queryFn: async () => (await axiosSecure.get("/api/conversations/unread-count")).data.count,
        enabled: enabled && hasChat,
        staleTime: 30_000,
    });

    // Update the badge when a notification arrives; the server sends it to the personal room, so no page needs to be open.
    useEffect(() => {
        if (!socket || !enabled) return undefined;

        const onNew = (n) => {
            queryClient.setQueryData(["my-notifications"], (old) => {
                if (!old) return [n];
                if (old.some((x) => x._id === n._id)) return old;
                return [n, ...old];
            });
            if (n.type === "message") queryClient.invalidateQueries({ queryKey: ["unread-messages"] });
        };

        socket.on("new_notification", onNew);
        return () => socket.off("new_notification", onNew);
    }, [socket, enabled, queryClient]);

    return {
        notifications: (notifications.data ?? []).filter((n) => !n.read).length,
        messages: messages.data ?? 0,
    };
}