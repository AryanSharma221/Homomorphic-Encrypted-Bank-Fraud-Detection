import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureBank - Privacy-Preserving Fraud Detection",
  description:
    "Privacy-preserving bank fraud detection using Homomorphic Encryption and Machine Learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#020305]">
          <body className={`${inter.className} min-h-full bg-[#020305]`}>{children}</body>
    </html>
  );
}