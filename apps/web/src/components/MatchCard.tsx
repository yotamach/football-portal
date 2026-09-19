"use client";

import { useEffect, useRef, useState } from "react";
import type { Fixture } from "@football-portal/shared-types";
import { formatMatchDate } from "@/lib/format";
import TeamBadge from "./TeamBadge";

const STATUS_LABEL: Record<Fixture["status"], string> = {
  SCHEDULED: "Upcoming",
  LIVE: "LIVE",
  HALFTIME: "HT",
  FINISHED: "FT",
  POSTPONED: "Postponed",
  CANCELLED: "Cancelled",
};

const GOAL_HIGHLIGHT_MS = 60_000;

function RedCards({ count }: { count?: number }) {
  if (!count) return null;
  return (
    <span
      title={`${count} red card${count > 1 ? "s" : ""}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 700, color: "var(--danger)" }}
    >
      <span style={{ width: 9, height: 13, borderRadius: 2, background: "var(--danger)", display: "inline-block" }} />
      {count > 1 && count}
    </span>
  );
}

export default function MatchCard({ fixture }: { fixture: Fixture }) {
  const isLive = fixture.status === "LIVE" || fixture.status === "HALFTIME";

  // Highlight the card for a minute after a goal lands while it's on screen.
  const totalGoals = (fixture.home.goals ?? 0) + (fixture.away.goals ?? 0);
  const prevGoals = useRef(totalGoals);
  const [goalHighlight, setGoalHighlight] = useState(false);
  useEffect(() => {
    if (totalGoals <= prevGoals.current) {
      prevGoals.current = totalGoals;
      return;
    }
    prevGoals.current = totalGoals;
    setGoalHighlight(true);
    const timer = setTimeout(() => setGoalHighlight(false), GOAL_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [totalGoals]);

  return (
    <div
      className="card"
      style={{
        border: goalHighlight ? "1px solid var(--accent)" : undefined,
        boxShadow: goalHighlight ? "0 0 0 2px var(--accent), 0 0 18px rgba(74, 222, 128, 0.35)" : undefined,
        transition: "box-shadow 0.4s, border-color 0.4s",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 12, color: "var(--text-faint)", width: 110, display: "flex", alignItems: "center", gap: 8 }}>
        {fixture.league.countryFlag && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={fixture.league.countryFlag}
            alt={fixture.league.country ?? ""}
            title={fixture.league.country ?? undefined}
            width={20}
            height={14}
            style={{ objectFit: "cover", borderRadius: 2, flexShrink: 0 }}
          />
        )}
        <span>{fixture.league.name}</span>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8, flex: 1 }}>
          <RedCards count={fixture.home.redCards} />
          <span style={{ fontWeight: 700, fontSize: 14, textAlign: "right" }}>{fixture.home.team.name}</span>
          <TeamBadge logo={fixture.home.team.logo} name={fixture.home.team.name} size={24} />
        </span>
        <span className="mono" style={{ fontWeight: 800, fontSize: 18, minWidth: 64, textAlign: "center" }}>
          {fixture.home.goals ?? "-"} : {fixture.away.goals ?? "-"}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <TeamBadge logo={fixture.away.team.logo} name={fixture.away.team.name} size={24} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>{fixture.away.team.name}</span>
          <RedCards count={fixture.away.redCards} />
        </span>
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
