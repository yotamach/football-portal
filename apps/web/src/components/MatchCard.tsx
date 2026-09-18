import type { Fixture } from "@football-portal/shared-types";
import { formatMatchDate } from "@/lib/format";

const STATUS_LABEL: Record<Fixture["status"], string> = {
  SCHEDULED: "Upcoming",
  LIVE: "LIVE",
  HALFTIME: "HT",
  FINISHED: "FT",
  POSTPONED: "Postponed",
  CANCELLED: "Cancelled",
};

export default function MatchCard({ fixture }: { fixture: Fixture }) {
  const isLive = fixture.status === "LIVE" || fixture.status === "HALFTIME";
  return (
    <div
      className="card"
      style={{
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 11, color: "var(--text-faint)", width: 110 }}>{fixture.league.name}</div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 14, textAlign: "right", flex: 1 }}>{fixture.home.team.name}</span>
        <span className="mono" style={{ fontWeight: 800, fontSize: 18, minWidth: 64, textAlign: "center" }}>
          {fixture.home.goals ?? "-"} : {fixture.away.goals ?? "-"}
        </span>
        <span style={{ fontWeight: 700, fontSize: 14, flex: 1 }}>{fixture.away.team.name}</span>
      </div>

      <div style={{ width: 110, textAlign: "right" }}>
        {isLive ? (
          <span className="pill" style={{ background: "#3a1212", color: "var(--danger)" }}>
            {STATUS_LABEL[fixture.status]} {fixture.elapsedMinutes ? `${fixture.elapsedMinutes}'` : ""}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
            {fixture.status === "SCHEDULED" ? formatMatchDate(fixture.date) : STATUS_LABEL[fixture.status]}
          </span>
        )}
      </div>
    </div>
  );
}
