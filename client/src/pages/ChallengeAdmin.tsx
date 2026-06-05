import { useState, useEffect } from "react";
import { Loader2, Download, ExternalLink, Trophy } from "lucide-react";

// -- Types for API responses --

interface AdminSubmission {
  id: string;
  kidName: string;
  ageTrack: string;
  familyEmail: string;
  challengeTitle: string;
  weekNumber: number;
  type: string;
  points: number;
  cloudinaryUrl: string | null;
  thumbnailUrl: string | null;
  submittedAt: string;
}

interface AdminChallenge {
  id: string;
  weekNumber: number;
  ageTrack: string;
  type: string;
  title: string;
  theme: string | null;
  description: string;
  videoUrl: string | null;
  active: boolean;
}

interface AdminKid {
  kidId: string;
  kidName: string;
  ageTrack: string;
  familyId: string;
  familyEmail: string;
  familyName: string | null;
  isRegistered: boolean;
}

interface AdminDrawing {
  id: string;
  weekNumber: number | null;
  type: string;
  winnerName: string;
  totalEntries: number;
  drawnAt: string;
}

interface AdminEmail {
  id: string;
  email: string;
  name: string | null;
  isRegistered: boolean;
  kidCount: number;
  createdAt: string;
}

// -- Sub-tab components --

