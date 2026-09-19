"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Team } from "@football-portal/shared-types";
import TeamBadge from "./TeamBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export default function TeamAutocomplete({ currentTeamName }: { currentTeamName: string | null }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Team[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/teams/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  async function choose(team: Team) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/favorite-team", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Could not set favorite team");
        return;
      }
      setQuery("");
      setOpen(false);
      router.push("/");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", maxWidth: 420 }}>
      <label style={{ display: "block", fontSize: 13, color: "var(--text-dim)", marginBottom: 8 }}>
        {currentTeamName ? `Current favorite team: ${currentTeamName}` : "Search for your favorite team"}
      </label>
      <input
        type="text"
        placeholder="Search teams…"
        value={query}
        disabled={saving}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        style={{ width: "100%" }}
      />
      {error && <div style={{ color: "var(--danger)", fontSize: 13, marginTop: 8 }}>{error}</div>}

      {open && (loading || results.length > 0) && (
        <div
          className="card"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 6,
            maxHeight: 320,
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {loading && <div style={{ padding: 14, fontSize: 13, color: "var(--text-faint)" }}>Searching…</div>}
          {!loading &&
            results.map((team) => (
              <button
                key={team.id}
                onClick={() => choose(team)}
                disabled={saving}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "10px 14px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  color: "var(--text)",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <TeamBadge logo={team.logo} name={team.name} size={28} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{team.name}</span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
