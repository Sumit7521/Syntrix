import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "SyntriX | AI Security",
  description: "Advanced model metrics and attack prediction dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased text-gray-800 bg-white`}>
        <div className="app-container">
          <Sidebar />
          <main className="main-content bg-white">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

