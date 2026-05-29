import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, Check, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary";
import { useToast } from "@/hooks/use-toast";
import PointsDisplay from "./PointsDisplay";

type ButtonState = "default" | "uploading" | "success" | "capped";

interface SubmitButtonProps {
  kidId: string;
  challengeId: string;
  weekNumber: number;
  type: "skill" | "fitness";
  kidName: string;
  disabled: boolean;
  totalPoints: number;
  onSubmitSuccess: () => void;
}

export default function SubmitButton({
  kidId,
  challengeId,
  weekNumber,
  type,
  kidName,
  disabled,
  totalPoints,
  onSubmitSuccess,
}: SubmitButtonProps) {
  const [state, setState] = useState<ButtonState>(
    disabled ? "capped" : "default"
  );
  const [updatedTotal, setUpdatedTotal] = useState(totalPoints);
  const { toast } = useToast();

  const handleUploadSuccess = useCallback(
    async (info: CloudinaryUploadResult["info"]) => {
      setState("uploading");
      try {
        const res = await apiRequest("POST", "/api/submissions", {
          kidId,
          challengeId,
          weekNumber,
          type,
          cloudinaryId: info.public_id,
          cloudinaryUrl: info.secure_url,
          thumbnailUrl:
            info.thumbnail_url ||
            info.eager?.[0]?.secure_url ||
            info.secure_url,
        });
        const result = await res.json();
        setUpdatedTotal(result.totalPoints);
        setState("success");
        onSubmitSuccess();
      } catch (err: any) {
        if (err.message?.includes("409")) {
          setState("capped");
        } else {
          setState("default");
          toast({
            title: "Upload failed",
            description: "Check your connection and try again.",
            variant: "destructive",
          });
        }
      }
    },
    [kidId, challengeId, weekNumber, type, onSubmitSuccess, toast]
  );

  const handleError = useCallback(
    (error: unknown) => {
      setState("default");
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
    [toast]
  );

  const { openWidget } = useCloudinaryUpload({
    onSuccess: handleUploadSuccess,
    onError: handleError,
  });

  if (state === "success") {
    return (
      <div className="flex items-center gap-3 min-h-[44px]">
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
          <Check className="w-5 h-5 text-risegreen" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="text-risegreen text-sm font-semibold"
        >
          +1 point
        </motion.span>
        <PointsDisplay totalPoints={updatedTotal} label={`${kidName} has`} />
      </div>
    );
  }

  if (state === "capped" || disabled) {
    return (
      <div className="space-y-1">
        <button
          disabled
          className="w-full min-h-[44px] py-2.5 px-4 bg-warmwhite/10 text-warmwhite/30 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
        >
          Come back tomorrow!
        </button>
        <PointsDisplay totalPoints={totalPoints} label={`${kidName} has`} />
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setState("uploading");
        openWidget();
      }}
      disabled={state === "uploading"}
      className="w-full min-h-[44px] py-2.5 px-4 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {state === "uploading" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="w-4 h-4" />
          Submit Video
        </>
      )}
    </button>
  );
}
