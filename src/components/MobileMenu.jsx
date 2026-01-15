"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import "./MobileMenu.css";

const links = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Model Metrics", href: "/metrics" },
  { name: "Predict Attack", href: "/predict" },
  { name: "Correlation Heatmap", href: "/heatmap" },
  { name: "Features", href: "/feature" }
];

export default function MobileMenu({ open, onClose }) {
  const menuRef = useRef(null);
  const itemsRef = useRef([]);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!menuRef.current) return;

    // 🔑 INITIAL SET — ONLY ONCE
    if (!tlRef.current) {
      gsap.set(menuRef.current, {
        y: "-100%",
        pointerEvents: "none",
      });

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      tl.to(menuRef.current, {
        y: "0%",
        duration: 0.6,
      }).from(
        itemsRef.current,
        {
          y: -20,
          opacity: 0,
          stagger: 0.08,
          duration: 0.4,
        },
        "-=0.3"
      );

      tl.eventCallback("onComplete", () =>
        gsap.set(menuRef.current, { pointerEvents: "auto" })
      );

      tl.eventCallback("onReverseComplete", () =>
        gsap.set(menuRef.current, { pointerEvents: "none" })
      );

      tlRef.current = tl;
    }

    // ▶️ CONTROL PLAY / REVERSE
    if (open) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
  }, [open]);

  return (
    <div className="mobile-menu" ref={menuRef}>
      <button className="close-btn" onClick={onClose}>✕</button>

      <nav className="mobile-nav">
        {links.map((link, i) => (
          <Link
            key={link.name}
            href={link.href}
            ref={(el) => (itemsRef.current[i] = el)}
            onClick={onClose}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
