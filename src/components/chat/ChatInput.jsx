import React, { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    setBusy(true);
    await onSend(value);
    setBusy(false);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <input
        className="flex-1 rounded-xl bg-slate-800 px-3 py-2 outline-none"
        placeholder="Type a message…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        disabled={busy}
        className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-medium disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
