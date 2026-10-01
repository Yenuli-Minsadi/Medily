import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BotMessageSquare, ArrowUp } from "lucide-react";

interface ChatMessage {
    role: "user" | "model";
    text: string;
    isError?: boolean;
}

const AssistantChatPage: React.FC = () => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const generateBotResponse = async (history: ChatMessage[]) => {
        const updateHistory = (text: string, isError = false) => {
            setChatHistory((prev) => [
                ...prev.filter((msg) => msg.text !== "Thinking..."),
                { role: "model", text, isError },
            ]);
        };

        try {
            const token = localStorage.getItem("token");
            const lastUserMessage = history[history.length - 1]?.text ?? "";

            const res = await axios.post(
                "http://localhost:8080/api/assistant/chat",
                { message: lastUserMessage },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const replyText: string = res.data.reply ?? "No response.";
            updateHistory(replyText.replace(/\*\*(.*?)\*\*/g, "$1").trim());
        } catch (err: any) {
            updateHistory(
                err.response?.data?.error || err.message || "Something went wrong!",
                true
            );
        }
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = input.trim();
        if (!userMessage) return;
        setInput("");

        const updatedHistory: ChatMessage[] = [
            ...chatHistory,
            { role: "user", text: userMessage },
        ];
        setChatHistory(updatedHistory);

        setTimeout(() => {
            setChatHistory((history) => [
                ...history,
                { role: "model", text: "Thinking..." },
            ]);
            generateBotResponse(updatedHistory);
        }, 400);
    };

    useEffect(() => {
        chatBodyRef.current?.scrollTo({
            top: chatBodyRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [chatHistory]);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-black text-gray-900">AI Assistant</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                    Ask general health questions and get instant answers
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[70vh] overflow-hidden">
                {/* Chat body */}
                <div
                    ref={chatBodyRef}
                    className="flex-1 overflow-y-auto p-5 space-y-4"
                >
                    {/* Default greeting */}
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
                            <BotMessageSquare size={18} />
                        </div>
                        <p className="bg-gray-100 text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[75%]">
                            Hey! How can I help you today?
                        </p>
                    </div>

                    {chatHistory.map((chat, i) => (
                        <div
                            key={i}
                            className={`flex items-start gap-3 ${
                                chat.role === "user" ? "justify-end" : ""
                            }`}
                        >
                            {chat.role === "model" && (
                                <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
                                    <BotMessageSquare size={18} />
                                </div>
                            )}
                            <p
                                className={`text-sm rounded-2xl px-4 py-2.5 max-w-[75%] ${
                                    chat.role === "user"
                                        ? "bg-indigo-600 text-white rounded-tr-sm"
                                        : chat.isError
                                            ? "bg-red-50 text-red-600 rounded-tl-sm"
                                            : "bg-gray-100 text-gray-800 rounded-tl-sm"
                                }`}
                            >
                                {chat.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Footer / input */}
                <form
                    onSubmit={handleSend}
                    className="border-t border-gray-100 p-4 flex items-center gap-2"
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        placeholder="Message..."
                        required
                        className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                    <button
                        type="submit"
                        className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex-shrink-0"
                    >
                        <ArrowUp size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AssistantChatPage;