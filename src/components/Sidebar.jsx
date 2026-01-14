"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Model Metrics", href: "/metrics" },
  { name: "Predict Attack", href: "/predict" },
  { name: "Correlation Heatmap", href: "/heatmap" },
  { name: "Features", href: "/feature" }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-black text-white p-6 border-r border-gray-800 flex flex-col shadow-2xl relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-teal-400"></div>

      <Link href="/" className="block mb-12 group">
        <h3 className="text-3xl font-bold tracking-wide font-space bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:from-indigo-400 group-hover:to-teal-400 transition-all duration-300">
          SyntriX
        </h3>
      </Link>
      
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <div key={link.href}>
              <Link
                href={link.href}
                className={`group flex items-center py-3 px-4 rounded-xl transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 translate-x-1"
                    : "text-gray-400 hover:bg-gray-900 hover:text-white hover:translate-x-1"
                }`}
              >
                {/* Optional: Add icons here if available later */}
                <span className={`font-medium tracking-wide ${isActive ? 'font-semibold' : ''}`}>
                  {link.name}
                </span>
                
                {/* Active Indicator Dot */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                )}
              </Link>
            </div>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-gray-900">
        <p className="text-xs text-gray-600 font-mono text-center">v2.0.0 Stable</p>
      </div>
    </aside>
  );
}
