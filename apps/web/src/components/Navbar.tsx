import Link from "next/link";
import type { AuthUser } from "@football-portal/shared-types";
import { getCurrentUser } from "@/lib/auth";
import SidebarNav from "./SidebarNav";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const user: AuthUser | null = await getCurrentUser();

  return (
    <aside
      style={{
        width: 240,
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 16px",
        gap: 32,
      }}
    >
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 8px" }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 2 L21 6.5 V15 L12 22 L3 15 V6.5 Z" fill="var(--accent)" />
        </svg>
        <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: 1 }}>FOOTBALL PORTAL</span>
      </Link>

      <SidebarNav />

      <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {user ? (
          <>
            <Link
              href="/settings"
              style={{ fontSize: 14, fontWeight: 600, color: "var(--text-dim)", padding: "10px 14px" }}
            >
              Settings
            </Link>
            <div style={{ padding: "0 14px", fontSize: 13, color: "var(--text-dim)" }}>{user.displayName}</div>
            <div style={{ padding: "0 8px" }}>
              <LogoutButton />
            </div>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "0 8px" }}>
            <Link href="/login" className="btn-ghost" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              Sign in
            </Link>
            <Link href="/register" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              Create account
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
