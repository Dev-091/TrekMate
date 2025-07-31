
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrekMate - Your AI Trekking Guide",
  description: "Explore the breathtaking beauty of Indian trekking routes with your personal AI-powered virtual guide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
      style={{
        // Tailwind custom properties for colors
        // These match the :root in the HTML version
        // and allow Tailwind's bg-[var(--primary)] etc. to work
        ['--primary' as any]: '#eccbbf',
        ['--secondary' as any]: '#1f1714',
        ['--accent' as any]: '#41302a',
        ['--text-light' as any]: '#f3e9e5',
        ['--text-dark' as any]: '#bfa59b',
      }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <title>TrekMate - Your AI Trekking Guide</title>
        <meta name="description" content="Explore the breathtaking beauty of Indian trekking routes with your personal AI-powered virtual guide." />
        {/* Optionally add Tailwind CDN for plugins if needed */}
        {/* <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script> */}
      </head>
      <body
        className={`${inter.variable} antialiased font-sans`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
