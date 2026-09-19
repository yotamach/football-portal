import type { Fixture } from "@football-portal/shared-types";
import { formatMatchDate } from "@/lib/format";
import TeamBadge from "./TeamBadge";

export default function TeamHero({
  teamName,
  teamLogo,
  nextFixture,
}: {
  teamName: string;
  teamLogo: string | null;
  nextFixture: Fixture | null;
}) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div className="card" style={{ flex: 2, padding: "28px 32px", display: "flex", alignItems: "center", gap: 18 }}>
        <TeamBadge logo={teamLogo} name={teamName} size={60} radius={16} />
        <div style={{ fontSize: 28, fontWeight: 800 }}>{teamName}</div>
      </div>

      <div
        className="card"
        style={{
          flex: 1,
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {nextFixture ? (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--accent)", marginBottom: 12 }}>
              NEXT MATCH
            </div>
            {(() => {
              const opponent =
                nextFixture.home.team.name === teamName ? nextFixture.away.team : nextFixture.home.team;
              return (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <TeamBadge logo={opponent.logo} name={opponent.name} size={32} />
                  <div style={{ fontSize: 20, fontWeight: 800 }}>vs {opponent.name}</div>
                </div>
              );
            })()}
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6 }}>
              {formatMatchDate(nextFixture.date)} {nextFixture.venue ? `· ${nextFixture.venue}` : ""}
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No upcoming fixtures scheduled.</div>
        )}
      </div>
    </div>
  );
}
