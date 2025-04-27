import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthProvider from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter", 
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Zanet定时任务管理平台",
  description: "基于Vercel和GitHub Actions的定时任务管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="min-h-screen">
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
