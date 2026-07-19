import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

export interface Notification {
    notificationId: number;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
}

export const useNotifications = (userId: number | null) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch existing notifications on mount
    useEffect(() => {
        if (!userId) return;
        const token = localStorage.getItem("token");
        axios.get("http://localhost:8080/api/notifications", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setNotifications(res.data.data);
            setUnreadCount(res.data.data.filter((n: Notification) => !n.isRead).length);
        }).catch(console.error);
    }, [userId]);

    // Connect WebSocket
    useEffect(() => {
        if (!userId) return;
        const token = localStorage.getItem("token");

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(
                    `/user/${userId}/queue/notifications`,
                    (message) => {
                        const notification: Notification = JSON.parse(message.body);
                        setNotifications(prev => [notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    }
                );
            },
            onDisconnect: () => console.log("WebSocket disconnected"),
        });

        client.activate();
        return () => { client.deactivate(); };
    }, [userId]);

    const markAllRead = async () => {
        const token = localStorage.getItem("token");
        await axios.patch("http://localhost:8080/api/notifications/read", {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUnreadCount(0);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    return { notifications, unreadCount, markAllRead };
};