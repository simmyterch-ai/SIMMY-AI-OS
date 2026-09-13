"use client";

import { useState } from "react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function ChatInput({
  onSend,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || disabled) return;

    onSend(trimmedMessage);
    setMessage("");
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-200 bg-white px-6 py-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-end gap-3 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask SAP AI anything about your organization..."
            rows={1}
            disabled={disabled}
            className="max-h-32 min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="flex h-11 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Send
            <span className="ml-2">➤</span>
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between px-1">
          <p className="text-xs text-slate-400">
            Press Enter to send · Shift + Enter for a new line
          </p>

          <p className="text-xs text-slate-400">
            SAP AI
          </p>
        </div>
      </div>
    </div>
  );
}