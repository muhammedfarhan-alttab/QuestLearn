import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuestLearn • Chronicles of Hallownest",
  description: "Hollow Knight-inspired dark Gothic pixel-art RPG coding trials",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#020617] text-slate-100 relative">
        {/* Fixed Darkened Hueco Mundo Background Layer */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/bg-main.jpg')",
          }}
        />
        {/* Dark Vignette & Shading Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#020617]/85 via-[#030712]/75 to-[#020617]/90 backdrop-brightness-[0.6]" 
        />
        {/* Foreground Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