function SubmissionsList({ token }: { token: string }) {
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekFilter, setWeekFilter] = useState<number | null>(null);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const res = await fetch("/api/admin/challenge/submissions", { headers });
      const data = await res.json();
      if (res.ok) setSubmissions(data.submissions);
    } catch {
      console.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  const filtered = weekFilter
    ? submissions.filter((s) => s.weekNumber === weekFilter)
    : submissions;

  const weeks = Array.from(new Set(submissions.map((s) => s.weekNumber))).sort((a, b) => a - b);

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-warmwhite font-semibold">
          Submissions ({filtered.length})
        </h3>
        <div className="flex gap-1">
          <button
            onClick={() => setWeekFilter(null)}
            className={`px-2 py-1 rounded text-xs font-medium ${
              weekFilter === null ? "bg-gold text-night" : "text-warmwhite/50 hover:text-warmwhite"
            }`}
          >
            All
          </button>
          {weeks.map((w) => (
            <button
              key={w}
              onClick={() => setWeekFilter(w)}
              className={`px-2 py-1 rounded text-xs font-medium ${
                weekFilter === w ? "bg-gold text-night" : "text-warmwhite/50 hover:text-warmwhite"
              }`}
            >
              Wk {w}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate/20 text-warmwhite/50 text-left">
              <th className="pb-2 pr-4">Player</th>
              <th className="pb-2 pr-4">Track</th>
              <th className="pb-2 pr-4">Challenge</th>
              <th className="pb-2 pr-4">Type</th>
              <th className="pb-2 pr-4">Wk</th>
              <th className="pb-2 pr-4">Date</th>
              <th className="pb-2 pr-4">Video</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-slate/10 text-warmwhite/80">
                <td className="py-2 pr-4">{s.kidName}</td>
                <td className="py-2 pr-4 capitalize">{s.ageTrack}</td>
                <td className="py-2 pr-4">{s.challengeTitle}</td>
                <td className="py-2 pr-4 capitalize">{s.type}</td>
                <td className="py-2 pr-4">{s.weekNumber}</td>
                <td className="py-2 pr-4">{new Date(s.submittedAt).toLocaleDateString()}</td>
                <td className="py-2 pr-4">
                  {s.cloudinaryUrl ? (
                    <a
                      href={s.cloudinaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold hover:text-gold/80 inline-flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View
                    </a>
                  ) : (
                    <span className="text-warmwhite/30">--</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ChallengeEditor({ token }: { token: string }) {
  const [challenges, setChallenges] = useState<AdminChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", videoUrl: "" });
  const [saving, setSaving] = useState(false);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetchChallenges();
  }, []);

  async function fetchChallenges() {
    try {
      const res = await fetch("/api/admin/challenge/challenges", { headers });
      const data = await res.json();
      if (res.ok) setChallenges(data.challenges);
    } catch {
      console.error("Failed to fetch challenges");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(c: AdminChallenge) {
    setEditingId(c.id);
    setEditForm({ title: c.title, description: c.description, videoUrl: c.videoUrl || "" });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const body: Record<string, string | null> = {};
      const original = challenges.find((c) => c.id === id);
      if (!original) return;
      if (editForm.title !== original.title) body.title = editForm.title;
      if (editForm.description !== original.description) body.description = editForm.description;
      if (editForm.videoUrl !== (original.videoUrl || "")) {
        body.videoUrl = editForm.videoUrl || null;
      }

      if (Object.keys(body).length === 0) {
        setEditingId(null);
        return;
      }

      const res = await fetch(`/api/admin/challenge/challenges/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        setChallenges((prev) => prev.map((c) => (c.id === data.challenge.id ? data.challenge : c)));
        setEditingId(null);
      }
    } catch {
      console.error("Failed to update challenge");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  // Group by week number
  const byWeek = new Map<number, AdminChallenge[]>();
  for (const c of challenges) {
    const existing = byWeek.get(c.weekNumber) ?? [];
    existing.push(c);
    byWeek.set(c.weekNumber, existing);
  }

  return (
    <div>
      <h3 className="text-warmwhite font-semibold mb-4">
        Challenges ({challenges.length})
      </h3>
      <div className="space-y-6">
        {Array.from(byWeek.entries()).sort(([a], [b]) => a - b).map(([week, weekChallenges]) => (
          <div key={week} className="border border-slate/20 rounded-lg p-4">
            <h4 className="text-warmwhite font-medium mb-3">Week {week}</h4>
            <div className="space-y-3">
              {weekChallenges.map((c: AdminChallenge) => (
                <div key={c.id} className="bg-slate/10 rounded-md p-3">
                  {editingId === c.id ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-warmwhite/50 text-xs mb-1">
                        <span className="capitalize">{c.ageTrack}</span>
                        <span>--</span>
                        <span className="capitalize">{c.type}</span>
                      </div>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                        className="w-full bg-night border border-slate/30 rounded px-3 py-1.5 text-warmwhite text-sm"
                        placeholder="Title"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                        className="w-full bg-night border border-slate/30 rounded px-3 py-1.5 text-warmwhite text-sm"
                        rows={3}
                        placeholder="Description"
                      />
                      <input
                        type="text"
                        value={editForm.videoUrl}
                        onChange={(e) => setEditForm((f) => ({ ...f, videoUrl: e.target.value }))}
                        className="w-full bg-night border border-slate/30 rounded px-3 py-1.5 text-warmwhite text-sm"
                        placeholder="Video URL (YouTube)"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(c.id)}
                          disabled={saving}
                          className="px-3 py-1 bg-gold text-night rounded text-xs font-medium"
                        >
                          {saving ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-warmwhite/50 hover:text-warmwhite text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-warmwhite/50 text-xs mb-1">
                          <span className="capitalize">{c.ageTrack}</span>
                          <span>--</span>
                          <span className="capitalize">{c.type}</span>
                        </div>
                        <p className="text-warmwhite text-sm font-medium">{c.title}</p>
                        <p className="text-warmwhite/60 text-xs mt-1">{c.description.slice(0, 100)}{c.description.length > 100 ? "..." : ""}</p>
                        {c.videoUrl && (
                          <a
                            href={c.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold text-xs hover:text-gold/80 inline-flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Video
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => startEdit(c)}
                        className="text-warmwhite/40 hover:text-warmwhite text-xs px-2 py-1"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayersList({ token }: { token: string }) {
  const [kids, setKids] = useState<AdminKid[]>([]);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetchKids();
  }, []);

  async function fetchKids() {
    try {
      const res = await fetch("/api/admin/challenge/kids", { headers });
      const data = await res.json();
      if (res.ok) setKids(data.kids);
    } catch {
      console.error("Failed to fetch kids");
    } finally {
      setLoading(false);
    }
  }

  async function toggleRegistered(kid: AdminKid) {
    try {
      const res = await fetch(`/api/admin/challenge/families/${kid.familyId}/registered`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ isRegistered: !kid.isRegistered }),
      });
      if (res.ok) {
        // Update all kids in this family (isRegistered is per-family)
        setKids((prev) =>
          prev.map((k) =>
            k.familyId === kid.familyId ? { ...k, isRegistered: !kid.isRegistered } : k
          )
        );
      }
    } catch {
      console.error("Failed to toggle registration");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-warmwhite font-semibold mb-4">
        Players ({kids.length})
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate/20 text-warmwhite/50 text-left">
            <th className="pb-2 pr-4">Player</th>
            <th className="pb-2 pr-4">Track</th>
            <th className="pb-2 pr-4">Family Email</th>
            <th className="pb-2 pr-4">NSC Player</th>
          </tr>
        </thead>
        <tbody>
          {kids.map((k) => (
            <tr key={k.kidId} className="border-b border-slate/10 text-warmwhite/80">
              <td className="py-2 pr-4">{k.kidName}</td>
              <td className="py-2 pr-4 capitalize">{k.ageTrack}</td>
              <td className="py-2 pr-4 text-warmwhite/50">{k.familyEmail}</td>
              <td className="py-2 pr-4">
                <button
                  onClick={() => toggleRegistered(k)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                    k.isRegistered
                      ? "bg-gold/20 text-gold border border-gold/30"
                      : "bg-slate/10 text-warmwhite/30 border border-slate/20 hover:text-warmwhite/50"
                  }`}
                >
                  {k.isRegistered ? "NSC Player" : "Not NSC"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DrawingPanel({ token }: { token: string }) {
  const [drawingResult, setDrawingResult] = useState<{ drawing: AdminDrawing; message: string } | null>(null);
  const [drawings, setDrawings] = useState<AdminDrawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [weekNumber, setWeekNumber] = useState(1);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetchDrawings();
  }, []);

  async function fetchDrawings() {
    try {
      const res = await fetch("/api/admin/challenge/drawings", { headers });
      const data = await res.json();
      if (res.ok) setDrawings(data.drawings);
    } catch {
      console.error("Failed to fetch drawings");
    } finally {
      setLoading(false);
    }
  }

  async function runDrawing(type: "weekly" | "grand") {
    setRunning(true);
    setDrawingResult(null);
    try {
      const body: Record<string, string | number> = { type };
      if (type === "weekly") body.weekNumber = weekNumber;

      const res = await fetch("/api/admin/challenge/drawing", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setDrawingResult(data);
        // Refresh drawing history
        fetchDrawings();
      } else {
        setDrawingResult(null);
        alert(data.error || "Drawing failed");
      }
    } catch {
      console.error("Failed to run drawing");
    } finally {
      setRunning(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-warmwhite font-semibold mb-4">Prize Drawing</h3>

      {/* Drawing controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Weekly drawing */}
        <div className="border border-slate/20 rounded-lg p-4">
          <h4 className="text-warmwhite font-medium text-sm mb-3">Weekly Drawing</h4>
          <p className="text-warmwhite/50 text-xs mb-3">Points from selected week only</p>
          <div className="flex items-center gap-2 mb-3">
            <label className="text-warmwhite/50 text-xs">Week:</label>
            <select
              value={weekNumber}
              onChange={(e) => setWeekNumber(Number(e.target.value))}
              className="bg-night border border-slate/30 rounded px-2 py-1 text-warmwhite text-sm"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => runDrawing("weekly")}
            disabled={running}
            className="w-full px-4 py-2 bg-gold text-night rounded font-medium text-sm flex items-center justify-center gap-2"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
            {running ? "Drawing..." : "Draw Weekly Winner"}
          </button>
        </div>

        {/* Grand prize drawing */}
        <div className="border border-slate/20 rounded-lg p-4">
          <h4 className="text-warmwhite font-medium text-sm mb-3">Grand Prize Drawing</h4>
          <p className="text-warmwhite/50 text-xs mb-3">All points across all 8 weeks</p>
          <button
            onClick={() => runDrawing("grand")}
            disabled={running}
            className="w-full px-4 py-2 bg-crimson text-warmwhite rounded font-medium text-sm flex items-center justify-center gap-2 mt-8"
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
            {running ? "Drawing..." : "Draw Grand Prize Winner"}
          </button>
        </div>
      </div>

      {/* Drawing result */}
      {drawingResult && (
        <div className="bg-gold/10 border border-gold/30 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-gold" />
            <h4 className="text-gold font-semibold">Winner!</h4>
          </div>
          <p className="text-warmwhite text-sm">{drawingResult.message}</p>
          <p className="text-warmwhite/50 text-xs mt-1">
            {drawingResult.drawing.totalEntries} total entries in pool
          </p>
        </div>
      )}

      {/* Drawing history */}
      {drawings.length > 0 && (
        <div>
          <h4 className="text-warmwhite font-medium text-sm mb-3">Drawing History</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate/20 text-warmwhite/50 text-left">
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Week</th>
                <th className="pb-2 pr-4">Winner</th>
                <th className="pb-2 pr-4">Entries</th>
                <th className="pb-2 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {drawings.map((d) => (
                <tr key={d.id} className="border-b border-slate/10 text-warmwhite/80">
                  <td className="py-2 pr-4 capitalize">{d.type}</td>
                  <td className="py-2 pr-4">{d.weekNumber ?? "All"}</td>
                  <td className="py-2 pr-4 font-medium">{d.winnerName}</td>
                  <td className="py-2 pr-4">{d.totalEntries}</td>
                  <td className="py-2 pr-4">{new Date(d.drawnAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmailList({ token }: { token: string }) {
  const [emails, setEmails] = useState<AdminEmail[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  useEffect(() => {
    fetchEmails();
  }, []);

  async function fetchEmails() {
    try {
      const res = await fetch("/api/admin/challenge/emails", { headers });
      const data = await res.json();
      if (res.ok) {
        setEmails(data.emails);
        setTotal(data.total);
      }
    } catch {
      console.error("Failed to fetch emails");
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    fetch("/api/admin/challenge/emails/export", { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "challenge-emails.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(console.error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-warmwhite/40 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-warmwhite font-semibold">
          Email List ({total})
        </h3>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 bg-gold text-night rounded text-xs font-medium"
        >
          <Download className="h-3 w-3" />
          Export CSV
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate/20 text-warmwhite/50 text-left">
            <th className="pb-2 pr-4">Email</th>
            <th className="pb-2 pr-4">Name</th>
            <th className="pb-2 pr-4">Kids</th>
            <th className="pb-2 pr-4">NSC</th>
            <th className="pb-2 pr-4">Signed Up</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((e) => (
            <tr key={e.id} className="border-b border-slate/10 text-warmwhite/80">
              <td className="py-2 pr-4">{e.email}</td>
              <td className="py-2 pr-4">{e.name || "--"}</td>
              <td className="py-2 pr-4">{e.kidCount}</td>
              <td className="py-2 pr-4">
                {e.isRegistered ? (
                  <span className="text-gold text-xs font-medium">Yes</span>
                ) : (
                  <span className="text-warmwhite/30 text-xs">No</span>
                )}
              </td>
              <td className="py-2 pr-4">{new Date(e.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// -- Main component --

export default function ChallengeAdmin({ token }: { token: string }) {
  const [subTab, setSubTab] = useState<"submissions" | "challenges" | "players" | "drawing" | "emails">("submissions");

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-slate/10 rounded-lg p-1 w-fit">
        {(["submissions", "challenges", "players", "drawing", "emails"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
              subTab === t ? "bg-gold text-night" : "text-warmwhite/50 hover:text-warmwhite"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {subTab === "submissions" && <SubmissionsList token={token} />}
      {subTab === "challenges" && <ChallengeEditor token={token} />}
      {subTab === "players" && <PlayersList token={token} />}
      {subTab === "drawing" && <DrawingPanel token={token} />}
      {subTab === "emails" && <EmailList token={token} />}
    </div>
  );
}
