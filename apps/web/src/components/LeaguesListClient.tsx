"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { League } from "@football-portal/shared-types";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";

const COUNTRIES_PER_PAGE = 6;

export default function LeaguesListClient({ leagues }: { leagues: League[] }) {
  const byCountry = useMemo(() => {
    const map = new Map<string, League[]>();
    for (const league of leagues) {
      const key = league.country.name;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(league);
    }
    return map;
  }, [leagues]);

  const allCountries = useMemo(() => Array.from(byCountry.keys()).sort(), [byCountry]);
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

  const needle = query.trim().toLowerCase();
  // Countries that start with the query rank ahead of ones that merely contain it.
  const countries = useMemo(() => {
    if (!needle) return allCountries;
    const matches = allCountries.filter((c) => c.toLowerCase().includes(needle));
    const starts = matches.filter((c) => c.toLowerCase().startsWith(needle));
    return [...starts, ...matches.filter((c) => !starts.includes(c))];
  }, [allCountries, needle]);
  const suggestions = countries.slice(0, 8);

  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);
  useEffect(() => setVisibleCount(COUNTRIES_PER_PAGE), [needle]);
  const hasMore = visibleCount < countries.length;
  const sentinelRef = useInfiniteScroll(
    () => setVisibleCount((c) => Math.min(c + COUNTRIES_PER_PAGE, countries.length)),
    hasMore,
  );

  function choose(country: string) {
    setQuery(country);
    setOpen(false);
  }

  return (
    <>
      <div ref={containerRef} style={{ position: "relative", maxWidth: 420 }}>
        <input
          type="text"
          placeholder="Search by country…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && suggestions[0]) choose(suggestions[0]);
            if (e.key === "Escape") setOpen(false);
          }}
          style={{ width: "100%" }}
        />
        {open && needle && suggestions.length > 0 && (
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
            {suggestions.map((country) => {
              const flag = byCountry.get(country)![0].country.flag;
              return (
                <button
                  key={country}
                  onClick={() => choose(country)}
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
                  {flag ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={flag} alt="" width={24} height={16} style={{ objectFit: "cover", borderRadius: 2 }} />
                  ) : (
                    <span style={{ width: 24 }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{country}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-faint)" }}>
                    {byCountry.get(country)!.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {countries.length === 0 && <div style={{ color: "var(--text-faint)" }}>No competitions found.</div>}
      {countries.slice(0, visibleCount).map((country) => (
        <section key={country}>
          <h2
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-faint)",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            {country}
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
            {byCountry.get(country)!.map((league) => (
              <Link
                key={league.id}
                href={`/leagues/${league.id}?season=${league.season}`}
                className="card"
                style={{ padding: 20, display: "flex", flexDirection: "column", gap: 6 }}
              >
                <span style={{ fontWeight: 700, fontSize: 15 }}>{league.name}</span>
                <span className="pill" style={{ width: "fit-content", background: "#1e293b", color: "#93c5fd" }}>
                  {league.type}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
    </>
  );
}
