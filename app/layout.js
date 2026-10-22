import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
const serif = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
export const metadata = { title: "Fornello | Wood-Fired Pizza", description: "Your table is waiting." };
export default function RootLayout({ children }) {
  return (<html lang="en"><body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>{children}</body></html>);
}
