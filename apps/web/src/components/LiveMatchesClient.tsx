"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Fixture } from "@football-portal/shared-types";
import { useLiveFixtures } from "@/lib/socket";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import MatchCard from "./MatchCard";

const MATCHES_PER_PAGE = 10;

export default function LiveMatchesClient({ todayFixtures }: { todayFixtures: Fixture[] }) {
  const { fixtures: liveFixtures, connected } = useLiveFixtures();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Merge live updates into today's fixture list so scores/status stay fresh in place.
  const merged = useMemo(() => {
    const liveById = new Map(liveFixtures.map((f) => [f.id, f]));
    const isPlaying = (f: Fixture) => f.status === "LIVE" || f.status === "HALFTIME";
    // Matches in play float to the top; Array.sort is stable so the rest keep their order.
    return todayFixtures
      .map((f) => liveById.get(f.id) ?? f)
      .sort((a, b) => Number(isPlaying(b)) - Number(isPlaying(a)));
  }, [todayFixtures, liveFixtures]);

  const extraLive = liveFixtures.filter((f) => !todayFixtures.some((t) => t.id === f.id));

  // Competition search: filter both lists by league name or country.
  const needle = query.trim().toLowerCase();
  const matchesQuery = (f: Fixture) =>
    !needle || f.league.name.toLowerCase().includes(needle) || (f.league.country ?? "").toLowerCase().includes(needle);
  const filteredMerged = useMemo(() => merged.filter(matchesQuery), [merged, needle]); // eslint-disable-line react-hooks/exhaustive-deps
  const filteredExtraLive = extraLive.filter(matchesQuery);

  const suggestions = useMemo(() => {
    if (!needle) return [];
    const leagues = new Map<number, { league: Fixture["league"]; count: number }>();
    for (const f of [...merged, ...extraLive]) {
      const entry = leagues.get(f.league.id);
      if (entry) entry.count += 1;
      else leagues.set(f.league.id, { league: f.league, count: 1 });
    }
    return Array.from(leagues.values())
      .filter(({ league }) => league.name.toLowerCase().includes(needle) || (league.country ?? "").toLowerCase().includes(needle))
      .sort((a, b) => Number(b.league.name.toLowerCase().startsWith(needle)) - Number(a.league.name.toLowerCase().startsWith(needle)))
      .slice(0, 8);
  }, [merged, extraLive, needle]);

  const [visibleCount, setVisibleCount] = useState(MATCHES_PER_PAGE);
  useEffect(() => setVisibleCount(MATCHES_PER_PAGE), [needle]);
  const hasMoreMatches = visibleCount < filteredMerged.length;
  const sentinelRef = useInfiniteScroll(
    () => setVisibleCount((c) => Math.min(c + MATCHES_PER_PAGE, filteredMerged.length)),
    hasMoreMatches,
  );

  function choose(name: string) {
    setQuery(name);
    setOpen(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "32px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Matches Around the World</h1>
        <span style={{ fontSize: 12, color: connected ? "var(--accent)" : "var(--text-faint)" }}>
          {connected ? "● Live" : "○ Connecting…"}
        </span>
      </div>

      <div ref={containerRef} style={{ position: "relative", maxWidth: 420 }}>
        <input
          type="text"
          placeholder="Search by league or competition…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions[0]) choose(suggestions[0].league.name);
            if (e.key === "Escape") setOpen(false);
          }}
          style={{ width: "100%" }}
        />
        {open && suggestions.length > 0 && (
          <div
            className="card"
            style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 6, maxHeight: 320, overflowY: "auto", zIndex: 10 }}
          >
            {suggestions.map(({ league, count }) => (
              <button
                key={league.id}
                onClick={() => choose(league.name)}
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
                {league.countryFlag ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={league.countryFlag} alt="" width={24} height={16} style={{ objectFit: "cover", borderRadius: 2 }} />
                ) : (
                  <span style={{ width: 24 }} />
                )}
                <span style={{ fontWeight: 600, fontSize: 14 }}>{league.name}</span>
                {league.country && <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{league.country}</span>}
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-faint)" }}>{count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Live now</h2>
        {filteredExtraLive.length === 0 && (needle ? true : liveFixtures.length === 0) && (
          <div style={{ color: "var(--text-faint)" }}>No matches currently live.</div>
        )}
        {filteredExtraLive.map((f) => (
          <MatchCard key={f.id} fixture={f} />
        ))}
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700 }}>Today&apos;s matches</h2>
        {filteredMerged.length === 0 && (
          <div style={{ color: "var(--text-faint)" }}>
            {needle ? "No matches found for this competition." : "No matches scheduled today."}
          </div>
        )}
        {filteredMerged.slice(0, visibleCount).map((f) => (
          <MatchCard key={f.id} fixture={f} />
        ))}
        {hasMoreMatches && <div ref={sentinelRef} style={{ height: 1 }} />}
      </section>
    </div>
  );
}
