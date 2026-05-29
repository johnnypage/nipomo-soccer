import { motion } from "framer-motion";

const AGE_TRACK_LABELS: Record<string, string> = {
  littlekicks: "Little Kicks",
  starter: "Starter",
  advanced: "Advanced",
};

interface PodiumCardProps {
  rank: number;
  displayName: string;
  ageTrack: string;
  totalPoints: number;
  isRegistered: boolean;
}

const RANK_CONFIG: Record<
  number,
  { badge: string; badgeBg: string; avatarBg: string; border: string }
> = {
  1: {
    badge: "1ST",
    badgeBg: "bg-gold text-night",
    avatarBg: "bg-gold",
    border: "border-gold",
  },
  2: {
    badge: "2ND",
    badgeBg: "bg-charcoal text-warmwhite",
    avatarBg: "bg-crimson",
    border: "border-warmwhite/12",
  },
  3: {
    badge: "3RD",
    badgeBg: "bg-charcoal text-warmwhite",
    avatarBg: "bg-[#5D4037]",
    border: "border-warmwhite/12",
  },
};

function getInitials(displayName: string): string {
  const parts = displayName.split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return displayName[0]?.toUpperCase() ?? "?";
}

export default function PodiumCard({
  rank,
  displayName,
  ageTrack,
  totalPoints,
  isRegistered,
}: PodiumCardProps) {
  const config = RANK_CONFIG[rank] ?? RANK_CONFIG[3];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1.0 }}
      transition={{ duration: 0.4, type: "spring", delay: (rank - 1) * 0.1 }}
      className={`bg-warmwhite/5 border-2 ${config.border} rounded-lg p-4 text-center relative`}
    >
      {/* Rank badge */}
      <span
        className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded ${config.badgeBg}`}
      >
        {config.badge}
      </span>

      {/* Avatar */}
      <div
        className={`w-14 h-14 rounded-full ${config.avatarBg} flex items-center justify-center mx-auto mb-3`}
      >
        <span className="text-warmwhite font-bold text-lg">
          {getInitials(displayName)}
        </span>
      </div>

      {/* Name */}
      <p className="text-warmwhite font-bold text-sm">{displayName}</p>

      {/* Age track */}
      <p className="text-warmwhite/55 text-xs uppercase tracking-wider mt-0.5">
        {AGE_TRACK_LABELS[ageTrack] ?? ageTrack}
      </p>

      {/* Points */}
      <p className="text-warmwhite font-bold text-xl mt-2">{totalPoints}</p>
      <p className="text-warmwhite/55 text-xs uppercase font-bold">Points</p>

      {/* NSC Player badge (LDR-05) */}
      {isRegistered && (
        <span className="inline-block mt-2 bg-crimson text-warmwhite text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded">
          NSC Player
        </span>
      )}
    </motion.div>
  );
}
