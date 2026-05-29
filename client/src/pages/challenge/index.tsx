import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/use-auth";
import { useActiveKid } from "@/hooks/use-active-kid";
import { useSubmissions } from "@/hooks/use-submissions";
import KidSelector from "@/components/challenge/KidSelector";
import AddKidForm from "@/components/challenge/AddKidForm";
import WeekNavigation from "@/components/challenge/WeekNavigation";
import PointsDisplay from "@/components/challenge/PointsDisplay";
import { Redirect } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import type { Challenge } from "@shared/schema";
import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function getCurrentWeekNumber(challenges: Challenge[]): number | null {
  const now = new Date();
  for (const c of challenges) {
    if (c.weekStart && c.weekEnd) {
      const start = new Date(c.weekStart);
      const end = new Date(c.weekEnd);
      end.setHours(23, 59, 59, 999);
      if (now >= start && now <= end) {
        return c.weekNumber;
      }
    }
  }
  return null;
}

export default function ChallengeHub() {
  const { isAuthenticated, isLoading, kids } = useAuth();
  const { activeKid } = useActiveKid();
  const [addKidOpen, setAddKidOpen] = useState(false);

  const { data: challengesData } = useQuery<{ challenges: Challenge[] }>({
    queryKey: ["/api/challenges"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: isAuthenticated,
  });

  const {
    totalPoints,
    hasSubmittedToday,
    hasVideoBonusForWeek,
    getWeekSubmissions,
    invalidate,
  } = useSubmissions(activeKid?.id ?? null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/challenge/signup" />;
  }

  const allChallenges = challengesData?.challenges ?? [];
  const currentWeek = getCurrentWeekNumber(allChallenges);

  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <KidSelector />

        {kids.length === 0 ? (
          <div className="mt-8">
            <h1 className="font-display text-3xl uppercase tracking-wide text-warmwhite mb-2">
              Welcome to the Summer Skills Challenge
            </h1>
            <p className="text-warmwhite/55 mb-6">
              Add your kids to get started. Each child will be assigned to an age-appropriate track.
            </p>
            <AddKidForm />
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display text-2xl uppercase tracking-wide text-warmwhite">
                  Summer Skills Challenge
                </h1>
                {activeKid && (
                  <div className="mt-1">
                    <PointsDisplay
                      totalPoints={totalPoints}
                      label={`${activeKid.displayName.split(" ")[0]} has`}
                    />
                  </div>
                )}
              </div>
              <Dialog open={addKidOpen} onOpenChange={setAddKidOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 text-gold hover:text-gold/80 text-sm font-semibold transition-colors">
                    <Plus className="w-4 h-4" /> Add Kid
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a Kid</DialogTitle>
                  </DialogHeader>
                  <AddKidForm onSuccess={() => setAddKidOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>

            {activeKid && allChallenges.length > 0 && currentWeek ? (
              <WeekNavigation
                allChallenges={allChallenges}
                currentWeek={currentWeek}
                activeKid={activeKid}
                hasSubmittedToday={hasSubmittedToday}
                hasVideoBonusForWeek={hasVideoBonusForWeek}
                getWeekSubmissions={getWeekSubmissions}
                totalPoints={totalPoints}
                onSubmitSuccess={invalidate}
              />
            ) : (
              <div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6 text-center">
                <Calendar className="w-8 h-8 text-gold/40 mx-auto mb-3" />
                <p className="text-warmwhite/55">
                  The Summer Skills Challenge starts June 9. Check back then!
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
