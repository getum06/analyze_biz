import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Laundromat Underwriting Copilot",
  description:
    "AI-powered laundromat acquisition analysis — extract, enrich, model, score, and memo in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 min-h-screen`}
      >
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🪣</span>
                <span className="font-semibold text-gray-900 text-sm sm:text-base">
                  Laundromat Copilot
                </span>
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  New Analysis
                </Link>
                <Link
                  href="/deals"
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  All Deals
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
