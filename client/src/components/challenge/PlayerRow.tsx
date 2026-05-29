import { motion } from "framer-motion";
import { Link } from "wouter";
import StreakBadge from "./StreakBadge";

const AGE_TRACK_LABELS: Record<string, string> = {
  littlekicks: "Little Kicks",
  starter: "Starter",
  advanced: "Advanced",
};

const AVATAR_COLORS = [
  "bg-crimson",
  "bg-gold",
  "bg-risegreen",
  "bg-[#1565C0]",
  "bg-[#7B1FA2]",
  "bg-[#5D4037]",
  "bg-[#E65100]",
  "bg-[#00695C]",
];

function getAvatarColor(kidId: string): string {
  let hash = 0;
  for (let i = 0; i < kidId.length; i++) {
    hash = (hash << 5) - hash + kidId.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(displayName: string): string {
  const parts = displayName.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return displayName[0]?.toUpperCase() ?? "?";
}

interface PlayerRowProps {
  rank: number;
  kidId: string;
  displayName: string;
  ageTrack: string;
  totalPoints: number;
  isRegistered: boolean;
  index: number;
  currentStreak: number;
  badgeCount: number;
}

export default function PlayerRow({
  rank,
  kidId,
  displayName,
  ageTrack,
  totalPoints,
  isRegistered,
  index,
  currentStreak,
  badgeCount,
}: PlayerRowProps) {
  return (
    <Link href={`/challenge/player/${kidId}`}>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut", delay: index * 0.03 }}
        className="flex items-center gap-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg px-4 py-3 hover:border-crimson transition-colors cursor-pointer"
      >
        {/* Rank */}
        <span className="text-warmwhite/70 text-sm font-bold min-w-[24px] text-center">
          {rank}
        </span>

        {/* Avatar */}
        <div
          className={`w-10 h-10 rounded-full ${getAvatarColor(kidId)} flex items-center justify-center shrink-0`}
        >
          <span className="text-warmwhite font-bold text-sm">
            {getInitials(displayName)}
          </span>
        </div>

        {/* Name + age track */}
        <div className="flex-1 min-w-0">
          <p className="text-warmwhite font-medium text-sm truncate">
            {displayName}
          </p>
          <p className="text-warmwhite/55 text-xs uppercase tracking-wider">
            {AGE_TRACK_LABELS[ageTrack] ?? ageTrack}
          </p>
        </div>

        {/* Streak + badge count */}
        {(currentStreak > 0 || badgeCount > 0) && (
          <div className="flex items-center gap-2 shrink-0">
            <StreakBadge streak={currentStreak} size="sm" />
            {badgeCount > 0 && (
              <span className="text-gold text-xs font-bold">{badgeCount} badge{badgeCount !== 1 ? "s" : ""}</span>
            )}
          </div>
        )}

        {/* NSC Player badge (LDR-05) */}
        {isRegistered && (
          <span className="bg-crimson text-warmwhite text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0">
            NSC Player
          </span>
        )}

        {/* Points */}
        <div className="text-right shrink-0">
          <p className="text-warmwhite font-bold text-sm">{totalPoints}</p>
          <p className="text-warmwhite/40 text-xs uppercase font-bold">pts</p>
        </div>
      </motion.div>
    </Link>
  );
}
