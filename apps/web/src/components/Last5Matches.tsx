import type { Fixture } from "@football-portal/shared-types";
import MatchCard from "./MatchCard";

export default function Last5Matches({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div className="card" style={{ padding: "24px 28px" }}>
      <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Last 5 Matches</div>
      {fixtures.length === 0 ? (
        <div style={{ color: "var(--text-faint)", fontSize: 13 }}>No recent matches.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fixtures.map((fixture) => (
            <MatchCard key={fixture.id} fixture={fixture} />
          ))}
        </div>
      )}
    </div>
  );
}
