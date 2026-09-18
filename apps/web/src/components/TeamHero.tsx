import type { Fixture } from "@football-portal/shared-types";
import { formatMatchDate, initials } from "@/lib/format";

export default function TeamHero({
  teamName,
  lastResult,
  nextFixture,
}: {
  teamName: string;
  lastResult: Fixture | null;
  nextFixture: Fixture | null;
}) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <div className="card" style={{ flex: 2, padding: "28px 32px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 16,
              background: "var(--surface-alt)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            {initials(teamName)}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>{teamName}</div>
        </div>
        <div style={{ height: 1, background: "var(--border)" }} />
        {lastResult ? (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "var(--text-faint)", marginBottom: 8 }}>
              LAST RESULT · {lastResult.status}
            </div>
            <div className="mono" style={{ fontSize: 26, fontWeight: 800 }}>
              {lastResult.home.team.name} <span style={{ color: "var(--accent)" }}>{lastResult.home.goals ?? "-"}</span> —{" "}
              <span style={{ color: "var(--text-dim)" }}>{lastResult.away.goals ?? "-"}</span> {lastResult.away.team.name}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 6 }}>
              {formatMatchDate(lastResult.date)} {lastResult.venue ? `· ${lastResult.venue}` : ""}
            </div>
          </div>
        ) : (
          <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No recent results.</div>
        )}
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
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              vs {nextFixture.home.team.name === teamName ? nextFixture.away.team.name : nextFixture.home.team.name}
            </div>
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
