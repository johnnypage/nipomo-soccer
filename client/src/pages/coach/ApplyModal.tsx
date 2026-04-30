import { useState, useEffect, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";

const AGE_OPTIONS = ["Pre-K", "1st-2nd", "3rd-4th", "5th-6th", "7th-8th", "High School"];
const ROLES = ["Head Coach", "Assistant Coach", "Either"];

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ApplyModal({ open, onClose }: ApplyModalProps) {
  const { toast } = useToast();
  const [ages, setAges] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [bgCheck, setBgCheck] = useState(true);
  const [showName, setShowName] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  function toggle(val: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(val) ? list.filter((a) => a !== val) : [...list, val]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!bgCheck) {
      toast({ title: "Background check consent is required", variant: "destructive" });
      return;
    }
    if (!role) {
      toast({ title: "Please select a coaching role", variant: "destructive" });
      return;
    }
    if (ages.length === 0) {
      toast({ title: "Please select at least one age group", variant: "destructive" });
      return;
    }

    const form = e.currentTarget;
    const data = new FormData(form);

    setSubmitting(true);
    try {
      const res = await fetch("/api/coach-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone"),
          city: data.get("city") || null,
          coachingExperience: data.get("coachingExperience"),
          coachingRole: role,
          programs: "ROOTS",
          ageGroups: ages.join(", "),
          hasChildren: data.get("hasChildren") || null,
          childrenAges: data.get("childrenAges") || null,
          additionalNotes: data.get("additionalNotes") || null,
          backgroundCheckConsent: bgCheck,
          showOnBoard: showName,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: any) {
      toast({ title: err.message || "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="coach-modal-overlay" onClick={onClose}>
      <div className="coach-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-warmwhite/10 text-warmwhite flex items-center justify-center text-xl hover:bg-warmwhite/20"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {submitted ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-risegreen/20 text-risegreen flex items-center justify-center text-3xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="font-display text-4xl uppercase tracking-wide text-warmwhite">You're in.</h2>
            <p className="text-warmwhite/55 mt-3 max-w-[400px] mx-auto">
              We'll review your sign-up and reach out within a few days. Welcome to the sideline.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-4xl uppercase tracking-wide text-warmwhite">Sign up to coach</h2>
            <p className="text-warmwhite/55 mt-1 mb-6">ROOTS Fall 2026. Fill this out and we'll set up a conversation.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Full name</label>
                  <input name="name" type="text" required placeholder="Your name" className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Email</label>
                  <input name="email" type="email" required placeholder="you@example.com" className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Phone</label>
                  <input name="phone" type="tel" required placeholder="(805) 555-0100" className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold" />
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">City / Town</label>
                  <input name="city" type="text" placeholder="Nipomo, AG, etc." className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Coaching experience</label>
                <select name="coachingExperience" required defaultValue="" className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite focus:outline-none focus:border-gold">
                  <option value="" disabled>Pick one</option>
                  <option>None, but I'm ready to learn</option>
                  <option>Parent volunteer (1-2 seasons)</option>
                  <option>1-3 years organized coaching</option>
                  <option>3+ years organized coaching</option>
                </select>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">What role are you interested in?</label>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        role === r
                          ? "border-gold text-gold bg-gold/10"
                          : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"
                      }`}
                      onClick={() => setRole(role === r ? "" : r)}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Age groups you'd like to coach</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map((a) => (
                    <button
                      type="button"
                      key={a}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        ages.includes(a)
                          ? "border-gold text-gold bg-gold/10"
                          : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"
                      }`}
                      onClick={() => toggle(a, ages, setAges)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Children playing in Nipomo SC?</label>
                  <select name="hasChildren" defaultValue="" className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite focus:outline-none focus:border-gold">
                    <option value="" disabled>Pick one</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not yet, planning to</option>
                  </select>
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Their age(s)</label>
                  <input name="childrenAges" type="text" placeholder="e.g. 7 and 9" className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold" />
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Anything else?</label>
                <textarea name="additionalNotes" placeholder="Questions, scheduling constraints, why you want to coach..." className="w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold min-h-[90px] resize-y" />
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-crimson/10 border border-crimson/20">
                <input
                  type="checkbox"
                  id="bg-check"
                  checked={bgCheck}
                  onChange={(e) => setBgCheck(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="bg-check" className="text-warmwhite/80 text-sm leading-relaxed">
                  I'm willing to complete a background check and required training (SafeSport, concussion awareness).
                </label>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-gold/10 border border-gold/20">
                <input
                  type="checkbox"
                  id="show-name"
                  checked={showName}
                  onChange={(e) => setShowName(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="show-name" className="text-warmwhite/80 text-sm leading-relaxed">
                  Show my name on the coaching board once approved.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit"} <span aria-hidden="true">→</span>
              </button>
              <p className="text-center text-warmwhite/40 text-xs">
                We'll review and reach out within a few days.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
