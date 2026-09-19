import type { League } from "@football-portal/shared-types";
import { apiFetch } from "@/lib/api";
import LeaguesListClient from "@/components/LeaguesListClient";

export default async function LeaguesPage() {
  const leagues = await apiFetch<League[]>("/leagues", { revalidate: 3600 });

  return (
    <main style={{ padding: "32px 48px", display: "flex", flexDirection: "column", gap: 28 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Leagues Around the World</h1>
      <LeaguesListClient leagues={leagues} />
    </main>
  );
}
