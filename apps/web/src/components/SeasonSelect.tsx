"use client";

import { useRouter } from "next/navigation";

export default function SeasonSelect({ leagueId, seasons, selected }: { leagueId: number; seasons: number[]; selected: number }) {
  const router = useRouter();

  return (
    <select
      value={selected}
      onChange={(e) => router.push(`/leagues/${leagueId}?season=${e.target.value}`)}
      style={{
        height: 38,
        borderRadius: 8,
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text)",
        padding: "0 12px",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      {seasons.map((year) => (
        <option key={year} value={year}>
          {year}/{year + 1}
        </option>
      ))}
    </select>
  );
}
