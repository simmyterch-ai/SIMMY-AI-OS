"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function SettingsForm() {
  const [settings, setSettings] = useState({
    companyName: "SIMMY LINK AFRICA",
    email: "info@simmylinkafrica.com",
    phone: "+212 600 000 000",
    website: "www.simmylinkafrica.com",
    address: "Casablanca, Morocco",
    notifications: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: e.target.checked,
    }));
  };

 const handleSave = () => {
  toast.success("Settings saved successfully.");
};

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-800">
        Company Settings
      </h2>

      <p className="mt-2 text-slate-500">
        Update your organization information and preferences.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company Name
          </label>

          <input
            name="companyName"
            value={settings.companyName}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Company Email
          </label>

          <input
            name="email"
            value={settings.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone Number
          </label>

          <input
            name="phone"
            value={settings.phone}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Website
          </label>

          <input
            name="website"
            value={settings.website}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Office Address
        </label>

        <input
          name="address"
          value={settings.address}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div>
          <h3 className="font-semibold text-slate-800">
            Email Notifications
          </h3>

          <p className="text-sm text-slate-500">
            Receive important system updates.
          </p>
        </div>

        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={handleCheckbox}
          className="h-5 w-5"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-xl bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-800"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}