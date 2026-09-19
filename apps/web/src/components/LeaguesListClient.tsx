"use client";

import { useMemo, useState } from "react";
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

  const countries = useMemo(() => Array.from(byCountry.keys()).sort(), [byCountry]);
  const [visibleCount, setVisibleCount] = useState(COUNTRIES_PER_PAGE);
  const hasMore = visibleCount < countries.length;
  const sentinelRef = useInfiniteScroll(
    () => setVisibleCount((c) => Math.min(c + COUNTRIES_PER_PAGE, countries.length)),
    hasMore,
  );

  if (countries.length === 0) {
    return <div style={{ color: "var(--text-faint)" }}>No competitions found.</div>;
  }

  return (
    <>
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
