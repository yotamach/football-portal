"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live Matches" },
  { href: "/leagues", label: "Leagues" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {LINKS.map((link) => {
        const isActive = link.href === "/" ? pathname === "/" : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{
              fontSize: 14,
              fontWeight: isActive ? 700 : 600,
              color: isActive ? "var(--text)" : "var(--text-dim)",
              padding: "10px 14px",
              borderRadius: 8,
              background: isActive ? "var(--surface-alt)" : "transparent",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
