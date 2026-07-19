import { useState, useEffect, useRef } from "react";
import { useChat } from "../hooks/useChat";
import axios from "axios";

interface Props {
    userId: number | null;
    userRole: "PATIENT" | "DOCTOR" | "PHARMACIST";
    userName: string;
    initialRoomPatientId?: number;
    initialRoomParticipantId?: number;
}

export const ChatUI: React.FC<Props> = ({ userId, userRole, userName, initialRoomParticipantId }) => {
    const { rooms, messages, activeRoomId, fetchMessages, sendMessage, createOrGetRoom } = useChat(userId);
    const [msg, setMsg] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [searchPatient, setSearchPatient] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!initialRoomParticipantId || !userId || rooms.length === 0) return;
        const targetRoom = userRole === "PATIENT"
            ? rooms.find(r => r.participantId === initialRoomParticipantId)
            : rooms.find(r => r.patientId === initialRoomParticipantId);
        if (targetRoom) {
            fetchMessages(targetRoom.chatRoomId);
        }
    }, [rooms, initialRoomParticipantId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (!userRole) return;

        let endpoint = "";
        if (userRole === "PATIENT") {
            endpoint = "http://localhost:8080/api/chat/participants"; // doctors + pharmacists
        } else if (userRole === "DOCTOR") {
            endpoint = "http://localhost:8080/api/chat/doctor-patients"; // only their patients
        } else if (userRole === "PHARMACIST") {
            endpoint = "http://localhost:8080/api/chat/patients"; // all patients
        }

        axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => setPatients(res.data.data))
            .catch(console.error);
    }, [userRole]);

    const handleSend = () => {
        if (!activeRoomId || !msg.trim()) return;
        sendMessage(activeRoomId, msg);
        setMsg("");
    };

    const handleStartChat = async (otherUserId: number) => {
        if (!userId) return;
        if (userRole === "PATIENT") {
            // Patient starts chat: patient=userId, participant=otherUserId
            await createOrGetRoom(userId, otherUserId);
        } else {
            // Pharmacy/Doctor starts chat: patient=otherUserId, participant=userId
            await createOrGetRoom(otherUserId, userId);
        }
        setShowNewChat(false);
        setSearchPatient("");
    };

    const activeRoom = rooms.find(r => r.chatRoomId === activeRoomId);
    const otherPersonName = (room: any) => {
        if (userRole === "PATIENT") return room.participantName;
        return room.patientName;
    };

    const filteredPatients = patients.filter(p =>
        p.fullName.toLowerCase().includes(searchPatient.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-180px)] flex gap-4 min-h-[500px]">
            {/* New Chat Modal */}
            {showNewChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                        <h3 className="font-bold text-gray-900 mb-3">
                            {userRole === "DOCTOR" ? "Message a Patient" :
                                userRole === "PHARMACIST" ? "Message a Patient" :
                                    "Start New Chat"}
                        </h3>
                        <input
                            value={searchPatient}
                            onChange={e => setSearchPatient(e.target.value)}
                            placeholder={userRole === "PATIENT" ? "Search doctors or pharmacies..." : "Search patients..."}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-400 mb-3"
                        />
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {filteredPatients.map(p => (
                                <button
                                    key={p.userId}
                                    onClick={() => handleStartChat(p.userId)}
                                    className="w-full flex items-center gap-3 p-2.5 bg-gray-50 hover:bg-indigo-50 rounded-xl text-left transition-colors">
                                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.fullName)}&background=4f46e5&color=fff`}
                                         alt="" className="w-8 h-8 rounded-lg" />
                                    <span className="text-sm font-semibold text-gray-800">{p.fullName}</span>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowNewChat(false)}
                                className="mt-3 w-full border border-gray-200 text-gray-500 py-2 rounded-xl text-sm font-bold">
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <div className="w-72 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-gray-900 text-sm">Messages</div>
                        {(
                            <button
                                onClick={() => setShowNewChat(true)}
                                className="w-7 h-7 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-lg hover:bg-indigo-700 transition-colors">
                                +
                            </button>
                        )}
                    </div>
                    <input placeholder="Search…" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-300" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {rooms.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 text-sm">No conversations yet</div>
                    ) : rooms.map(room => (
                        <button
                            key={room.chatRoomId}
                            onClick={() => fetchMessages(room.chatRoomId)}
                            className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeRoomId === room.chatRoomId ? "bg-indigo-50" : ""}`}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(otherPersonName(room))}&background=4f46e5&color=fff`}
                                alt="" className="w-10 h-10 rounded-xl flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900 text-xs">{otherPersonName(room)}</span>
                                    <span className="text-gray-400 text-xs">
                                        {room.lastMessageTime ? new Date(room.lastMessageTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </span>
                                </div>
                                <div className="text-gray-500 text-xs truncate mt-0.5">{room.lastMessage || "No messages yet"}</div>
                            </div>
                            {room.unreadCount > 0 && (
                                <div className="w-5 h-5 bg-indigo-600 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {room.unreadCount}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
                {!activeRoomId ? (
                    <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-400">
                        <div className="text-5xl">💬</div>
                        <p className="text-sm font-medium">Select a conversation to start chatting</p>
                        {(
                            <button onClick={() => setShowNewChat(true)}
                                    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors">
                                Start New Chat
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(activeRoom ? otherPersonName(activeRoom) : "")}&background=4f46e5&color=fff`}
                                alt="" className="w-9 h-9 rounded-xl" />
                            <div>
                                <div className="font-bold text-gray-900 text-sm">{activeRoom ? otherPersonName(activeRoom) : ""}</div>
                                <div className="text-emerald-500 text-xs font-semibold">Online</div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map(m => (
                                <div key={m.messageId} className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${m.senderId === userId ? "bg-indigo-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-gray-50 flex gap-2">
                            <input
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSend()}
                                placeholder="Type a message…"
                                className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-300" />
                            <button onClick={handleSend}
                                    className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};