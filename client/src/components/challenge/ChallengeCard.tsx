import type { Challenge, Kid } from "@shared/schema";
import { Calendar, Trophy } from "lucide-react";
import TrackPill from "./TrackPill";
import SubmitButton from "./SubmitButton";
import VideoBonusCheckbox from "./VideoBonusCheckbox";

interface ChallengeCardProps {
  weekNumber: number;
  challenges: Challenge[];
  activeKid: Kid;
  hasSubmittedSkill: boolean;
  hasSubmittedFitness: boolean;
  hasVideoBonus: boolean;
  totalPoints: number;
  onSubmitSuccess: () => void;
}

export default function ChallengeCard({
  weekNumber,
  challenges,
  activeKid,
  hasSubmittedSkill,
  hasSubmittedFitness,
  hasVideoBonus,
  totalPoints,
  onSubmitSuccess,
}: ChallengeCardProps) {
  // Split challenges by type
  const skillChallenges = challenges.filter((c) => c.type === "skill");
  const activeSkill = skillChallenges.find(
    (c) => c.ageTrack === activeKid.ageTrack
  );
  const fitnessChallenge = challenges.find(
    (c) => c.type === "fitness" && c.ageTrack === activeKid.ageTrack
  );

  return (
    <div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg p-6 space-y-4">
      {/* Week header */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gold" />
        <span className="text-gold text-xs font-bold uppercase tracking-wider">
          Week {weekNumber}
        </span>
      </div>

      {/* Skill Challenge */}
      {activeSkill && (
        <div>
          <h2 className="text-warmwhite text-xl font-bold mb-1">
            {activeSkill.title}
          </h2>
          {activeSkill.theme && (
            <p className="text-warmwhite/40 text-sm mb-3">
              {activeSkill.theme}
            </p>
          )}
          <p className="text-warmwhite/70 mb-4">{activeSkill.description}</p>

          {/* Age track variations */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
            {skillChallenges.map((c) => (
              <TrackPill
                key={c.id}
                challenge={c}
                isActive={c.ageTrack === activeKid.ageTrack}
              />
            ))}
          </div>

          {/* YouTube embed */}
          {activeSkill.videoUrl && (
            <div className="mb-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={activeSkill.videoUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={`Week ${weekNumber} instructional video`}
                />
              </div>

              {/* Video bonus checkbox */}
              <div className="mt-3">
                <VideoBonusCheckbox
                  kidId={activeKid.id}
                  challengeId={activeSkill.id}
                  weekNumber={weekNumber}
                  claimed={hasVideoBonus}
                  onClaimSuccess={onSubmitSuccess}
                />
              </div>
            </div>
          )}

          {/* Skill submit button */}
          <SubmitButton
            kidId={activeKid.id}
            challengeId={activeSkill.id}
            weekNumber={weekNumber}
            type="skill"
            kidName={activeKid.displayName.split(" ")[0]}
            disabled={hasSubmittedSkill}
            totalPoints={totalPoints}
            onSubmitSuccess={onSubmitSuccess}
          />
        </div>
      )}

      {/* Fitness Bonus */}
      {fitnessChallenge && (
        <div className="border-t border-warmwhite/10 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-risegreen" />
            <span className="text-risegreen text-xs font-bold uppercase tracking-wider">
              Fitness Bonus
            </span>
          </div>
          <h3 className="text-warmwhite font-semibold mb-1">
            {fitnessChallenge.title}
          </h3>
          <p className="text-warmwhite/70 text-sm mb-4">
            {fitnessChallenge.description}
          </p>

          {/* Fitness submit button */}
          <SubmitButton
            kidId={activeKid.id}
            challengeId={fitnessChallenge.id}
            weekNumber={weekNumber}
            type="fitness"
            kidName={activeKid.displayName.split(" ")[0]}
            disabled={hasSubmittedFitness}
            totalPoints={totalPoints}
            onSubmitSuccess={onSubmitSuccess}
          />
        </div>
      )}
    </div>
  );
}
