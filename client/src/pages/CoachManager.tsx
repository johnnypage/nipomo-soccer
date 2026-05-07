import { useState, useEffect } from "react";

interface CoachApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  coachingExperience: string;
  coachingRole: string | null;
  programs: string;
  ageGroups: string;
  genderPreference: string | null;
  hasChildren: string | null;
  childrenAges: string | null;
  willingToCoachMultiple: boolean | null;
  additionalNotes: string | null;
  backgroundCheckConsent: boolean;
  showOnBoard: boolean;
  status: string;
  createdAt: string;
}

interface Division {
  id: string;
  ageGroup: string;
  gender: string;
  headCoachesNeeded: number;
  active: boolean;
  headCount: number;
  assistantCount: number;
}

interface Assignment {
  id: string;
  coachApplicationId: string | null;
  divisionId: string;
  role: string;
  displayName: string;
  headAssignmentId: string | null;
  active: boolean;
}

const AGE_LABELS: Record<string, string> = {
  prek: "Pre-K",
  g12: "1st-2nd",
  g34: "3rd-4th",
  g56: "5th-6th",
  g78: "7th-8th",
  hs: "High School",
};

function divisionLabel(d: Division) {
  return `${AGE_LABELS[d.ageGroup] || d.ageGroup} ${d.gender !== "coed" ? `(${d.gender})` : "(co-ed)"}`;
}

