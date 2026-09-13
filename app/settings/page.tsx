"use client";

import SettingsHeader from "@/components/settings/SettingsHeader";
import ProfileSettings from "@/components/settings/ProfileSettings";
import OrganizationSettings from "@/components/settings/OrganizationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AppearanceSettings from "@/components/settings/AppearanceSettings";
import AISettings from "@/components/settings/AISettings";
import SystemInformation from "@/components/settings/SystemInformation";

export default function SettingsPage() {
  return (
    <div className="space-y-8">

      <SettingsHeader />

      <ProfileSettings />

      <OrganizationSettings />

      <SecuritySettings />

      <NotificationSettings />

      <AppearanceSettings />

      <AISettings />

      <SystemInformation />

    </div>
  );
}