import { useState, useEffect } from "react";

interface CoachApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  coachingExperience: string;
  programs: string;
  ageGroups: string;
  hasChildren: string | null;
  childrenAges: string | null;
  additionalNotes: string | null;
  backgroundCheckConsent: boolean;
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

  async function load() {
    setLoading(true);
    const url = filter === "all" ? "/api/admin/coach-applications" : `/api/admin/coach-applications?status=${filter}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setApps(await res.json());
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
                  <div><strong className="text-warmwhite/50">Age Groups:</strong> {app.ageGroups}</div>
                  <div><strong className="text-warmwhite/50">Children:</strong> {app.hasChildren || "N/A"} {app.childrenAges ? `(${app.childrenAges})` : ""}</div>
                  <div><strong className="text-warmwhite/50">BG Check:</strong> {app.backgroundCheckConsent ? "Yes" : "No"}</div>
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
          <span className="text-warmwhite text-sm font-medium">
            {AGE_LABELS[d.ageGroup] || d.ageGroup} {d.gender !== "coed" ? `(${d.gender})` : "(co-ed)"}
          </span>
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
  const [divisionId, setDivisionId] = useState("");
  const [role, setRole] = useState<"head" | "assistant">("head");
  const [displayName, setDisplayName] = useState("");
  const [appId, setAppId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/divisions", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setDivisions);
    fetch("/api/admin/coach-applications?status=approved", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setApps);
  }, []);

  async function create() {
    if (!divisionId || !displayName) {
      setMessage("Division and display name are required.");
      return;
    }
    const res = await fetch("/api/admin/coach-assignments", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        divisionId,
        role,
        displayName,
        coachApplicationId: appId || null,
      }),
    });
    if (res.ok) {
      setMessage(`Assigned "${displayName}" as ${role}.`);
      setDisplayName("");
      setAppId("");
    } else {
      const err = await res.json();
      setMessage(err.error || "Failed to create assignment.");
    }
  }

  return (
    <div className="max-w-[500px]">
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
            onChange={(e) => setDivisionId(e.target.value)}
            className="w-full bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm"
          >
            <option value="">Select division</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {AGE_LABELS[d.ageGroup] || d.ageGroup} {d.gender !== "coed" ? `(${d.gender})` : "(co-ed)"}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-warmwhite/50 text-xs mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "head" | "assistant")}
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

        <button
          onClick={create}
          className="px-4 py-2 bg-crimson text-warmwhite text-sm font-medium rounded-lg hover:bg-crimson-dark transition-colors"
        >
          Create Assignment
        </button>

        {message && <p className="text-warmwhite/60 text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
