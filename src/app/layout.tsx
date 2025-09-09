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
  title: "FlightFinder - Find Cheapest Flights Instantly",
  description: "Discover the best flight deals with our AI-powered search engine. Compare prices from top airlines and book your perfect trip today.",
  keywords: "cheap flights, flight deals, airline tickets, travel booking, flight comparison",
  authors: [{ name: "FlightFinder" }],
  creator: "FlightFinder",
  publisher: "FlightFinder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://flightfinder.app"),
  openGraph: {
    title: "FlightFinder - Find Cheapest Flights Instantly",
    description: "Discover the best flight deals with our AI-powered search engine",
    url: "https://flightfinder.app",
    siteName: "FlightFinder",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlightFinder - Find Cheapest Flights Instantly",
    description: "Discover the best flight deals with our AI-powered search engine",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
