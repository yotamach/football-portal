import type { PlayerStatEntry } from "@football-portal/shared-types";
import TeamBadge from "./TeamBadge";

export default function PlayerStatList({
  title,
  unitLabel,
  entries,
}: {
  title: string;
  unitLabel: string;
  entries: PlayerStatEntry[];
}) {
  return (
    <div className="card" style={{ padding: "24px 28px" }}>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>{title}</div>
      {entries.length === 0 ? (
        <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No data available.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {entries.map((entry) => (
            <div
              key={entry.player.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 4px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div style={{ width: 20, fontSize: 12, color: "var(--text-faint)", fontWeight: 700 }}>{entry.rank}</div>
              <TeamBadge logo={entry.team.logo} name={entry.team.name} size={28} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{entry.player.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>{entry.team.name}</div>
              </div>
              <div className="mono" style={{ fontWeight: 800, fontSize: 15 }}>
                {entry.value} <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-faint)" }}>{unitLabel}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
