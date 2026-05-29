import { CheckCircle2, Circle } from "lucide-react";

interface PastWeekRowProps {
  weekNumber: number;
  title: string;
  status: { skill: boolean; fitness: boolean; videoBonus: boolean };
}

export default function PastWeekRow({ weekNumber, title, status }: PastWeekRowProps) {
  return (
    <div className="flex items-center justify-between w-full py-1">
      <div className="flex items-center gap-3">
        <span className="text-warmwhite/55 text-sm font-semibold min-w-[60px]">
          Week {weekNumber}
        </span>
        <span className="text-warmwhite/70 text-sm truncate">{title}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 mr-2">
        {status.skill ? (
          <CheckCircle2 className="w-4 h-4 text-risegreen" />
        ) : (
          <Circle className="w-4 h-4 text-warmwhite/30" />
        )}
        {status.fitness ? (
          <CheckCircle2 className="w-4 h-4 text-risegreen" />
        ) : (
          <Circle className="w-4 h-4 text-warmwhite/30" />
        )}
        {status.videoBonus ? (
          <CheckCircle2 className="w-4 h-4 text-risegreen" />
        ) : (
          <Circle className="w-4 h-4 text-warmwhite/30" />
        )}
      </div>
    </div>
  );
}
