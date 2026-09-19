import Link from "next/link";
import type { Fixture, League, Standing } from "@football-portal/shared-types";
import { apiFetch, apiFetchOrNull } from "@/lib/api";
import StandingsTable from "@/components/StandingsTable";
import SeasonSelect from "@/components/SeasonSelect";
import MatchCard from "@/components/MatchCard";

export default async function LeagueDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { season?: string };
}) {
  const leagueId = params.id;
  const leagues = await apiFetch<League[]>("/leagues", { revalidate: 3600 });
  const league = leagues.find((l) => String(l.id) === leagueId) ?? null;
  const season = searchParams.season ? parseInt(searchParams.season, 10) : league?.season ?? new Date().getFullYear();

  const [standing, recentFixtures] = await Promise.all([
    apiFetchOrNull<Standing>(`/leagues/${leagueId}/standings?season=${season}`, { revalidate: 300 }),
    apiFetch<Fixture[]>(`/leagues/${leagueId}/fixtures?season=${season}`, { revalidate: 300 }),
  ]);

  return (
    <main style={{ padding: "32px 48px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <Link href="/leagues" style={{ fontSize: 13, color: "var(--text-faint)" }}>
            ← All leagues
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "6px 0 0" }}>{league?.name ?? "League"}</h1>
        </div>
        {league && <SeasonSelect leagueId={league.id} seasons={league.seasons} selected={season} />}
      </div>

      {standing ? (
        <StandingsTable standing={standing} />
      ) : (
        <div className="card" style={{ padding: 24, color: "var(--text-faint)" }}>
          No standings available for this league/season.
        </div>
      )}

      <div className="card" style={{ padding: "24px 28px" }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Recent Matches</div>
        {recentFixtures.length === 0 ? (
          <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No recent matches for this season.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentFixtures.map((fixture) => (
              <MatchCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
