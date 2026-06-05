export interface BadgeDefinition {
  id: string;
  threshold: number;
  label: string;
  icon: string;
  color: string;
}

export interface AchievementDefinition {
  id: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const STREAK_BADGES: BadgeDefinition[] = [
  { id: "streak-3", threshold: 3, label: "3-Day Streak", icon: "Flame", color: "text-orange-400" },
  { id: "streak-7", threshold: 7, label: "7-Day Streak", icon: "Flame", color: "text-orange-500" },
  { id: "streak-14", threshold: 14, label: "14-Day Streak", icon: "Flame", color: "text-red-500" },
  { id: "streak-21", threshold: 21, label: "21-Day Streak", icon: "Flame", color: "text-red-600" },
] as const;

export const ACHIEVEMENT_BADGES: AchievementDefinition[] = [
  { id: "perfect-week", label: "Perfect Week", icon: "Star", color: "text-gold", description: "Earned max points in a single week (15 pts)" },
  { id: "fitness-allstar", label: "Fitness All-Star", icon: "Award", color: "text-green-400", description: "Completed all 8 fitness bonuses" },
  { id: "summer-champion", label: "Summer Champion", icon: "Crown", color: "text-gold", description: "Submitted every week for all 8 weeks" },
] as const;

export const ALL_BADGES = [
  ...STREAK_BADGES.map(b => ({ ...b, type: "streak" as const })),
  ...ACHIEVEMENT_BADGES.map(b => ({ ...b, type: "achievement" as const, threshold: 0 })),
] as const;

export function getBadgeById(id: string): (BadgeDefinition | AchievementDefinition) | undefined {
  return [...STREAK_BADGES, ...ACHIEVEMENT_BADGES].find(b => b.id === id);
}
