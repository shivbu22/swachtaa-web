import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Swachta — make every report move",
  description:
    "Swachta connects people, proof, and the teams who keep places clean.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
