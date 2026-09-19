import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import TeamAutocomplete from "@/components/TeamAutocomplete";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main style={{ padding: "48px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Settings</h1>
        <p style={{ color: "var(--text-dim)" }}>Choose your favorite team to personalize your home page.</p>
      </div>
      <div className="card" style={{ padding: 28 }}>
        <TeamAutocomplete currentTeamName={user.favoriteTeamName} />
      </div>
    </main>
  );
}
