import { useState, useEffect, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";

const AGE_OPTIONS = ["Pre-K", "1st-2nd", "3rd-4th", "5th-6th", "7th-8th", "High School"];
const ROLES = ["Head Coach", "Assistant Coach", "Either"];
const GENDER_OPTIONS = ["Boys", "Girls", "Either"];

interface Kid {
  name: string;
  age: string;
}

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ApplyModal({ open, onClose }: ApplyModalProps) {
  const { toast } = useToast();
  const [ages, setAges] = useState<string[]>([]);
  const [role, setRole] = useState("");
  const [genderPref, setGenderPref] = useState("");
  const [bgCheck, setBgCheck] = useState(true);
  const [multipleTeams, setMultipleTeams] = useState<boolean | null>(null);
  const [kids, setKids] = useState<Kid[]>([]);

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

  function addKid() {
    setKids((prev) => [...prev, { name: "", age: "" }]);
  }

  function updateKid(index: number, field: keyof Kid, value: string) {
    setKids((prev) => prev.map((k, i) => i === index ? { ...k, [field]: value } : k));
  }

  function removeKid(index: number) {
    setKids((prev) => prev.filter((_, i) => i !== index));
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

    const validKids = kids.filter((k) => k.name.trim());

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
          genderPreference: genderPref || null,
          hasChildren: validKids.length > 0 ? "Yes" : null,
          childrenAges: validKids.length > 0 ? JSON.stringify(validKids) : null,
          willingToCoachMultiple: multipleTeams,
          additionalNotes: data.get("additionalNotes") || null,
          backgroundCheckConsent: bgCheck,
          showOnBoard: true,
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

  const inputClass = "w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold";
  const chipBase = "px-4 py-2 rounded-lg text-sm font-medium border transition-colors";
  const chipOn = "border-gold text-gold bg-gold/10";
  const chipOff = "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40";

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
                  <input name="name" type="text" required placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Email</label>
                  <input name="email" type="email" required placeholder="you@example.com" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Phone</label>
                  <input name="phone" type="tel" required placeholder="(805) 555-0100" className={inputClass} />
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">City / Town</label>
                  <input name="city" type="text" placeholder="Nipomo, AG, etc." className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Coaching experience</label>
                <select name="coachingExperience" required defaultValue="" className={inputClass}>
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
                    <button type="button" key={r} className={`${chipBase} ${role === r ? chipOn : chipOff}`}
                      onClick={() => setRole(role === r ? "" : r)}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Age groups you'd like to coach</label>
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map((a) => (
                    <button type="button" key={a} className={`${chipBase} ${ages.includes(a) ? chipOn : chipOff}`}
                      onClick={() => toggle(a, ages, setAges)}>
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">
                  Willing to coach more than one team?
                </label>
                <div className="flex gap-2">
                  {([true, false] as const).map((val) => (
                    <button
                      type="button"
                      key={String(val)}
                      className={`${chipBase} ${multipleTeams === val ? chipOn : chipOff}`}
                      onClick={() => setMultipleTeams(multipleTeams === val ? null : val)}
                    >
                      {val ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Gender preference</label>
                <div className="flex flex-wrap gap-2">
                  {GENDER_OPTIONS.map((g) => (
                    <button type="button" key={g} className={`${chipBase} ${genderPref === g ? chipOn : chipOff}`}
                      onClick={() => setGenderPref(genderPref === g ? "" : g)}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kids section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-warmwhite/70 text-sm">Kids playing in ROOTS this season?</label>
                  <button
                    type="button"
                    onClick={addKid}
                    className="text-xs text-gold hover:text-gold/80 font-medium flex items-center gap-1 transition-colors"
                    data-testid="button-add-kid"
                  >
                    + Add a kid
                  </button>
                </div>

                {kids.length === 0 ? (
                  <p className="text-warmwhite/30 text-sm italic">
                    No kids added -- tap "Add a kid" if you have players in the league.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {kids.map((kid, i) => (
                      <div key={i} className="flex gap-2 items-center" data-testid={`kid-row-${i}`}>
                        <input
                          type="text"
                          placeholder="Child's name"
                          value={kid.name}
                          onChange={(e) => updateKid(i, "name", e.target.value)}
                          className="flex-1 px-3 py-2.5 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold text-sm"
                          data-testid={`input-kid-name-${i}`}
                        />
                        <input
                          type="text"
                          placeholder="Age"
                          value={kid.age}
                          onChange={(e) => updateKid(i, "age", e.target.value)}
                          className="w-20 px-3 py-2.5 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold text-sm"
                          data-testid={`input-kid-age-${i}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeKid(i)}
                          className="w-8 h-8 flex items-center justify-center text-warmwhite/30 hover:text-warmwhite/70 transition-colors flex-shrink-0"
                          aria-label="Remove"
                          data-testid={`button-remove-kid-${i}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">Anything else?</label>
                <textarea name="additionalNotes" placeholder="Questions, scheduling constraints, why you want to coach..." className={`${inputClass} min-h-[90px] resize-y`} />
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

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50"
                data-testid="button-submit-coach"
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
