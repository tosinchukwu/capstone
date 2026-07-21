import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MEDCRUSH Blockchain Hospital",
  description: "Book consultations with doctors securely on-chain.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' rx='30' fill='%230d9488'/%3E%3Ctext x='100' y='85' font-size='28' text-anchor='middle' fill='white' font-family='Arial, sans-serif' font-weight='bold'%3EMEDCRUSH%3C/text%3E%3Ctext x='100' y='125' font-size='14' text-anchor='middle' fill='%23e5e7eb' font-family='Arial, sans-serif'%3EBLOCKCHAIN%20HOSPITAL%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}