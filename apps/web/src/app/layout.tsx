import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import DemoBanner from "@/components/DemoBanner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football Portal",
  description: "Your favorite team, live scores, standings and transfers in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Navbar />
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
            <DemoBanner />
            <div style={{ flex: 1 }}>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
