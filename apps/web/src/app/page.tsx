import Link from "next/link";
import type { Fixture, League, Player, PlayerStatEntry, Standing, Team } from "@football-portal/shared-types";
import { apiFetch, apiFetchOrNull } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import TeamHero from "@/components/TeamHero";
import StandingsTable from "@/components/StandingsTable";
import CompetitionsList from "@/components/CompetitionsList";
import SquadGrid from "@/components/SquadGrid";
import Last5Matches from "@/components/Last5Matches";
import PlayerStatList from "@/components/PlayerStatList";

async function loadDashboard(teamId: number) {
  const [team, nextFixture, leagues, squad, last5] = await Promise.all([
    apiFetchOrNull<Team>(`/teams/${teamId}`, { revalidate: 3600 }),
    apiFetchOrNull<Fixture>(`/teams/${teamId}/next-fixture`, { revalidate: 60 }),
    apiFetch<League[]>(`/teams/${teamId}/leagues`, { revalidate: 3600 }),
    apiFetchOrNull<{ team: Pick<Team, "id" | "name" | "logo">; players: Player[] }>(`/teams/${teamId}/squad`, {
      revalidate: 3600,
    }),
    apiFetch<Fixture[]>(`/teams/${teamId}/last-fixtures?count=5`, { revalidate: 300 }),
  ]);

  const primaryLeague = leagues.find((l) => l.type === "League") ?? leagues[0] ?? null;
  const [standing, topScorers, topAssists] = primaryLeague
    ? await Promise.all([
        apiFetchOrNull<Standing>(`/leagues/${primaryLeague.id}/standings?season=${primaryLeague.season}`, {
          revalidate: 300,
        }),
        apiFetch<PlayerStatEntry[]>(`/leagues/${primaryLeague.id}/top-scorers?season=${primaryLeague.season}`, {
          revalidate: 3600,
        }),
        apiFetch<PlayerStatEntry[]>(`/leagues/${primaryLeague.id}/top-assists?season=${primaryLeague.season}`, {
          revalidate: 3600,
        }),
      ])
    : [null, [], []];

  return { team, nextFixture, leagues, standing, squad, last5, topScorers, topAssists };
}

export default async function HomePage() {
  const user = await getCurrentUser();
  const teamId = user?.favoriteTeamId;

  if (user && !teamId) {
    return (
      <main className="container" style={{ padding: "64px 48px" }}>
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Welcome, {user.displayName}</h1>
          <p style={{ color: "var(--text-dim)", marginBottom: 24 }}>
            Pick a favorite team to build your personalized dashboard.
          </p>
          <Link href="/settings" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
            Choose your team
          </Link>
        </div>
      </main>
    );
  }

  if (!teamId) {
    // Guest: show a sign-in prompt plus a preview dashboard using the app's default demo team.
    const meta = await apiFetchOrNull<{ defaultFavoriteTeamId: number }>("/meta", { revalidate: 300 });
    const previewTeamId = meta?.defaultFavoriteTeamId ?? 101;
    const data = await loadDashboard(previewTeamId);

    return (
      <main style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px 48px" }}>
        <div className="card" style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>This is a preview dashboard</div>
            <div style={{ color: "var(--text-dim)", fontSize: 13 }}>Sign in and pick your team to make this yours.</div>
          </div>
          <Link href="/register" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
            Get started
          </Link>
        </div>
        <Dashboard {...data} highlightTeamId={previewTeamId} />
      </main>
    );
  }

  const data = await loadDashboard(teamId);
  return (
    <main style={{ display: "flex", flexDirection: "column", gap: 24, padding: "32px 48px" }}>
      <Dashboard {...data} highlightTeamId={teamId} />
    </main>
  );
}

function Dashboard({
  team,
  nextFixture,
  leagues,
  standing,
  squad,
  last5,
  topScorers,
  topAssists,
  highlightTeamId,
}: Awaited<ReturnType<typeof loadDashboard>> & { highlightTeamId: number }) {
  return (
    <>
      <TeamHero teamName={team?.name ?? "Your team"} teamLogo={team?.logo ?? null} nextFixture={nextFixture} />

      {squad && <SquadGrid players={squad.players} />}

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: 2 }}>
          {standing ? (
            <StandingsTable standing={standing} highlightTeamId={highlightTeamId} />
          ) : (
            <div className="card" style={{ padding: 24, color: "var(--text-faint)" }}>
              Standings unavailable for this team&apos;s competition.
            </div>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <CompetitionsList leagues={leagues} />
        </div>
      </div>

      <Last5Matches fixtures={last5} />

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <PlayerStatList title="Top Scorers" unitLabel="goals" entries={topScorers} />
        </div>
        <div style={{ flex: 1 }}>
          <PlayerStatList title="Top Assists" unitLabel="assists" entries={topAssists} />
        </div>
      </div>
    </>
  );
}
