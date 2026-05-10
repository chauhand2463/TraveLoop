import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import PageWrapper from "@/components/PageWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Traveloop — Plan Your Dream Journey",
  description: "Create customized multi-city itineraries, manage budgets, discover activities, and share your travel plans with friends.",
  keywords: ["travel", "itinerary", "planner", "trip", "budget", "vacation"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${display.variable} bg-bg antialiased selection:bg-accent-lime/30 selection:text-white`}>
        <Providers>
          <PageWrapper>{children}</PageWrapper>
        </Providers>
      </body>
    </html>
  );
}
