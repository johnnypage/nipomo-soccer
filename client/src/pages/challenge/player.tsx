import { useParams, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { ArrowLeft, Trophy, Calendar } from "lucide-react";
import { STREAK_BADGES, ACHIEVEMENT_BADGES } from "@/lib/badges";
import BadgeIcon from "@/components/challenge/BadgeIcon";
import StreakBadge from "@/components/challenge/StreakBadge";
import { motion } from "framer-motion";

const AGE_TRACK_LABELS: Record<string, string> = {
  littlekicks: "Little Kicks",
  starter: "Starter",
  advanced: "Advanced",
};

interface PlayerProfileResponse {
  kid: {
    id: string;
    displayName: string;
    ageTrack: string;
    isRegistered: boolean;
  };
  totalPoints: number;
  currentStreak: number;
  maxStreak: number;
  badges: string[];
  allBadges: { id: string; earned: boolean }[];
  history: {
    date: string;
    challengeTitle: string;
    type: string;
    weekNumber: number;
  }[];
}

export default function PlayerProfile() {
  const { id } = useParams<{ id: string }>();

  const { data: profile, isLoading } = useQuery<PlayerProfileResponse>({
    queryKey: ["/api/player", id],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!id,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-night">
        <Header />
        <main className="max-w-2xl mx-auto px-4 pt-28 pb-8 text-center">
          <Trophy className="w-12 h-12 text-gold/40 mx-auto mb-4" />
          <h1 className="text-warmwhite text-xl font-bold mb-2">Player not found</h1>
          <p className="text-warmwhite/55 text-sm mb-6">This player profile doesn't exist.</p>
          <Link href="/challenge/leaderboard">
            <span className="text-crimson font-semibold text-sm hover:underline cursor-pointer">Back to Leaderboard</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const { kid, totalPoints, currentStreak, maxStreak, allBadges, history } = profile;

  // Build badge display data: show all badges, highlight earned ones
  const allBadgeDisplay = [
    ...STREAK_BADGES.map(b => ({
      ...b,
      earned: allBadges.find(ab => ab.id === b.id)?.earned ?? false,
    })),
    ...ACHIEVEMENT_BADGES.map(b => ({
      ...b,
      earned: allBadges.find(ab => ab.id === b.id)?.earned ?? false,
    })),
  ];

  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-28 pb-8">
        {/* Back link */}
        <Link href="/challenge/leaderboard">
          <span className="inline-flex items-center gap-1 text-warmwhite/55 text-sm hover:text-crimson transition-colors cursor-pointer mb-6">
            <ArrowLeft className="w-4 h-4" />
            Leaderboard
          </span>
        </Link>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6 mb-6"
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-crimson flex items-center justify-center shrink-0">
              <span className="text-warmwhite font-bold text-xl">
                {kid.displayName.split(" ").map(p => p[0]).join("").toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-warmwhite font-bold text-xl">{kid.displayName}</h1>
              <p className="text-warmwhite/55 text-sm uppercase tracking-wider">
                {AGE_TRACK_LABELS[kid.ageTrack] ?? kid.ageTrack}
              </p>
              {kid.isRegistered && (
                <span className="inline-block mt-1 bg-crimson text-warmwhite text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                  NSC Player
                </span>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-warmwhite/8">
            <div className="text-center">
              <p className="text-warmwhite font-bold text-2xl">{totalPoints}</p>
              <p className="text-warmwhite/55 text-xs uppercase font-bold">Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <StreakBadge streak={currentStreak} size="md" />
              </div>
              <p className="text-warmwhite/55 text-xs uppercase font-bold mt-1">Current Streak</p>
            </div>
            <div className="text-center">
              <p className="text-warmwhite font-bold text-2xl">{maxStreak}</p>
              <p className="text-warmwhite/55 text-xs uppercase font-bold">Best Streak</p>
            </div>
          </div>
        </motion.div>

        {/* Badges section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6 mb-6"
        >
          <h2 className="text-warmwhite font-bold text-lg mb-4">Badges</h2>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-4">
            {allBadgeDisplay.map((badge, index) => (
              <BadgeIcon
                key={badge.id}
                id={badge.id}
                label={badge.label}
                icon={badge.icon}
                color={badge.color}
                index={index}
                earned={badge.earned}
              />
            ))}
          </div>
        </motion.div>

        {/* Submission history */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6"
        >
          <h2 className="text-warmwhite font-bold text-lg mb-4">Activity</h2>
          {history.length === 0 ? (
            <p className="text-warmwhite/55 text-sm">No submissions yet.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 py-2 border-b border-warmwhite/5 last:border-0">
                  <Calendar className="w-4 h-4 text-warmwhite/40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-warmwhite text-sm truncate">{entry.challengeTitle}</p>
                    <p className="text-warmwhite/40 text-xs">
                      Week {entry.weekNumber} &middot; {entry.type === "skill" ? "Skill" : "Fitness"}
                    </p>
                  </div>
                  <span className="text-warmwhite/40 text-xs shrink-0">
                    {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
