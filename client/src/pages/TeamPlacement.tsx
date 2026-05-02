import { useState, useEffect, type FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Users, UserCheck, Calendar, MessageSquare, ClipboardList, CheckCircle } from "lucide-react";

type Role = "parent" | "coach";
type RequestType = "pair_players" | "request_coach" | "schedule_needs" | "other" | "coach_request_player";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const RELATIONSHIPS = ["Friend", "Sibling", "Cousin", "Neighbor", "Other"];

const PARENT_TILES: { type: RequestType; label: string; description: string; icon: typeof Users }[] = [
  { type: "pair_players", label: "Pair with Another Player", description: "Request to be on the same team as a friend, sibling, or family member", icon: Users },
  { type: "request_coach", label: "Request a Specific Coach", description: "Your child's uncle coaches, or you had a great experience before", icon: UserCheck },
  { type: "schedule_needs", label: "Schedule Needs", description: "Work schedules, custody arrangements, or other conflicts", icon: Calendar },
  { type: "other", label: "Something Else", description: "Anything else we should know when placing your player", icon: MessageSquare },
];

const COACH_TILES: { type: RequestType; label: string; description: string; icon: typeof Users }[] = [
  { type: "coach_request_player", label: "Request a Player for My Team", description: "Request specific players for your roster", icon: ClipboardList },
];

