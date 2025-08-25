// src/components/chat/ChatMessage.jsx
import React from "react";

export default function ChatMessage({ message, me, onDelete }) {
  const date = new Date(message.created_at);
  const who = me ? "You" : (message.email || "User");

  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 shadow ${
          me ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-100"
        }`}
      >
        <div className="text-xs opacity-80 mb-1">
          {who} • {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>

        <div className="whitespace-pre-wrap break-words">{message.text}</div>

        {me && (
          <button
            onClick={onDelete}
            className="mt-2 text-xs underline opacity-80 hover:opacity-100"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
