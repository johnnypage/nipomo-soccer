import type { Challenge, Kid } from "@shared/schema";
import ChallengeCard from "./ChallengeCard";
import PastWeekRow from "./PastWeekRow";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface WeekNavigationProps {
  allChallenges: Challenge[];
  currentWeek: number | null;
  activeKid: Kid;
  hasSubmittedToday: (type: "skill" | "fitness") => boolean;
  hasVideoBonusForWeek: (weekNumber: number) => boolean;
  getWeekSubmissions: (weekNumber: number) => { skill: boolean; fitness: boolean; videoBonus: boolean };
  totalPoints: number;
  onSubmitSuccess: () => void;
}

export default function WeekNavigation({
  allChallenges,
  currentWeek,
  activeKid,
  hasSubmittedToday,
  hasVideoBonusForWeek,
  getWeekSubmissions,
  totalPoints,
  onSubmitSuccess,
}: WeekNavigationProps) {
  // Get unique week numbers, sorted ascending
  const weekNumbers = [...new Set(allChallenges.map((c) => c.weekNumber))].sort(
    (a, b) => a - b
  );

  // Only show weeks whose start date has passed (current + past)
  const startedWeeks = weekNumbers.filter((wn) => {
    const weekChallenge = allChallenges.find(
      (c) => c.weekNumber === wn && c.weekStart
    );
    if (!weekChallenge?.weekStart) return false;
    return new Date(weekChallenge.weekStart) <= new Date();
  });

  // Past weeks = started weeks minus current, sorted newest first
  const pastWeeks = startedWeeks
    .filter((wn) => wn !== currentWeek)
    .sort((a, b) => b - a);

  // Get active challenges for a specific week
  function getChallengesForWeek(weekNumber: number): Challenge[] {
    return allChallenges.filter(
      (c) => c.weekNumber === weekNumber && c.active
    );
  }

  // Get title for a week from the active kid's skill challenge
  function getWeekTitle(weekNumber: number): string {
    const skill = allChallenges.find(
      (c) =>
        c.weekNumber === weekNumber &&
        c.type === "skill" &&
        c.ageTrack === activeKid.ageTrack
    );
    return skill?.title ?? `Week ${weekNumber}`;
  }

  return (
    <div className="space-y-6">
      {/* Current week: full challenge card (D-13) */}
      {currentWeek && (
        <ChallengeCard
          weekNumber={currentWeek}
          challenges={getChallengesForWeek(currentWeek)}
          activeKid={activeKid}
          hasSubmittedSkill={hasSubmittedToday("skill")}
          hasSubmittedFitness={hasSubmittedToday("fitness")}
          hasVideoBonus={hasVideoBonusForWeek(currentWeek)}
          totalPoints={totalPoints}
          onSubmitSuccess={onSubmitSuccess}
        />
      )}

      {/* Past weeks: collapsible accordion (D-13, D-14) */}
      {pastWeeks.length > 0 && (
        <div>
          <h3 className="text-warmwhite/55 text-xs font-bold uppercase tracking-wider mb-3">
            Past Weeks
          </h3>
          <Accordion type="single" collapsible className="space-y-2">
            {pastWeeks.map((wn) => (
              <AccordionItem
                key={wn}
                value={`week-${wn}`}
                className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <PastWeekRow
                    weekNumber={wn}
                    title={getWeekTitle(wn)}
                    status={getWeekSubmissions(wn)}
                  />
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <ChallengeCard
                    weekNumber={wn}
                    challenges={getChallengesForWeek(wn)}
                    activeKid={activeKid}
                    hasSubmittedSkill={hasSubmittedToday("skill")}
                    hasSubmittedFitness={hasSubmittedToday("fitness")}
                    hasVideoBonus={hasVideoBonusForWeek(wn)}
                    totalPoints={totalPoints}
                    onSubmitSuccess={onSubmitSuccess}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
