"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import { FiMenu } from "react-icons/fi";

export default function MainLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="app-container relative">
            <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

            {/* Desktop Sidebar: Hidden on mobile, Flex on medium+ */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            <main className="main-content bg-white w-full">
                {/* Mobile Header with Hamburger */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100 mb-4 bg-white sticky top-0 z-30">
                    <Link href="/" className="font-space font-bold text-lg text-black">SyntriX</Link>
                    <button onClick={() => setMenuOpen(true)} className="text-2xl text-black">
                        <FiMenu />
                    </button>
                </div>

                {children}
            </main>
        </div>
    );
}
