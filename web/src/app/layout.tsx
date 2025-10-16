import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Taskerra - Task Management Platform",
  description:
    "Organize, prioritize, and accomplish your goals with our intuitive task management platform",
  keywords: [
    "task management",
    "productivity",
    "organization",
    "goals",
    "planning",
  ],
  authors: [{ name: "pedroaba <pedr.augustobarbosa.aparecido@gmail.com>" }],
  creator: "pedroaba",
  publisher: "pedroaba",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Taskerra - Task Management Platform",
    description:
      "Organize, prioritize, and accomplish your goals with our intuitive task management platform",
    type: "website",
    locale: "en_US",
    siteName: "Taskerra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Taskerra - Task Management Platform",
    description:
      "Organize, prioritize, and accomplish your goals with our intuitive task management platform",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="en">
      <body className="flex min-h-screen flex-col bg-background">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
