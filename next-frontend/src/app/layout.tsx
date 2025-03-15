import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";


const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans"
});

export const metadata: Metadata = {
  title: "RISD SUITS",
  description: "RISD SUITS - Rover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexSans.variable} font-sans text-white antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
