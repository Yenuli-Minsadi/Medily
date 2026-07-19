import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";

export interface ChatRoom {
    chatRoomId: number;
    patientId: number;
    patientName: string;
    participantId: number;
    participantName: string;
    participantRole: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

export interface ChatMessage {
    messageId: number;
    chatRoomId: number;
    senderId: number;
    senderName: string;
    senderRole: string;
    content: string;
    isRead: boolean;
    sentAt: string;
}

export const useChat = (userId: number | null) => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
    const clientRef = useRef<Client | null>(null);

    const token = localStorage.getItem("token");

    // Fetch chat rooms
    const fetchRooms = async () => {
        if (!userId) return;
        try {
            const res = await axios.get("http://localhost:8080/api/chat/rooms", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(res.data.data);
        } catch (err) {
            console.error("Failed to fetch chat rooms", err);
        }
    };

    // Fetch messages for a room
    const fetchMessages = async (chatRoomId: number) => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/chat/rooms/${chatRoomId}/messages`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(res.data.data);
            setActiveRoomId(chatRoomId);
        } catch (err) {
            console.error("Failed to fetch messages", err);
        }
    };

    // Send message
    const sendMessage = async (chatRoomId: number, content: string) => {
        if (!content.trim()) return;
        try {
            const res = await axios.post(
                `http://localhost:8080/api/chat/rooms/${chatRoomId}/messages`,
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, res.data.data]);
            // Update last message in room list
            setRooms(prev => prev.map(r =>
                r.chatRoomId === chatRoomId
                    ? { ...r, lastMessage: content, lastMessageTime: new Date().toISOString() }
                    : r
            ));
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    // Create or get chat room
    const createOrGetRoom = async (patientId: number, participantId: number) => {
        try {
            const res = await axios.post(
                "http://localhost:8080/api/chat/rooms",
                { patientId, participantId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const room: ChatRoom = res.data.data;
            setRooms(prev => {
                const exists = prev.find(r => r.chatRoomId === room.chatRoomId);
                return exists ? prev : [room, ...prev];
            });
            await fetchMessages(room.chatRoomId);
            return room;
        } catch (err) {
            console.error("Failed to create chat room", err);
        }
    };

    // WebSocket connection
    useEffect(() => {
        if (!userId) return;
        fetchRooms();

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                client.subscribe(
                    `/user/${userId}/queue/chat`,
                    (msg) => {
                        const newMessage: ChatMessage = JSON.parse(msg.body);
                        // Add to messages if in active room
                        setMessages(prev => {
                            if (prev.length > 0 && prev[0].chatRoomId === newMessage.chatRoomId) {
                                return [...prev, newMessage];
                            }
                            return prev;
                        });
                        // Update room last message
                        setRooms(prev => prev.map(r =>
                            r.chatRoomId === newMessage.chatRoomId
                                ? { ...r, lastMessage: newMessage.content, unreadCount: r.unreadCount + 1 }
                                : r
                        ));
                    }
                );
            }
        });

        client.activate();
        clientRef.current = client;
        return () => { client.deactivate(); };
    }, [userId]);

    return { rooms, messages, activeRoomId, fetchRooms, fetchMessages, sendMessage, createOrGetRoom };
};