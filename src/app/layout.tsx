import type { Metadata } from "next";
import { Archivo, Rubik } from "next/font/google";
import { Providers } from "@/app/providers";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LocalHomeFix — Find reviewed local home service pros",
    template: "%s · LocalHomeFix",
  },
  description:
    "Browse reviewed local pros free, post a home repair request, compare quotes in one place, and pay the professional directly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${archivo.variable} ${rubik.variable} h-full`}>
      <body className="min-h-full bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
