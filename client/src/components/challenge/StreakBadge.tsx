import { Flame } from "lucide-react";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md";
}

export default function StreakBadge({ streak, size = "sm" }: StreakBadgeProps) {
  if (streak === 0) return null;

  const sizeClasses = size === "sm"
    ? "text-xs gap-0.5"
    : "text-sm gap-1";

  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  // Color intensifies with streak length
  const color = streak >= 14
    ? "text-red-500"
    : streak >= 7
    ? "text-orange-500"
    : "text-orange-400";

  return (
    <span className={`inline-flex items-center ${sizeClasses} ${color} font-bold`}>
      <Flame className={iconSize} />
      {streak}
    </span>
  );
}
