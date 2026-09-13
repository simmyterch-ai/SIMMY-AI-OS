"use client";

import { useState } from "react";

import AssistantWelcome from "@/components/ai/AssistantWelcome";
import ChatMessage from "@/components/ai/ChatMessage";
import ChatInput from "@/components/ai/ChatInput";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const generateResponse = (message: string) => {
    const prompt = message.toLowerCase();

    if (prompt.includes("workforce")) {
      return `Here is your workforce overview:

• Your organization currently has employees across multiple departments.
• Active employees represent the core available workforce.
• Teams help organize employees into operational units.
• Management should continue monitoring inactive, pending and suspended users.

As SAP develops, I will be able to provide deeper workforce analytics using live organizational data.`;
    }

    if (prompt.includes("department")) {
      return `Department analysis:

Your organization is structured across key business functions including Management, Human Resources, Finance, Sales, Marketing and Information Technology.

A strong next step is to connect every employee and team directly to their department so SAP can calculate department size, leadership structure and performance indicators automatically.`;
    }

    if (
      prompt.includes("inactive") ||
      prompt.includes("pending") ||
      prompt.includes("suspended")
    ) {
      return `Employee status review:

Employees marked as Inactive, Pending or Suspended may require management attention.

Recommended actions:

• Review pending employee onboarding.
• Confirm why inactive accounts are still retained.
• Review suspended accounts before restoring access.
• Keep active employee records accurate.

Later, SAP AI will retrieve these employees directly from the database.`;
    }

    if (
      prompt.includes("management") ||
      prompt.includes("recommendation")
    ) {
      return `Management recommendations:

1. Keep employee and department records updated.
2. Assign clear team leaders and reporting structures.
3. Monitor inactive and suspended accounts.
4. Track department and team growth.
5. Use reports to identify workforce and operational trends.

As more SAP modules become connected, these recommendations can become specific to your organization's real-time data.`;
    }

    return `I received your request:

"${message}"

The SAP AI Assistant interface is working correctly.

At this V1 stage, I am using predefined business responses. The next AI integration stage will connect this interface to an AI model and SAP organizational data so I can answer broader questions dynamically.`;
  };

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: generateResponse(content),
    };

    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      assistantMessage,
    ]);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl text-white shadow-sm">
            ✨
          </div>

          <div>
            <h1 className="font-bold text-slate-900">
              SAP AI Assistant
            </h1>

            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500" />

              <p className="text-xs text-slate-500">
                Assistant Online
              </p>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClearChat}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            New Chat
          </button>
        )}
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <AssistantWelcome
            onPromptSelect={handleSendMessage}
          />
        ) : (
          <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} />
    </div>
  );
}