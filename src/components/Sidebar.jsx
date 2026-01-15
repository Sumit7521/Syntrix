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
    <aside className="w-64 h-screen sticky top-0 bg-black text-white p-6 border-r border-[#333] flex flex-col relative z-20">
      
      <Link href="/" className="block mb-12">
        <h3 className="text-2xl font-bold tracking-tight font-space text-white">
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
                className={`group flex items-center py-2.5 px-4 rounded-md transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black font-semibold"
                    : "text-[#a3a3a3] hover:text-white hover:bg-[#111]"
                }`}
              >
                <span className="text-sm font-medium tracking-wide">
                  {link.name}
                </span>
              </Link>
            </div>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-[#333]">
        <p className="text-[10px] text-[#525252] font-mono text-center uppercase tracking-widest">v2.0.0 Stable</p>
      </div>
    </aside>
  );
}
