type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatMessage({
  role,
  content,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[80%] gap-3 ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
            isUser
              ? "bg-slate-200 text-slate-700"
              : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-sm"
          }`}
        >
          {isUser ? "You" : "AI"}
        </div>

        {/* Message */}
        <div>
          <div
            className={`rounded-2xl px-5 py-4 text-sm leading-6 ${
              isUser
                ? "rounded-tr-md bg-blue-600 text-white"
                : "rounded-tl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
            }`}
          >
            <p className="whitespace-pre-wrap">
              {content}
            </p>
          </div>

          <p
            className={`mt-1 px-1 text-[11px] text-slate-400 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {isUser ? "You" : "SAP AI Assistant"}
          </p>
        </div>
      </div>
    </div>
  );
}