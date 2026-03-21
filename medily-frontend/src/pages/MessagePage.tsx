import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MessageSquare,
} from "lucide-react";

const MessagesPage: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "doctor",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  return (
    <div className="flex h-screen bg-white font-sans text-slate-900">
      {/* 1. Left Sidebar: Patient List */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {MOCK_PATIENTS.map((patient) => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${selectedPatient?.id === patient.id ? "bg-blue-50 border-r-4 border-blue-600" : ""}`}
            >
              <div className="size-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                {patient.initials}
              </div>
              <div className="flex-1 text-left">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-slate-800">
                    {patient.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    10:45 AM
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {patient.lastMsg}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/50">
        {selectedPatient ? (
          <>
            {/* Header */}
            <div className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {selectedPatient.initials}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    {selectedPatient.name}
                  </h3>
                  <p className="text-xs text-green-500 font-medium capitalize">
                    {selectedPatient.status}
                  </p>
                </div>
              </div>
              <div className="flex gap-4 text-slate-400">
                <Phone className="cursor-pointer hover:text-blue-600 transition-colors size-5" />
                <Video className="cursor-pointer hover:text-blue-600 transition-colors size-5" />
                <MoreVertical className="cursor-pointer hover:text-blue-600 transition-colors size-5" />
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <p className="text-center text-slate-400 text-sm mt-10">
                  No messages yet. Say hello!
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === "doctor" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                      m.sender === "doctor"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{m.text}</p>
                    <span
                      className={`text-[10px] mt-1 block ${m.sender === "doctor" ? "text-blue-100" : "text-slate-400"}`}
                    >
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
            >
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Paperclip className="size-5" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a secure message..."
                className="flex-1 py-2 px-4 bg-slate-100 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-all active:scale-95"
              >
                <Send className="size-4" />
              </button>
            </form>
          </>
        ) : (
          /* Empty State - Matched to your screenshot */
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-2xl aspect-[16/9] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-white/50">
              <div className="p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                <MessageSquare className="size-12 text-slate-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Patient Messages
              </h2>
              <p className="text-slate-500">
                Communicate securely with your patients
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
