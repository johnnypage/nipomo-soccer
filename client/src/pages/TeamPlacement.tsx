import { useState, useEffect, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

type Role = "parent" | "coach" | "";
type RequestType = "pair_players" | "request_coach" | "schedule_needs" | "coach_request_player" | "other" | "";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const RELATIONSHIPS = ["Friend", "Sibling", "Cousin", "Neighbor", "Other"];

const PARENT_REQUEST_OPTIONS = [
  { value: "pair_players", label: "Pair my player with another player" },
  { value: "request_coach", label: "Request a specific coach" },
  { value: "schedule_needs", label: "Schedule needs or conflicts" },
  { value: "other", label: "Something else" },
];

const COACH_REQUEST_OPTIONS = [
  { value: "coach_request_player", label: "Request a player for my team" },
  { value: "other", label: "Something else" },
];

export default function TeamPlacement() {
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [role, setRole] = useState<Role>("");
  const [requestType, setRequestType] = useState<RequestType>("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [otherPlayerName, setOtherPlayerName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [coachName, setCoachName] = useState("");
  const [connectionReason, setConnectionReason] = useState("");
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [unavailableDays, setUnavailableDays] = useState<string[]>([]);
  const [scheduleReason, setScheduleReason] = useState("");
  const [additionalPlayerNames, setAdditionalPlayerNames] = useState("");
  const [notes, setNotes] = useState("");

  function toggleDay(day: string, list: string[], setter: (v: string[]) => void) {
    setter(list.includes(day) ? list.filter((d) => d !== day) : [...list, day]);
  }

  function resetForm() {
    setRole("");
    setRequestType("");
    setName(""); setEmail(""); setPhone(""); setPlayerName("");
    setOtherPlayerName(""); setRelationship(""); setCoachName("");
    setConnectionReason(""); setAvailableDays([]); setUnavailableDays([]);
    setScheduleReason(""); setAdditionalPlayerNames(""); setNotes("");
    setSubmitted(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!role) {
      toast({ title: "Please select your role (Parent or Coach)", variant: "destructive" });
      return;
    }
    if (!requestType) {
      toast({ title: "Please select a request type", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const body: Record<string, any> = {
        submitterRole: role,
        submitterName: name,
        submitterEmail: email,
        submitterPhone: phone,
        playerName,
        requestType,
        notes: notes || null,
      };

      if (requestType === "pair_players") {
        body.otherPlayerName = otherPlayerName;
        body.relationship = relationship || null;
      } else if (requestType === "request_coach") {
        body.coachName = coachName;
        body.connectionReason = connectionReason || null;
      } else if (requestType === "schedule_needs") {
        body.availableDays = availableDays.length > 0 ? availableDays.join(", ") : null;
        body.unavailableDays = unavailableDays.length > 0 ? unavailableDays.join(", ") : null;
        body.scheduleReason = scheduleReason || null;
      } else if (requestType === "coach_request_player") {
        body.coachName = coachName || name;
        body.additionalPlayerNames = additionalPlayerNames || null;
      }

      const res = await fetch("/api/placement-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        toast({ title: data.error || "Submission failed", variant: "destructive" });
        return;
      }

      setSubmitted(true);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  const ic = "w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold";
  const sc = `${ic} appearance-none`;
  const requestOptions = role === "coach" ? COACH_REQUEST_OPTIONS : PARENT_REQUEST_OPTIONS;

  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-xl mx-auto px-4 pt-[140px] md:pt-32 pb-16">
        {submitted ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-risegreen/20 text-risegreen flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h1 className="font-display text-4xl uppercase tracking-wide text-warmwhite mb-3">Request Received</h1>
            <p className="text-warmwhite/55 max-w-md mx-auto mb-8">
              We'll review your request and do our best to accommodate it during team placement. You should receive a confirmation email shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
              >
                Submit Another
              </button>
              <a
                href="/"
                className="px-6 py-3 border border-warmwhite/20 text-warmwhite/70 font-semibold rounded-lg hover:border-warmwhite/40 hover:text-warmwhite transition-colors"
              >
                Go Home
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-warmwhite mb-3">
                Team Placement Request
              </h1>
              <p className="text-warmwhite/55">
                Let us know if there's anything we should consider when placing your player. We'll do our best to accommodate, but can't guarantee all requests.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* I am a */}
              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">I am a...</label>
                <select
                  value={role}
                  onChange={(e) => { setRole(e.target.value as Role); setRequestType(""); }}
                  className={sc}
                  data-testid="select-role"
                >
                  <option value="">-- Select --</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="coach">Coach</option>
                </select>
              </div>

              {/* Request type */}
              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">What kind of request is this?</label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value as RequestType)}
                  className={sc}
                  data-testid="select-request-type"
                >
                  <option value="">-- Select a request type --</option>
                  {requestOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Your name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className={ic} data-testid="input-name" />
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={ic} data-testid="input-email" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Phone</label>
                  <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(805) 555-0100" className={ic} data-testid="input-phone" />
                </div>
                <div>
                  <label className="block text-warmwhite/70 text-sm mb-1.5">Player name</label>
                  <input type="text" required value={playerName} onChange={(e) => setPlayerName(e.target.value)} placeholder="Your child's full name" className={ic} data-testid="input-player-name" />
                </div>
              </div>

              {/* Pair players */}
              {requestType === "pair_players" && (
                <>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">Who should they be paired with?</label>
                    <input type="text" required value={otherPlayerName} onChange={(e) => setOtherPlayerName(e.target.value)} placeholder="Other player's full name" className={ic} data-testid="input-other-player" />
                  </div>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">Relationship (optional)</label>
                    <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className={sc} data-testid="select-relationship">
                      <option value="">-- Select --</option>
                      {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Request coach */}
              {requestType === "request_coach" && (
                <>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">Coach name</label>
                    <input type="text" required value={coachName} onChange={(e) => setCoachName(e.target.value)} placeholder="Coach's full name" className={ic} data-testid="input-coach-name" />
                  </div>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">How do you know this coach? (optional)</label>
                    <input type="text" value={connectionReason} onChange={(e) => setConnectionReason(e.target.value)} placeholder="Family member, coached last season, etc." className={ic} data-testid="input-connection-reason" />
                  </div>
                </>
              )}

              {/* Schedule needs */}
              {requestType === "schedule_needs" && (
                <>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-2">Days that work for you</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => (
                        <button
                          type="button"
                          key={`avail-${day}`}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${availableDays.includes(day) ? "border-risegreen text-risegreen bg-risegreen/10" : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"}`}
                          onClick={() => toggleDay(day, availableDays, setAvailableDays)}
                          data-testid={`day-avail-${day.toLowerCase()}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-2">Days that don't work</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => (
                        <button
                          type="button"
                          key={`unavail-${day}`}
                          className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${unavailableDays.includes(day) ? "border-crimson text-crimson bg-crimson/10" : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"}`}
                          onClick={() => toggleDay(day, unavailableDays, setUnavailableDays)}
                          data-testid={`day-unavail-${day.toLowerCase()}`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">Reason (optional)</label>
                    <input type="text" value={scheduleReason} onChange={(e) => setScheduleReason(e.target.value)} placeholder="Work schedule, other sport, custody arrangement..." className={ic} data-testid="input-schedule-reason" />
                  </div>
                </>
              )}

              {/* Coach requests player */}
              {requestType === "coach_request_player" && (
                <>
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">Players to request (optional)</label>
                    <textarea value={additionalPlayerNames} onChange={(e) => setAdditionalPlayerNames(e.target.value)} placeholder="One player name per line" className={`${ic} min-h-[90px] resize-y`} data-testid="input-additional-players" />
                  </div>
                </>
              )}

              {/* Notes */}
              <div>
                <label className="block text-warmwhite/70 text-sm mb-1.5">
                  {requestType === "other" ? "What would you like us to know?" : "Anything else? (optional)"}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  required={requestType === "other"}
                  placeholder={requestType === "other" ? "Describe your request..." : "Any additional details..."}
                  className={`${ic} min-h-[90px] resize-y`}
                  data-testid="input-notes"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50"
                data-testid="button-submit"
              >
                {submitting ? "Submitting..." : "Submit Request"} <span aria-hidden="true">&rarr;</span>
              </button>
              <p className="text-center text-warmwhite/40 text-xs">
                We'll review all requests as we build rosters.
              </p>
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
