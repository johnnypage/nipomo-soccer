import { useQuery, useQueryClient } from "@tanstack/react-query";

interface SubmissionStatus {
  todaySubmissions: Array<{ type: string; weekNumber: number }>;
  allSubmissions: Array<{ type: string; weekNumber: number }>;
  totalPoints: number;
}

export function useSubmissions(kidId: string | null) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<SubmissionStatus | null>({
    queryKey: ["/api/submissions/status", kidId],
    queryFn: async () => {
      const res = await fetch(`/api/submissions/status?kidId=${kidId}`, {
        credentials: "include",
      });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to load submission status");
      return res.json();
    },
    enabled: !!kidId,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Helper: check if kid has submitted a specific type today
  function hasSubmittedToday(type: "skill" | "fitness"): boolean {
    return data?.todaySubmissions.some((s) => s.type === type) ?? false;
  }

  // Helper: check if video bonus is claimed for a specific week
  function hasVideoBonusForWeek(weekNumber: number): boolean {
    return (
      data?.allSubmissions.some(
        (s) => s.type === "video_bonus" && s.weekNumber === weekNumber
      ) ?? false
    );
  }

  // Helper: get submission types completed for a specific week
  function getWeekSubmissions(weekNumber: number): {
    skill: boolean;
    fitness: boolean;
    videoBonus: boolean;
  } {
    const weekSubs =
      data?.allSubmissions.filter((s) => s.weekNumber === weekNumber) ?? [];
    return {
      skill: weekSubs.some((s) => s.type === "skill"),
      fitness: weekSubs.some((s) => s.type === "fitness"),
      videoBonus: weekSubs.some((s) => s.type === "video_bonus"),
    };
  }

  // Invalidate after mutation (called by SubmitButton and VideoBonusCheckbox)
  async function invalidate() {
    await queryClient.invalidateQueries({
      queryKey: ["/api/submissions/status", kidId],
    });
    await queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
  }

  return {
    todaySubmissions: data?.todaySubmissions ?? [],
    allSubmissions: data?.allSubmissions ?? [],
    totalPoints: data?.totalPoints ?? 0,
    isLoading,
    hasSubmittedToday,
    hasVideoBonusForWeek,
    getWeekSubmissions,
    invalidate,
  };
}