export default function TeamPlacement() {
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [role, setRole] = useState<Role>("parent");
  const [requestType, setRequestType] = useState<RequestType | "">("");
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
    setRequestType("");
    setName("");
    setEmail("");
    setPhone("");
    setPlayerName("");
    setOtherPlayerName("");
    setRelationship("");
    setCoachName("");
    setConnectionReason("");
    setAvailableDays([]);
    setUnavailableDays([]);
    setScheduleReason("");
    setAdditionalPlayerNames("");
    setNotes("");
    setSubmitted(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!requestType) {
      toast({ title: "Please select a request type", variant: "destructive" });
      return;
    }
    if (requestType === "pair_players" && !otherPlayerName.trim()) {
      toast({ title: "Please enter the other player's name", variant: "destructive" });
      return;
    }
    if (requestType === "request_coach" && !coachName.trim()) {
      toast({ title: "Please enter the coach's name", variant: "destructive" });
      return;
    }
    if (requestType === "other" && !notes.trim()) {
      toast({ title: "Please describe your request", variant: "destructive" });
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

  const tiles = role === "coach" ? COACH_TILES : PARENT_TILES;
  const inputClasses = "w-full px-3.5 py-3 bg-warmwhite/5 border border-warmwhite/12 rounded-lg text-warmwhite placeholder:text-warmwhite/30 focus:outline-none focus:border-gold";

  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-2xl mx-auto px-4 pt-32 pb-16">
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
                Submit Another Request
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
            <div className="text-center mb-12">
              <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-warmwhite mb-3">
                Team Placement Requests
              </h1>
              <p className="text-warmwhite/55 max-w-lg mx-auto">
                Let us know if there's anything we should consider when placing your player on a team. We'll do our best to accommodate requests, but can't guarantee all of them.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Toggle */}
              <div>
                <label className="block text-warmwhite/70 text-sm mb-2">I am a...</label>
                <div className="flex gap-2">
                  {(["parent", "coach"] as const).map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                        role === r
                          ? "border-gold text-gold bg-gold/10"
                          : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"
                      }`}
                      onClick={() => { setRole(r); setRequestType(""); }}
                    >
                      {r === "parent" ? "Parent / Guardian" : "Coach"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Request Type Tiles */}
              <div>
                <label className="block text-warmwhite/70 text-sm mb-3">What kind of request is this?</label>
                <div className={`grid gap-3 ${tiles.length > 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                  {tiles.map((tile) => {
                    const Icon = tile.icon;
                    const selected = requestType === tile.type;
                    return (
                      <button
                        type="button"
                        key={tile.type}
                        className={`text-left p-4 rounded-lg border transition-colors ${
                          selected
                            ? "border-gold bg-gold/10"
                            : "border-warmwhite/12 hover:border-warmwhite/30 bg-warmwhite/5"
                        }`}
                        onClick={() => setRequestType(tile.type)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${selected ? "text-gold" : "text-warmwhite/40"}`} />
                          <div>
                            <span className={`text-sm font-medium block ${selected ? "text-gold" : "text-warmwhite"}`}>
                              {tile.label}
                            </span>
                            <span className="text-xs text-warmwhite/40 mt-0.5 block">{tile.description}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Common Fields */}
              {requestType && (
                <>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Your name</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Full name"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Phone</label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(805) 555-0100"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Player name</label>
                        <input
                          type="text"
                          required
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder="Your child's full name"
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Type-Specific Fields */}
                  {requestType === "pair_players" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Who should they be paired with?</label>
                        <input
                          type="text"
                          required
                          value={otherPlayerName}
                          onChange={(e) => setOtherPlayerName(e.target.value)}
                          placeholder="Other player's full name"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Relationship (optional)</label>
                        <div className="flex flex-wrap gap-2">
                          {RELATIONSHIPS.map((r) => (
                            <button
                              type="button"
                              key={r}
                              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                relationship === r
                                  ? "border-gold text-gold bg-gold/10"
                                  : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"
                              }`}
                              onClick={() => setRelationship(relationship === r ? "" : r)}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {requestType === "request_coach" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Coach name</label>
                        <input
                          type="text"
                          required
                          value={coachName}
                          onChange={(e) => setCoachName(e.target.value)}
                          placeholder="Coach's name"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">How do you know this coach? (optional)</label>
                        <input
                          type="text"
                          value={connectionReason}
                          onChange={(e) => setConnectionReason(e.target.value)}
                          placeholder="Family member, coached last season, etc."
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  )}

                  {requestType === "schedule_needs" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-2">Days that work for you</label>
                        <div className="flex flex-wrap gap-2">
                          {DAYS.map((day) => (
                            <button
                              type="button"
                              key={`avail-${day}`}
                              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                availableDays.includes(day)
                                  ? "border-risegreen text-risegreen bg-risegreen/10"
                                  : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"
                              }`}
                              onClick={() => toggleDay(day, availableDays, setAvailableDays)}
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
                              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                unavailableDays.includes(day)
                                  ? "border-crimson text-crimson bg-crimson/10"
                                  : "border-warmwhite/20 text-warmwhite/60 hover:border-warmwhite/40"
                              }`}
                              onClick={() => toggleDay(day, unavailableDays, setUnavailableDays)}
                            >
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Reason (optional)</label>
                        <input
                          type="text"
                          value={scheduleReason}
                          onChange={(e) => setScheduleReason(e.target.value)}
                          placeholder="Work schedule, other sports, custody arrangement, etc."
                          className={inputClasses}
                        />
                      </div>
                    </div>
                  )}

                  {requestType === "coach_request_player" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Your name (as coach)</label>
                        <input
                          type="text"
                          value={coachName}
                          onChange={(e) => setCoachName(e.target.value)}
                          placeholder="Your coaching name"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className="block text-warmwhite/70 text-sm mb-1.5">Additional players to request (optional)</label>
                        <textarea
                          value={additionalPlayerNames}
                          onChange={(e) => setAdditionalPlayerNames(e.target.value)}
                          placeholder="One player name per line"
                          className={`${inputClasses} min-h-[90px] resize-y`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label className="block text-warmwhite/70 text-sm mb-1.5">
                      {requestType === "other" ? "Tell us what you'd like us to consider" : "Anything else? (optional)"}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      required={requestType === "other"}
                      placeholder={requestType === "other" ? "Describe your request..." : "Any additional details..."}
                      className={`${inputClasses} min-h-[90px] resize-y`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Request"} <span aria-hidden="true">&rarr;</span>
                  </button>
                  <p className="text-center text-warmwhite/40 text-xs">
                    We'll review all requests as we build rosters.
                  </p>
                </>
              )}
            </form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
