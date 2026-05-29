import type { Challenge } from "@shared/schema";

const AGE_TRACK_LABELS: Record<string, string> = {
  littlekicks: "Little Kicks",
  starter: "Starter",
  advanced: "Advanced",
};

interface TrackPillProps {
  challenge: Challenge;
  isActive: boolean;
}

export default function TrackPill({ challenge, isActive }: TrackPillProps) {
  return (
    <div
      className={`rounded-lg p-3 ${
        isActive
          ? "bg-crimson/10 border border-crimson/30"
          : "bg-warmwhite/5 border border-warmwhite/8"
      }`}
    >
      <span className="text-xs font-bold uppercase tracking-wider text-crimson">
        {AGE_TRACK_LABELS[challenge.ageTrack] ?? challenge.ageTrack}
      </span>
      <p
        className={`text-sm mt-1 ${
          isActive ? "text-warmwhite/70" : "text-warmwhite/40"
        }`}
      >
        {challenge.description}
      </p>
    </div>
  );
}
