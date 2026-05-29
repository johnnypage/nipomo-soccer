import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import * as Tabs from "@radix-ui/react-tabs";
import { Trophy } from "lucide-react";
import LeaderboardHero from "@/components/challenge/LeaderboardHero";
import PodiumCard from "@/components/challenge/PodiumCard";
import PlayerRow from "@/components/challenge/PlayerRow";
import type { Challenge } from "@shared/schema";

interface LeaderboardEntry {
  rank: number;
  kidId: string;
  displayName: string;
  ageTrack: string;
  totalPoints: number;
  isRegistered: boolean;
  currentStreak: number;
  badgeCount: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  stats: {
    totalSubmissions: number;
    totalPlayers: number;
  };
}

const TRACK_TABS = [
  { value: "all", label: "All" },
  { value: "littlekicks", label: "Little Kicks" },
  { value: "starter", label: "Starter" },
  { value: "advanced", label: "Advanced" },
];

function getCurrentWeekNumber(challenges: Challenge[]): number | null {
  const now = new Date();
  for (const c of challenges) {
    if (c.weekStart && c.weekEnd) {
      const start = new Date(c.weekStart);
      const end = new Date(c.weekEnd);
      end.setHours(23, 59, 59, 999);
      if (now >= start && now <= end) return c.weekNumber;
    }
  }
  return null;
}

export default function Leaderboard() {
  const [activeTrack, setActiveTrack] = useState("all");

  const { data: leaderboardData, isLoading } = useQuery<LeaderboardResponse>({
    queryKey: ["/api/leaderboard"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const { data: challengesData } = useQuery<{ challenges: Challenge[] }>({
    queryKey: ["/api/challenges"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const allChallenges = challengesData?.challenges ?? [];
  const currentWeek = getCurrentWeekNumber(allChallenges);
  const currentWeekTitle =
    allChallenges.find(
      (c) =>
        c.weekNumber === currentWeek &&
        c.type === "skill" &&
        c.ageTrack === "starter",
    )?.title ?? "";

  const entries = leaderboardData?.leaderboard ?? [];
  const stats = leaderboardData?.stats ?? {
    totalSubmissions: 0,
    totalPlayers: 0,
  };

  // Client-side filtering per D-10
  const filtered =
    activeTrack === "all"
      ? entries
      : entries.filter((e) => e.ageTrack === activeTrack);

  // Re-rank after filtering
  const ranked = filtered.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night">
      <Header />

      <LeaderboardHero
        currentWeek={currentWeek}
        weekTitle={currentWeekTitle}
        totalSubmissions={stats.totalSubmissions}
        totalPlayers={stats.totalPlayers}
      />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-8">
        {/* Age track filter tabs (D-10) */}
        <Tabs.Root value={activeTrack} onValueChange={setActiveTrack}>
          <Tabs.List className="flex gap-2 mb-6 overflow-x-auto">
            {TRACK_TABS.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors border ${
                  activeTrack === tab.value
                    ? "bg-charcoal text-warmwhite border-charcoal"
                    : "bg-warmwhite/5 text-warmwhite/55 border-warmwhite/12 hover:border-crimson hover:text-crimson"
                }`}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>

        {ranked.length === 0 ? (
          /* Empty state */
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gold/40 mx-auto mb-4" />
            <h2 className="text-warmwhite text-xl font-bold mb-2">
              No players yet
            </h2>
            <p className="text-warmwhite/55 text-sm">
              Be the first on the leaderboard! Submit a challenge video to start
              earning points.
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-warmwhite text-xl font-bold mb-4">
              Top Players
            </h2>

            {/* Podium: top 3 (D-11) */}
            {podium.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {podium.map((entry) => (
                  <PodiumCard
                    key={entry.kidId}
                    rank={entry.rank}
                    kidId={entry.kidId}
                    displayName={entry.displayName}
                    ageTrack={entry.ageTrack}
                    totalPoints={entry.totalPoints}
                    isRegistered={entry.isRegistered}
                    currentStreak={entry.currentStreak}
                    badgeCount={entry.badgeCount}
                  />
                ))}
              </div>
            )}

            {/* Player rows: rank 4+ (D-12) */}
            {rest.length > 0 && (
              <div className="space-y-2">
                {rest.map((entry, index) => (
                  <PlayerRow
                    key={entry.kidId}
                    rank={entry.rank}
                    kidId={entry.kidId}
                    displayName={entry.displayName}
                    ageTrack={entry.ageTrack}
                    totalPoints={entry.totalPoints}
                    isRegistered={entry.isRegistered}
                    index={index}
                    currentStreak={entry.currentStreak}
                    badgeCount={entry.badgeCount}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
