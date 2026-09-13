"use client";

import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setStatus("loading");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
    >
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0b2a63] text-white">
            <Mail className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#0b2a63]">
              Send us a message
            </h3>

            <p className="text-sm text-slate-500">
              We will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Full Name
          </label>

          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(event) =>
              setFormData({
                ...formData,
                name: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0b2a63] focus:ring-2 focus:ring-[#0b2a63]/10"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Email Address
          </label>

          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(event) =>
              setFormData({
                ...formData,
                email: event.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0b2a63] focus:ring-2 focus:ring-[#0b2a63]/10"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="subject"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Subject
        </label>

        <input
          id="subject"
          type="text"
          required
          value={formData.subject}
          onChange={(event) =>
            setFormData({
              ...formData,
              subject: event.target.value,
            })
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0b2a63] focus:ring-2 focus:ring-[#0b2a63]/10"
          placeholder="How can we help?"
        />
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Message
        </label>

        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(event) =>
            setFormData({
              ...formData,
              message: event.target.value,
            })
          }
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-[#0b2a63] focus:ring-2 focus:ring-[#0b2a63]/10"
          placeholder="Write your message here..."
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b2a63] px-7 py-3.5 font-semibold text-white transition hover:bg-[#071d45] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Send className="h-4 w-4" />

        {status === "loading"
          ? "Sending..."
          : "Send Message"}
      </button>

      {status === "success" && (
        <p className="mt-5 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Thank you. Your message has been sent successfully.
        </p>
      )}

      {status === "error" && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Sorry, we could not send your message. Please try again.
        </p>
      )}
    </form>
  );
}