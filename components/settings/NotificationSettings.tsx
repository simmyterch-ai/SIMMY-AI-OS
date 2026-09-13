"use client";

import { Bell, Mail, MessageSquare } from "lucide-react";

export default function NotificationSettings() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-8">

        <h2 className="text-2xl font-bold text-slate-900">
          Notification Settings
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose how you'd like to receive notifications from SAP.
        </p>

      </div>

      <div className="space-y-5">

        <NotificationRow
          icon={<Bell className="h-5 w-5 text-blue-600" />}
          title="Attendance Alerts"
          description="Receive notifications when employees clock in late."
        />

        <NotificationRow
          icon={<Mail className="h-5 w-5 text-emerald-600" />}
          title="Email Notifications"
          description="Receive important updates by email."
        />

        <NotificationRow
          icon={<MessageSquare className="h-5 w-5 text-purple-600" />}
          title="AI Recommendations"
          description="Receive proactive insights from SAP AI."
        />

      </div>

    </div>
  );
}

type NotificationRowProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function NotificationRow({
  icon,
  title,
  description,
}: NotificationRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-5">

      <div className="flex items-start gap-4">

        <div className="rounded-xl bg-slate-100 p-3">
          {icon}
        </div>

        <div>

          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <label className="relative inline-flex cursor-pointer items-center">

        <input
          type="checkbox"
          defaultChecked
          className="peer sr-only"
        />

        <div className="peer h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />

      </label>

    </div>
  );
}