import { Trophy } from "lucide-react";

interface LeaderboardHeroProps {
  currentWeek: number | null;
  weekTitle: string;
  totalSubmissions: number;
  totalPlayers: number;
}

export default function LeaderboardHero({
  currentWeek,
  weekTitle,
  totalSubmissions,
  totalPlayers,
}: LeaderboardHeroProps) {
  return (
    <div className="bg-crimson w-full">
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Trophy className="w-4 h-4 text-gold" />
          <span className="text-gold text-xs font-bold uppercase tracking-wider">
            Summer Skills Challenge 2026
          </span>
        </div>
        <h1 className="font-display text-3xl uppercase tracking-wide text-warmwhite mb-2">
          Leaderboard
        </h1>
        {currentWeek && weekTitle && (
          <p className="text-warmwhite/70 text-sm">
            Week {currentWeek} of 8 &middot; {weekTitle}
          </p>
        )}
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="text-center">
            <p className="text-warmwhite font-bold text-xl">{totalSubmissions}</p>
            <p className="text-warmwhite/55 text-xs uppercase font-bold">Submissions</p>
          </div>
          <div className="text-center">
            <p className="text-warmwhite font-bold text-xl">{totalPlayers}</p>
            <p className="text-warmwhite/55 text-xs uppercase font-bold">Players</p>
          </div>
        </div>
      </div>
    </div>
  );
}