export default function CoachManager({ token }: { token: string }) {
  const [subTab, setSubTab] = useState<"applications" | "divisions" | "assignments">("applications");

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-slate/10 rounded-lg p-1 w-fit">
        {(["applications", "divisions", "assignments"] as const).map((t) => (
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

      {subTab === "applications" && <ApplicationsList token={token} />}
      {subTab === "divisions" && <DivisionsGrid token={token} />}
      {subTab === "assignments" && <AssignmentsView token={token} />}
    </div>
  );
}

function ApplicationsList({ token }: { token: string }) {
  const [apps, setApps] = useState<CoachApplication[]>([]);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    const url = filter === "all" ? "/api/admin/coach-applications" : `/api/admin/coach-applications?status=${filter}`;
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        setApps(await res.json());
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || `Failed to load (${res.status})`);
      }
    } catch {
      setError("Failed to connect to server");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [filter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/coach-applications/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded text-xs capitalize ${
              filter === f ? "bg-warmwhite/10 text-warmwhite" : "text-warmwhite/40 hover:text-warmwhite/70"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-warmwhite/40 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-crimson text-sm">{error}</p>
      ) : apps.length === 0 ? (
        <p className="text-warmwhite/40 text-sm">No applications found.</p>
      ) : (
        <div className="space-y-2">
          {apps.map((app) => (
            <div key={app.id} className="bg-warmwhite/5 rounded-lg border border-warmwhite/10">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-warmwhite font-medium text-sm">{app.name}</span>
                  <span className="text-warmwhite/40 text-xs">{app.email}</span>
                  <span className="text-warmwhite/30 text-xs">{app.programs}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    app.status === "approved" ? "bg-risegreen/20 text-risegreen" :
                    app.status === "rejected" ? "bg-crimson/20 text-crimson" :
                    "bg-gold/20 text-gold"
                  }`}>
                    {app.status}
                  </span>
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border border-warmwhite/20 rounded text-xs text-warmwhite px-2 py-1"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              </div>
              {expanded === app.id && (
                <div className="px-4 pb-4 border-t border-warmwhite/10 pt-3 text-sm text-warmwhite/70 grid grid-cols-2 gap-3">
                  <div><strong className="text-warmwhite/50">Phone:</strong> {app.phone}</div>
                  <div><strong className="text-warmwhite/50">City:</strong> {app.city || "N/A"}</div>
                  <div><strong className="text-warmwhite/50">Experience:</strong> {app.coachingExperience}</div>
                  <div><strong className="text-warmwhite/50">Preferred Role:</strong> {app.coachingRole || "N/A"}</div>
                  <div><strong className="text-warmwhite/50">Age Groups:</strong> {app.ageGroups}</div>
                  <div><strong className="text-warmwhite/50">Gender Pref:</strong> {app.genderPreference || "N/A"}</div>
                  <div>
                    <strong className="text-warmwhite/50">Multiple teams:</strong>{" "}
                    {app.willingToCoachMultiple === true ? "Yes" : app.willingToCoachMultiple === false ? "No" : "N/A"}
                  </div>
                  <div><strong className="text-warmwhite/50">BG Check:</strong> {app.backgroundCheckConsent ? "Yes" : "No"}</div>
                  <div className="col-span-2">
                    <strong className="text-warmwhite/50">Kids in league:</strong>{" "}
                    {(() => {
                      if (!app.childrenAges) return "None listed";
                      try {
                        const kids = JSON.parse(app.childrenAges);
                        if (Array.isArray(kids)) return kids.map((k: {name: string; age: string}) => `${k.name}${k.age ? ` (age ${k.age})` : ""}`).join(", ");
                        return app.childrenAges;
                      } catch { return app.childrenAges; }
                    })()}
                  </div>
                  <div><strong className="text-warmwhite/50">Show on Board:</strong> {app.showOnBoard ? "Yes" : "No"}</div>
                  {app.additionalNotes && (
                    <div className="col-span-2"><strong className="text-warmwhite/50">Notes:</strong> {app.additionalNotes}</div>
                  )}
                  <div className="col-span-2 text-warmwhite/30 text-xs">
                    Submitted {new Date(app.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DivisionsGrid({ token }: { token: string }) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/divisions", { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setDivisions(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function updateNeeded(id: string, val: number) {
    await fetch(`/api/admin/divisions/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ headCoachesNeeded: val }),
    });
    load();
  }

  async function toggleActive(id: string, active: boolean) {
    await fetch(`/api/admin/divisions/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    load();
  }

  if (loading) return <p className="text-warmwhite/40 text-sm">Loading...</p>;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_80px_60px_60px_60px] gap-2 text-xs text-warmwhite/40 uppercase tracking-wider px-4 py-2">
        <span>Division</span>
        <span>Needed</span>
        <span>Head</span>
        <span>Asst</span>
        <span>Active</span>
      </div>
      {divisions.map((d) => (
        <div key={d.id} className="grid grid-cols-[1fr_80px_60px_60px_60px] gap-2 items-center bg-warmwhite/5 rounded-lg px-4 py-3 border border-warmwhite/10">
          <span className="text-warmwhite text-sm font-medium">{divisionLabel(d)}</span>
          <input
            type="number"
            value={d.headCoachesNeeded}
            onChange={(e) => updateNeeded(d.id, parseInt(e.target.value) || 0)}
            className="w-16 bg-transparent border border-warmwhite/20 rounded text-warmwhite text-sm px-2 py-1 text-center"
          />
          <span className="text-warmwhite/70 text-sm text-center">{d.headCount}</span>
          <span className="text-warmwhite/70 text-sm text-center">{d.assistantCount}</span>
          <button
            onClick={() => toggleActive(d.id, !d.active)}
            className={`text-xs px-2 py-1 rounded ${d.active ? "bg-risegreen/20 text-risegreen" : "bg-warmwhite/10 text-warmwhite/40"}`}
          >
            {d.active ? "on" : "off"}
          </button>
        </div>
      ))}
    </div>
  );
}

function AssignmentsView({ token }: { token: string }) {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [apps, setApps] = useState<CoachApplication[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const [divisionId, setDivisionId] = useState("");
  const [role, setRole] = useState<"head" | "assistant">("head");
  const [displayName, setDisplayName] = useState("");
  const [appId, setAppId] = useState("");
  const [headAssignmentId, setHeadAssignmentId] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAppId, setEditAppId] = useState<string>("");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  async function loadAll() {
    const [divRes, appRes, assignRes] = await Promise.all([
      fetch("/api/admin/divisions", { headers }),
      fetch("/api/admin/coach-applications?status=approved", { headers }),
      fetch("/api/admin/coach-assignments", { headers }),
    ]);
    if (divRes.ok) setDivisions(await divRes.json());
    if (appRes.ok) setApps(await appRes.json());
    if (assignRes.ok) setAssignments(await assignRes.json());
  }

  useEffect(() => { loadAll(); }, []);

  const headCoachesInDivision = assignments.filter(
    (a) => a.divisionId === divisionId && a.role === "head"
  );

  async function create() {
    if (!divisionId || !displayName) {
      setMessage("Division and display name are required.");
      return;
    }
    const res = await fetch("/api/admin/coach-assignments", {
      method: "POST",
      headers,
      body: JSON.stringify({
        divisionId,
        role,
        displayName,
        coachApplicationId: appId || null,
        headAssignmentId: role === "assistant" ? (headAssignmentId || null) : null,
      }),
    });
    if (res.ok) {
      setMessage(`Assigned "${displayName}" as ${role}.`);
      setDisplayName("");
      setAppId("");
      setHeadAssignmentId("");
      loadAll();
    } else {
      const err = await res.json();
      setMessage(err.error || "Failed to create assignment.");
    }
  }

  async function remove(id: string) {
    await fetch(`/api/admin/coach-assignments/${id}`, { method: "DELETE", headers });
    loadAll();
  }

  async function updatePairing(id: string, headId: string) {
    await fetch(`/api/admin/coach-assignments/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ headAssignmentId: headId || null }),
    });
    loadAll();
  }

  function startEdit(a: Assignment) {
    setEditingId(a.id);
    setEditName(a.displayName);
    setEditAppId(a.coachApplicationId || "");
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    await fetch(`/api/admin/coach-assignments/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ displayName: editName.trim(), coachApplicationId: editAppId || null }),
    });
    setEditingId(null);
    loadAll();
  }

  const divisionMap = Object.fromEntries(divisions.map((d) => [d.id, d]));

  const groupedByDivision = divisions
    .map((div) => {
      const divAssignments = assignments.filter((a) => a.divisionId === div.id);
      if (divAssignments.length === 0) return null;
      const heads = divAssignments.filter((a) => a.role === "head");
      const assistants = divAssignments.filter((a) => a.role === "assistant");
      return { div, heads, assistants };
    })
    .filter(Boolean) as { div: Division; heads: Assignment[]; assistants: Assignment[] }[];

  return (
    <div className="space-y-8">
      {/* Create form */}
      <div className="max-w-[520px]">
        <h3 className="text-warmwhite font-medium mb-4">Create Assignment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-warmwhite/50 text-xs mb-1">Approved Coach (optional)</label>
            <select
              value={appId}
              onChange={(e) => {
                setAppId(e.target.value);
                const app = apps.find((a) => a.id === e.target.value);
                if (app) setDisplayName(`Coach ${app.name.split(" ")[0]} ${app.name.split(" ").pop()?.[0] || ""}.`);
              }}
              className="w-full bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm"
            >
              <option value="">Manual entry</option>
              {apps.map((a) => (
                <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-warmwhite/50 text-xs mb-1">Division</label>
            <select
              value={divisionId}
              onChange={(e) => { setDivisionId(e.target.value); setHeadAssignmentId(""); }}
              className="w-full bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm"
            >
              <option value="">Select division</option>
              {divisions.map((d) => (
                <option key={d.id} value={d.id}>{divisionLabel(d)}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-warmwhite/50 text-xs mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value as "head" | "assistant"); setHeadAssignmentId(""); }}
                className="w-full bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm"
              >
                <option value="head">Head Coach</option>
                <option value="assistant">Assistant</option>
              </select>
            </div>
            <div>
              <label className="block text-warmwhite/50 text-xs mb-1">Display Name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Coach FirstName L."
                className="w-full bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm placeholder:text-warmwhite/30"
              />
            </div>
          </div>

          {role === "assistant" && divisionId && (
            <div>
              <label className="block text-warmwhite/50 text-xs mb-1">Paired Head Coach (optional)</label>
              <select
                value={headAssignmentId}
                onChange={(e) => setHeadAssignmentId(e.target.value)}
                className="w-full bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm"
              >
                <option value="">-- Unassigned --</option>
                {headCoachesInDivision.map((h) => (
                  <option key={h.id} value={h.id}>{h.displayName}</option>
                ))}
              </select>
              {headCoachesInDivision.length === 0 && (
                <p className="text-warmwhite/30 text-xs mt-1">No head coaches assigned to this division yet.</p>
              )}
            </div>
          )}

          <button
            onClick={create}
            className="px-4 py-2 bg-crimson text-warmwhite text-sm font-medium rounded-lg hover:bg-crimson-dark transition-colors"
          >
            Create Assignment
          </button>
          {message && <p className="text-warmwhite/60 text-sm">{message}</p>}
        </div>
      </div>

      {/* Current assignments grouped by division */}
      {groupedByDivision.length > 0 && (
        <div>
          <h3 className="text-warmwhite font-medium mb-3">Current Assignments</h3>
          <div className="space-y-4">
            {groupedByDivision.map(({ div, heads, assistants }) => (
              <div key={div.id} className="bg-warmwhite/3 border border-warmwhite/10 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-warmwhite/5 border-b border-warmwhite/10">
                  <span className="text-warmwhite/70 text-xs font-medium uppercase tracking-wider">
                    {divisionLabel(div)}
                  </span>
                </div>
                <div className="p-3 space-y-2">
                  {heads.map((head) => {
                    const paired = assistants.filter((a) => a.headAssignmentId === head.id);
                    const unpaired = assistants.filter((a) => !a.headAssignmentId);
                    return (
                      <div key={head.id}>
                        {/* Head coach row */}
                        <div className={`px-3 py-2 rounded-md bg-gold/8 border border-gold/20 ${editingId === head.id ? "" : "flex items-center justify-between"}`}>
                          {editingId === head.id ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gold text-xs font-semibold uppercase tracking-wider w-14 flex-shrink-0">Head</span>
                                <input
                                  autoFocus
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                                  className="bg-transparent border border-gold/40 rounded px-2 py-0.5 text-sm text-warmwhite flex-1"
                                  placeholder="Display name"
                                />
                              </div>
                              <div className="flex items-center gap-2 pl-16">
                                <select
                                  value={editAppId}
                                  onChange={(e) => setEditAppId(e.target.value)}
                                  className="flex-1 bg-night border border-warmwhite/20 rounded px-2 py-1 text-warmwhite text-xs"
                                >
                                  <option value="">No linked application</option>
                                  {apps.map((a) => (
                                    <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-center gap-3 pl-16">
                                <button onClick={() => saveEdit(head.id)} className="text-risegreen text-xs">save</button>
                                <button onClick={() => setEditingId(null)} className="text-warmwhite/30 text-xs">cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-gold text-xs font-semibold uppercase tracking-wider w-14 flex-shrink-0">Head</span>
                                <span className="text-warmwhite text-sm truncate">{head.displayName}</span>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <button onClick={() => startEdit(head)} className="text-warmwhite/25 hover:text-gold text-xs transition-colors">edit</button>
                                <button onClick={() => remove(head.id)} className="text-warmwhite/25 hover:text-crimson text-xs transition-colors">remove</button>
                              </div>
                            </>
                          )}
                        </div>
                        {/* Paired assistants */}
                        {paired.map((asst) => (
                          <div key={asst.id} className={`ml-6 mt-1 px-3 py-2 rounded-md bg-warmwhite/4 border border-warmwhite/8 ${editingId === asst.id ? "" : "flex items-center justify-between"}`}>
                            {editingId === asst.id ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-warmwhite/35 text-xs w-14 flex-shrink-0">Asst</span>
                                  <input
                                    autoFocus
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                                    className="bg-transparent border border-warmwhite/30 rounded px-2 py-0.5 text-sm text-warmwhite flex-1"
                                    placeholder="Display name"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pl-16">
                                  <select
                                    value={editAppId}
                                    onChange={(e) => setEditAppId(e.target.value)}
                                    className="flex-1 bg-night border border-warmwhite/20 rounded px-2 py-1 text-warmwhite text-xs"
                                  >
                                    <option value="">No linked application</option>
                                    {apps.map((a) => (
                                      <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-center gap-3 pl-16">
                                  <button onClick={() => saveEdit(asst.id)} className="text-risegreen text-xs">save</button>
                                  <button onClick={() => setEditingId(null)} className="text-warmwhite/30 text-xs">cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-warmwhite/35 text-xs w-14 flex-shrink-0">Asst</span>
                                  <span className="text-warmwhite/80 text-sm truncate">{asst.displayName}</span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <button onClick={() => startEdit(asst)} className="text-warmwhite/25 hover:text-gold text-xs transition-colors">edit</button>
                                  <select
                                    value={asst.headAssignmentId || ""}
                                    onChange={(e) => updatePairing(asst.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-transparent border border-warmwhite/15 rounded text-xs text-warmwhite/60 px-2 py-1"
                                  >
                                    <option value="">-- Unpair --</option>
                                    {heads.map((h) => (
                                      <option key={h.id} value={h.id}>{h.displayName}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => remove(asst.id)} className="text-warmwhite/25 hover:text-crimson text-xs transition-colors">remove</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                        {/* Unassigned assistants under last head */}
                        {head.id === heads[heads.length - 1]?.id && unpaired.map((asst) => (
                          <div key={asst.id} className={`ml-6 mt-1 px-3 py-2 rounded-md bg-warmwhite/4 border border-warmwhite/8 border-dashed ${editingId === asst.id ? "" : "flex items-center justify-between"}`}>
                            {editingId === asst.id ? (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-warmwhite/25 text-xs w-14 flex-shrink-0">Asst</span>
                                  <input
                                    autoFocus
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Escape") setEditingId(null); }}
                                    className="bg-transparent border border-warmwhite/30 rounded px-2 py-0.5 text-sm text-warmwhite flex-1"
                                    placeholder="Display name"
                                  />
                                </div>
                                <div className="flex items-center gap-2 pl-16">
                                  <select
                                    value={editAppId}
                                    onChange={(e) => setEditAppId(e.target.value)}
                                    className="flex-1 bg-night border border-warmwhite/20 rounded px-2 py-1 text-warmwhite text-xs"
                                  >
                                    <option value="">No linked application</option>
                                    {apps.map((a) => (
                                      <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                                    ))}
                                  </select>
                                </div>
                                <div className="flex items-center gap-3 pl-16">
                                  <button onClick={() => saveEdit(asst.id)} className="text-risegreen text-xs">save</button>
                                  <button onClick={() => setEditingId(null)} className="text-warmwhite/30 text-xs">cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <span className="text-warmwhite/25 text-xs w-14 flex-shrink-0">Asst</span>
                                  <span className="text-warmwhite/50 text-sm truncate">{asst.displayName}</span>
                                  <span className="text-warmwhite/25 text-xs italic">unassigned</span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                  <button onClick={() => startEdit(asst)} className="text-warmwhite/25 hover:text-gold text-xs transition-colors">edit</button>
                                  <select
                                    value=""
                                    onChange={(e) => updatePairing(asst.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-transparent border border-warmwhite/15 rounded text-xs text-warmwhite/60 px-2 py-1"
                                  >
                                    <option value="">-- Pair with --</option>
                                    {heads.map((h) => (
                                      <option key={h.id} value={h.id}>{h.displayName}</option>
                                    ))}
                                  </select>
                                  <button onClick={() => remove(asst.id)} className="text-warmwhite/25 hover:text-crimson text-xs transition-colors">remove</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}

                  {/* Head coaches with no assistants yet */}
                  {heads.length === 0 && assistants.map((asst) => (
                    <div key={asst.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-warmwhite/4 border border-warmwhite/8 border-dashed">
                      <div className="flex items-center gap-2">
                        <span className="text-warmwhite/25 text-xs w-14">Asst</span>
                        <span className="text-warmwhite/50 text-sm">{asst.displayName}</span>
                        <span className="text-warmwhite/25 text-xs italic">no head coach yet</span>
                      </div>
                      <button
                        onClick={() => remove(asst.id)}
                        className="text-warmwhite/25 hover:text-crimson text-xs transition-colors"
                      >
                        remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
