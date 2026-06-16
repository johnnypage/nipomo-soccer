import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Send, FileSpreadsheet } from "lucide-react";

/**
 * Admin tool: upload the weekly Spond Members export and forward completed registrations
 * to the Meta Conversions API. The server hashes the contact fields before sending (Meta
 * only ever receives SHA-256). Preview is safe; a test-event-code routes to Meta's Test
 * Events tab; a real send records each registration so re-uploads never double-count.
 */
export default function MetaCapiManager({ token }: { token: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [testCode, setTestCode] = useState("");
  const [preview, setPreview] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState<"" | "preview" | "send">("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function callApi(endpoint: "preview" | "send", withTest: boolean) {
    if (!file) { setError("Choose a Spond export first."); return null; }
    const fd = new FormData();
    fd.append("file", file);
    if (withTest && testCode.trim()) fd.append("testEventCode", testCode.trim());
    const res = await fetch(`/api/admin/meta-capi/${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // do NOT set Content-Type for FormData
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }

  async function handlePreview() {
    setError(""); setResult(null); setPreview(null); setLoading("preview");
    try { setPreview(await callApi("preview", false)); }
    catch (e: any) { setError(e.message); }
    finally { setLoading(""); }
  }

  async function handleSend() {
    setError(""); setResult(null); setLoading("send");
    try {
      const data = await callApi("send", true);
      if (data) setResult(data);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(""); }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="font-integral text-warmwhite text-xl uppercase tracking-wide mb-1">
          Registrations &rarr; Meta
        </h2>
        <p className="text-warmwhite/50 text-sm">
          Upload the weekly Spond <strong>Members</strong> export. Each enrolled kid is sent to the
          Meta pixel as a completed registration (contact info is hashed before sending). Re-uploading
          the same export is safe &mdash; already-sent registrations are skipped automatically.
        </p>
      </div>

      {/* File picker */}
      <div className="bg-slate/10 rounded-lg p-4 mb-4">
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => { setFile(e.target.files?.[0] || null); setPreview(null); setResult(null); setError(""); }}
        />
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <FileSpreadsheet className="h-4 w-4 mr-2" /> Choose Spond export
          </Button>
          <span className="text-warmwhite/70 text-sm truncate">
            {file ? file.name : "No file selected (.xlsx or .csv)"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <Button onClick={handlePreview} disabled={!file || loading !== ""} variant="secondary">
          {loading === "preview" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          Preview
        </Button>
        <div className="flex flex-col">
          <label className="text-warmwhite/40 text-xs mb-1">Test event code (optional &mdash; validates in Meta&rsquo;s Test Events tab)</label>
          <Input
            value={testCode}
            onChange={(e) => setTestCode(e.target.value)}
            placeholder="TESTxxxxx"
            className="w-48 h-9"
          />
        </div>
        <Button onClick={handleSend} disabled={!file || loading !== ""} className="bg-crimson hover:bg-crimson/80">
          {loading === "send" ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
          {testCode.trim() ? "Send (test)" : "Send to Meta"}
        </Button>
      </div>

      {error && (
        <div className="bg-crimson/15 text-crimson rounded-md px-4 py-3 text-sm mb-4">{error}</div>
      )}

      {/* Preview summary */}
      {preview && (
        <div className="bg-slate/10 rounded-lg p-4 mb-4 text-sm">
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-warmwhite/80">
            <span>Rows in file</span><span className="text-right">{preview.rowsInFile}</span>
            <span>Other program (filtered)</span><span className="text-right">{preview.droppedGroup}</span>
            <span>Siblings/dupes within file</span><span className="text-right">{preview.droppedDupeInFile}</span>
            <span>Already sent previously</span><span className="text-right">{preview.alreadySent}</span>
            <span className="font-bold text-warmwhite">New to send</span>
            <span className="text-right font-bold text-risegreen">{preview.newCount}</span>
          </div>
          <div className="text-warmwhite/40 text-xs mt-3">
            Matched contact column: <code>{preview.matchedColumns?.email || preview.matchedColumns?.phone || "?"}</code>
          </div>
          {preview.sample?.length > 0 && (
            <div className="mt-3 text-warmwhite/60 text-xs">
              <div className="mb-1">Sample of new registrations:</div>
              {preview.sample.map((s: any, i: number) => (
                <div key={i}>&bull; {s.name} &mdash; {s.email} {s.group ? `(${s.group})` : ""}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Send result */}
      {result && (
        <div className="bg-risegreen/15 rounded-lg p-4 text-sm text-warmwhite">
          {result.testMode && <div className="text-amber mb-1 font-medium">TEST MODE &mdash; check Events Manager &rarr; Test events</div>}
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            <span>New registrations sent</span><span className="text-right font-bold">{result.newCount}</span>
            <span>Events received by Meta</span><span className="text-right font-bold">{result.eventsReceived}</span>
            <span>Skipped (already sent)</span><span className="text-right">{result.alreadySent}</span>
          </div>
          {result.message && <div className="text-warmwhite/60 mt-2">{result.message}</div>}
          {result.messages?.length > 0 && (
            <pre className="text-warmwhite/50 text-xs mt-2 whitespace-pre-wrap">{JSON.stringify(result.messages, null, 2)}</pre>
          )}
          {!result.testMode && result.newCount > 0 && (
            <div className="text-warmwhite/60 mt-2 text-xs">Recorded in the dedup ledger &mdash; safe to re-upload next week.</div>
          )}
        </div>
      )}
    </div>
  );
}
