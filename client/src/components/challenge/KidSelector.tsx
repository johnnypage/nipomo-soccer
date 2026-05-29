import { useActiveKid } from "@/hooks/use-active-kid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "lucide-react";

const AGE_TRACK_LABELS: Record<string, string> = {
  littlekicks: "Little Kicks",
  starter: "Starter",
  advanced: "Advanced",
};

const AGE_TRACK_STYLES: Record<string, string> = {
  littlekicks: "bg-gold/20 text-gold",
  starter: "bg-crimson/20 text-crimson",
  advanced: "bg-warmwhite/20 text-warmwhite",
};

function AgeTrackBadge({ ageTrack }: { ageTrack: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${AGE_TRACK_STYLES[ageTrack] ?? "bg-warmwhite/10 text-warmwhite/60"}`}
    >
      {AGE_TRACK_LABELS[ageTrack] ?? ageTrack}
    </span>
  );
}

export default function KidSelector() {
  const { activeKid, setActiveKidId, kids } = useActiveKid();

  if (kids.length === 0) return null;

  if (kids.length === 1 && activeKid) {
    return (
      <div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg px-4 py-2.5 flex items-center gap-3">
        <User className="w-4 h-4 text-warmwhite/40" />
        <span className="text-warmwhite font-medium text-sm">{activeKid.displayName}</span>
        <AgeTrackBadge ageTrack={activeKid.ageTrack} />
      </div>
    );
  }

  return (
    <div className="bg-warmwhite/5 border border-warmwhite/12 rounded-lg px-4 py-2.5">
      <Select value={activeKid?.id ?? ""} onValueChange={setActiveKidId}>
        <SelectTrigger className="border-0 bg-transparent p-0 h-auto text-warmwhite focus:ring-0 focus:ring-offset-0">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-warmwhite/40" />
            <SelectValue placeholder="Select a kid" />
            {activeKid && <AgeTrackBadge ageTrack={activeKid.ageTrack} />}
          </div>
        </SelectTrigger>
        <SelectContent>
          {kids.map((kid) => (
            <SelectItem key={kid.id} value={kid.id}>
              <div className="flex items-center gap-2">
                <span>{kid.displayName}</span>
                <AgeTrackBadge ageTrack={kid.ageTrack} />
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
