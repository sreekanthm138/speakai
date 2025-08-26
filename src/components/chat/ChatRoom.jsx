import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../../auth/supabaseClient";
import { useAuth } from "../../auth/AuthContext";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatRoom() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef(null);

  // Load recent messages
  useEffect(() => {
    const load = async () => {
      let { data, error } = await supabase
        .from("messages")
        .select("id, user_id, text, created_at")
        .order("created_at", { ascending: true })
        .limit(200);
      if (!error) setMessages(data || []);
      setLoading(false);
      // scroll to bottom
      setTimeout(
        () =>
          listRef.current?.lastElementChild?.scrollIntoView({
            behavior: "auto",
          }),
        0
      );
    };
    load();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("messages-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          listRef.current?.lastElementChild?.scrollIntoView({
            behavior: "smooth",
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = async (text) => {
    if (!text.trim()) return;
    const message = {
      user_id: user.id,
      email: user.email,
      text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, message]);

    const { error } = await supabase.from("messages").insert(message);
    if (error) alert(error.message);
  };

  const handleDelete = async (id) => {
    await supabase.from("messages").delete().eq("id", id);
  };

  return (
    <div className="max-w-3xl mx-auto h-[70vh] flex flex-col rounded-2xl bg-slate-900 text-slate-100 border border-slate-800">
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Community Chat</h2>
        <span className="text-xs text-slate-400">
          Logged in as {user?.email}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={listRef}>
        {loading ? (
          <div className="text-center text-slate-400">Loading messages…</div>
        ) : (
          messages.map((m) => (
            <ChatMessage
              key={m.id}
              me={m.user_id === user.id}
              message={m}
              onDelete={() => handleDelete(m.id)}
            />
          ))
        )}
      </div>
      <div className="border-t border-slate-800 p-3">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  );
}
