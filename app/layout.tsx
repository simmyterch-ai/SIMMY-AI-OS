import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "@/contexts/AuthContext";
import OrganizationI18n from "@/components/i18n/OrganizationI18n";

import "./globals.css";

export const metadata: Metadata = {
  title: "SIMMY AI PLATFORM",
  description:
    "Enterprise AI Operating System by SIMMY LINK AFRICA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full">
        <AuthProvider>
          <OrganizationI18n>
            {children}
          </OrganizationI18n>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: "12px",
                background: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                boxShadow:
                  "0 10px 25px rgba(15,23,42,0.08)",
              },
              success: {
                iconTheme: {
                  primary: "#16a34a",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#dc2626",
                  secondary: "#ffffff",
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}