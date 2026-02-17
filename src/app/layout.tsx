import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/components/layout/BottomNav";
import { StoreInitializer } from "@/components/providers/StoreInitializer";

import { Sidebar } from "@/components/layout/Sidebar";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  variable: '--font-league-spartan',
});

export const metadata: Metadata = {
  title: "SABAGO Wallet",
  description: "Billetera virtual para jóvenes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${leagueSpartan.className} ${leagueSpartan.variable} bg-eggshell-100 min-h-screen pb-safe`}>
        <StoreInitializer />
        <Sidebar />
        <main className="md:pl-64 min-h-screen relative">
          <div className="max-w-md md:max-w-5xl mx-auto md:p-8 bg-transparent min-h-screen shadow-none overflow-hidden md:overflow-visible">
            {children}
          </div>
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
