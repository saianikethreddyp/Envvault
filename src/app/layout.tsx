import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  title: "EnvVault - Environment Variable Manager",
  description: "A modern, secure way to manage your environment variables across projects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`} style={{ background: '#0d0d12' }}>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-60 p-6">
            {children}
          </main>
        </div>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          },
        }} />
      </body>
    </html>
  );
}
