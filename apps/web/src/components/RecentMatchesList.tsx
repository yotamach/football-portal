"use client";

import { useState } from "react";
import type { Fixture } from "@football-portal/shared-types";
import { useInfiniteScroll } from "@/lib/useInfiniteScroll";
import MatchCard from "./MatchCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const PAGE_SIZE = 10;

export default function RecentMatchesList({
  leagueId,
  season,
  initialFixtures,
}: {
  leagueId: number;
  season: number;
  initialFixtures: Fixture[];
}) {
  const [fixtures, setFixtures] = useState(initialFixtures);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialFixtures.length === PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(
        `${API_URL}/leagues/${leagueId}/fixtures?season=${season}&count=${PAGE_SIZE}&page=${nextPage}`,
      );
      const data = (await res.json()) as Fixture[];
      setFixtures((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  }

  const sentinelRef = useInfiniteScroll(loadMore, hasMore && !loading);

  if (fixtures.length === 0) {
    return <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No recent matches for this season.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {fixtures.map((fixture) => (
        <MatchCard key={fixture.id} fixture={fixture} />
      ))}
      {hasMore && <div ref={sentinelRef} style={{ height: 1 }} />}
      {loading && (
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-faint)", padding: "8px 0" }}>
          Loading more…
        </div>
      )}
    </div>
  );
}
