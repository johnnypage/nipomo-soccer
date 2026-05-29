import { motion, AnimatePresence } from "framer-motion";

interface PointsDisplayProps {
  totalPoints: number;
  label?: string;
}

export default function PointsDisplay({ totalPoints, label }: PointsDisplayProps) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-warmwhite/55 text-sm">{label}</span>}
      <AnimatePresence mode="wait">
        <motion.span
          key={totalPoints}
          initial={{ y: -4, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="text-warmwhite font-bold text-sm"
        >
          {totalPoints}
        </motion.span>
      </AnimatePresence>
      <span className="text-warmwhite/55 text-xs uppercase font-bold">
        points
      </span>
    </div>
  );
}
