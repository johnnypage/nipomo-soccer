import { motion } from "framer-motion";
import { Flame, Star, Award, Crown, Trophy } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Flame,
  Star,
  Award,
  Crown,
  Trophy,
};

interface BadgeIconProps {
  id: string;
  label: string;
  icon: string;
  color: string;
  index?: number;
  earned?: boolean;
}

export default function BadgeIcon({ id, label, icon, color, index = 0, earned = true }: BadgeIconProps) {
  const IconComponent = ICON_MAP[icon] ?? Trophy;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex flex-col items-center gap-1 ${!earned ? "opacity-30" : ""}`}
    >
      <div className={`w-12 h-12 rounded-full bg-warmwhite/10 flex items-center justify-center ${earned ? color : "text-warmwhite/30"}`}>
        <IconComponent className="w-6 h-6" />
      </div>
      <span className="text-warmwhite/70 text-xs text-center max-w-[72px] leading-tight">{label}</span>
    </motion.div>
  );
}
