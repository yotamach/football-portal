import type { Fixture, League, Team } from "@football-portal/shared-types";

/**
 * API-Football's /leagues and /teams responses mix senior competitions with
 * youth and reserve sides (U17–U23 age-group leagues, national youth teams,
 * "Club B"/"Club II" reserve squads). The portal only wants senior football,
 * so these filters drop anything whose name flags it as youth or reserve
 * before it reaches the UI.
 */
const YOUTH_AGE_PATTERN = /\bU-?1[4-9]\b|\bU-?2[0-3]\b/i;
const YOUTH_KEYWORD_PATTERN = /\b(youth|junior|juniors|primavera|academy)\b/i;
const RESERVE_TEAM_PATTERN = /\b(reserves?|ii|iii)\b|\sB$/i;

export function isAdultCompetitionName(name: string): boolean {
  return !YOUTH_AGE_PATTERN.test(name) && !YOUTH_KEYWORD_PATTERN.test(name);
}

export function isAdultTeamName(name: string): boolean {
  return (
    !YOUTH_AGE_PATTERN.test(name) && !YOUTH_KEYWORD_PATTERN.test(name) && !RESERVE_TEAM_PATTERN.test(name)
  );
}

export function isAdultLeague(league: League): boolean {
  return isAdultCompetitionName(league.name);
}

export function isAdultTeam(team: Team): boolean {
  return isAdultTeamName(team.name);
}

export function isAdultFixture(fixture: Fixture): boolean {
  return (
    isAdultCompetitionName(fixture.league.name) &&
    isAdultTeamName(fixture.home.team.name) &&
    isAdultTeamName(fixture.away.team.name)
  );
}
