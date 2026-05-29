import { useState } from "react";
import { motion } from "framer-motion";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VideoBonusCheckboxProps {
  kidId: string;
  challengeId: string;
  weekNumber: number;
  claimed: boolean;
  onClaimSuccess: () => void;
}

export default function VideoBonusCheckbox({
  kidId,
  challengeId,
  weekNumber,
  claimed,
  onClaimSuccess,
}: VideoBonusCheckboxProps) {
  const [isClaimed, setIsClaimed] = useState(claimed);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  async function handleCheck(checked: boolean | "indeterminate") {
    if (checked !== true || isClaimed || submitting) return;
    setSubmitting(true);
    try {
      await apiRequest("POST", "/api/video-bonus", {
        kidId,
        challengeId,
        weekNumber,
      });
      setIsClaimed(true);
      onClaimSuccess();
    } catch (err: any) {
      if (err.message?.includes("409")) {
        setIsClaimed(true);
      } else {
        toast({
          title: "Something went wrong",
          description: "Could not claim video bonus. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = isClaimed || submitting;

  return (
    <div className="flex items-center gap-3 min-h-[44px]">
      <CheckboxPrimitive.Root
        id={`video-bonus-${weekNumber}`}
        checked={isClaimed}
        onCheckedChange={handleCheck}
        disabled={isDisabled}
        className={`h-5 w-5 shrink-0 rounded border ${
          isClaimed
            ? "bg-risegreen border-risegreen"
            : "border-warmwhite/30 bg-warmwhite/5"
        } ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } flex items-center justify-center`}
      >
        <CheckboxPrimitive.Indicator>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1.0] }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <Check className="w-3.5 h-3.5 text-warmwhite" />
          </motion.div>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <label
        htmlFor={`video-bonus-${weekNumber}`}
        className={`text-sm leading-relaxed ${
          isDisabled
            ? "text-warmwhite/40"
            : "text-warmwhite/70 cursor-pointer"
        }`}
      >
        {isClaimed
          ? claimed
            ? "Video bonus claimed this week"
            : "Video bonus claimed! +1 point"
          : "I watched the video (+1 bonus point)"}
      </label>
    </div>
  );
}
