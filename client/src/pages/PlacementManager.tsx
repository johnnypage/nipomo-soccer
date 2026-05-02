import { useState, useEffect } from "react";
import { Download } from "lucide-react";

interface PlacementRequest {
  id: string;
  submitterRole: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  playerName: string;
  requestType: string;
  otherPlayerName: string | null;
  relationship: string | null;
  coachName: string | null;
  connectionReason: string | null;
  availableDays: string | null;
  unavailableDays: string | null;
  scheduleReason: string | null;
  additionalPlayerNames: string | null;
  notes: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  pair_players: "Pair Players",
  request_coach: "Request Coach",
  schedule_needs: "Schedule",
  coach_request_player: "Coach Request",
  other: "Other",
};

const TYPE_COLORS: Record<string, string> = {
  pair_players: "bg-iceblue/20 text-iceblue",
  request_coach: "bg-purple/20 text-purple",
  schedule_needs: "bg-amber/20 text-amber",
  coach_request_player: "bg-risegreen/20 text-risegreen",
  other: "bg-silver/20 text-silver",
};

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-risegreen/20 text-risegreen",
  denied: "bg-crimson/20 text-crimson",
  pending: "bg-gold/20 text-gold",
};

export default function PlacementManager({ token }: { token: string }) {
  const [requests, setRequests] = useState<PlacementRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [related, setRelated] = useState<Record<string, PlacementRequest[]>>({});
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  async function load() {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (typeFilter !== "all") params.set("type", typeFilter);
    const qs = params.toString();
    const url = `/api/admin/placement-requests${qs ? `?${qs}` : ""}`;
    try {
      const res = await fetch(url, { headers });
      if (res.ok) {
        setRequests(await res.json());
      } else {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(err.error || `Failed to load (${res.status})`);
      }
    } catch {
      setError("Failed to connect to server");
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, [statusFilter, typeFilter]);

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/placement-requests/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function saveNotes(id: string) {
    await fetch(`/api/admin/placement-requests/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ adminNotes: editingNotes[id] ?? "" }),
    });
    load();
  }

  async function loadRelated(id: string) {
    if (related[id]) return;
    try {
      const res = await fetch(`/api/admin/placement-requests/${id}/related`, { headers });
      if (res.ok) {
        const data = await res.json();
        setRelated((prev) => ({ ...prev, [id]: data }));
      }
    } catch { /* ignore */ }
  }

  function handleExpand(id: string) {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      loadRelated(id);
    }
  }

  function handleExport() {
    fetch("/api/admin/placement-requests/export", { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "placement-requests.csv";
        a.click();
        URL.revokeObjectURL(a.href);
      });
  }

  const counts = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    denied: requests.filter((r) => r.status === "denied").length,
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            {["all", "pending", "approved", "denied"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded text-xs capitalize ${
                  statusFilter === f ? "bg-warmwhite/10 text-warmwhite" : "text-warmwhite/40 hover:text-warmwhite/70"
                }`}
              >
                {f} {f !== "all" && `(${counts[f as keyof typeof counts] ?? 0})`}
              </button>
            ))}
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent border border-warmwhite/20 rounded text-xs text-warmwhite px-2 py-1"
          >
            <option value="all">All Types</option>
            {Object.entries(TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-warmwhite/10 text-warmwhite/70 rounded text-xs hover:bg-warmwhite/20 hover:text-warmwhite transition-colors"
        >
          <Download className="h-3 w-3" />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: "Total", value: counts.total, color: "text-warmwhite" },
          { label: "Pending", value: counts.pending, color: "text-gold" },
          { label: "Approved", value: counts.approved, color: "text-risegreen" },
          { label: "Denied", value: counts.denied, color: "text-crimson" },
        ].map((s) => (
          <div key={s.label} className="bg-warmwhite/5 rounded-lg border border-warmwhite/10 p-3 text-center">
            <div className={`text-lg font-semibold ${s.color}`}>{s.value}</div>
            <div className="text-warmwhite/40 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-warmwhite/40 text-sm">Loading...</p>
      ) : error ? (
        <p className="text-crimson text-sm">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-warmwhite/40 text-sm">No placement requests found.</p>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <div key={req.id} className="bg-warmwhite/5 rounded-lg border border-warmwhite/10">
              <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => handleExpand(req.id)}
              >
                <div className="flex items-center gap-3 flex-wrap min-w-0">
                  <span className="text-warmwhite font-medium text-sm truncate">{req.submitterName}</span>
                  <span className="text-warmwhite/50 text-xs truncate">{req.playerName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${TYPE_COLORS[req.requestType] || "bg-warmwhite/10 text-warmwhite/50"}`}>
                    {TYPE_LABELS[req.requestType] || req.requestType}
                  </span>
                  <span className="text-warmwhite/35 text-xs">
                    {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[req.status] || "bg-warmwhite/10"}`}>
                    {req.status}
                  </span>
                  <select
                    value={req.status}
                    onChange={(e) => updateStatus(req.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent border border-warmwhite/20 rounded text-xs text-warmwhite px-2 py-1"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="denied">denied</option>
                  </select>
                </div>
              </div>

              {expanded === req.id && (
                <div className="px-4 pb-4 border-t border-warmwhite/10 pt-3 text-sm text-warmwhite/70">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div><strong className="text-warmwhite/50">Role:</strong> {req.submitterRole}</div>
                    <div><strong className="text-warmwhite/50">Email:</strong> {req.submitterEmail}</div>
                    <div><strong className="text-warmwhite/50">Phone:</strong> {req.submitterPhone}</div>
                    <div><strong className="text-warmwhite/50">Player:</strong> {req.playerName}</div>

                    {req.requestType === "pair_players" && (
                      <>
                        <div><strong className="text-warmwhite/50">Pair With:</strong> {req.otherPlayerName}</div>
                        {req.relationship && <div><strong className="text-warmwhite/50">Relationship:</strong> {req.relationship}</div>}
                      </>
                    )}
                    {req.requestType === "request_coach" && (
                      <>
                        <div><strong className="text-warmwhite/50">Coach:</strong> {req.coachName}</div>
                        {req.connectionReason && <div><strong className="text-warmwhite/50">Connection:</strong> {req.connectionReason}</div>}
                      </>
                    )}
                    {req.requestType === "schedule_needs" && (
                      <>
                        {req.availableDays && <div><strong className="text-warmwhite/50">Available:</strong> {req.availableDays}</div>}
                        {req.unavailableDays && <div><strong className="text-warmwhite/50">Unavailable:</strong> {req.unavailableDays}</div>}
                        {req.scheduleReason && <div className="col-span-2"><strong className="text-warmwhite/50">Reason:</strong> {req.scheduleReason}</div>}
                      </>
                    )}
                    {req.requestType === "coach_request_player" && (
                      <>
                        {req.coachName && <div><strong className="text-warmwhite/50">Coach:</strong> {req.coachName}</div>}
                        {req.additionalPlayerNames && <div className="col-span-2"><strong className="text-warmwhite/50">Additional Players:</strong> {req.additionalPlayerNames}</div>}
                      </>
                    )}
                    {req.notes && <div className="col-span-2"><strong className="text-warmwhite/50">Notes:</strong> {req.notes}</div>}
                    <div className="col-span-2 text-warmwhite/30 text-xs">
                      Submitted {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Related / Mutual Requests */}
                  {related[req.id] && related[req.id].length > 0 && (
                    <div className="mb-4 p-3 rounded-lg bg-iceblue/5 border border-iceblue/20">
                      <p className="text-iceblue text-xs font-medium mb-2">Mutual Requests Found</p>
                      {related[req.id].map((r) => (
                        <div key={r.id} className="flex items-center gap-2 text-xs text-warmwhite/60">
                          <span className="text-warmwhite/80">{r.submitterName}</span>
                          <span>&rarr;</span>
                          <span>{r.playerName} wants to pair with {r.otherPlayerName}</span>
                          <span className={`px-1.5 py-0.5 rounded ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Admin Notes */}
                  <div>
                    <label className="block text-warmwhite/50 text-xs mb-1">Admin Notes</label>
                    <div className="flex gap-2">
                      <textarea
                        value={editingNotes[req.id] ?? req.adminNotes ?? ""}
                        onChange={(e) => setEditingNotes((prev) => ({ ...prev, [req.id]: e.target.value }))}
                        placeholder="Internal notes..."
                        className="flex-1 bg-transparent border border-warmwhite/20 rounded px-3 py-2 text-warmwhite text-sm placeholder:text-warmwhite/30 min-h-[60px] resize-y"
                      />
                      <button
                        onClick={() => saveNotes(req.id)}
                        className="self-end px-3 py-2 bg-crimson text-warmwhite text-xs font-medium rounded hover:bg-crimson-dark transition-colors"
                      >
                        Save
                      </button>
                    </div>
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
