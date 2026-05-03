import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const TABS = [
  { id: "prek", label: "Pre-K", years: "Born 2021-2022" },
  { id: "g12", label: "1st-2nd", years: "Born 2019-2020" },
  { id: "g34", label: "3rd-4th", years: "Born 2017-2018" },
  { id: "g56", label: "5th-6th", years: "Born 2015-2016" },
  { id: "g78", label: "7th-8th", years: "Born 2013-2014" },
  { id: "hs", label: "High School", years: "Born 2010-2012" },
];

interface Coach {
  assignmentId: string;
  displayName: string;
  role: "head" | "assistant";
  headAssignmentId: string | null;
}

interface Division {
  id: string;
  ageGroup: string;
  gender: string;
  headCoachesNeeded: number;
  coaches: Coach[];
}

interface DashboardSectionProps {
  onApply: () => void;
}

const SAMPLE_DIVISIONS: Division[] = [
  { id: "s-prek-coed", ageGroup: "prek", gender: "coed", headCoachesNeeded: 8, coaches: [] },
  { id: "s-g12-girls", ageGroup: "g12", gender: "girls", headCoachesNeeded: 6, coaches: [] },
  { id: "s-g12-boys", ageGroup: "g12", gender: "boys", headCoachesNeeded: 6, coaches: [] },
  { id: "s-g34-girls", ageGroup: "g34", gender: "girls", headCoachesNeeded: 12, coaches: [] },
  { id: "s-g34-boys", ageGroup: "g34", gender: "boys", headCoachesNeeded: 12, coaches: [] },
  { id: "s-g56-girls", ageGroup: "g56", gender: "girls", headCoachesNeeded: 8, coaches: [] },
  { id: "s-g56-boys", ageGroup: "g56", gender: "boys", headCoachesNeeded: 10, coaches: [] },
  { id: "s-g78-girls", ageGroup: "g78", gender: "girls", headCoachesNeeded: 5, coaches: [] },
  { id: "s-g78-boys", ageGroup: "g78", gender: "boys", headCoachesNeeded: 7, coaches: [] },
  { id: "s-hs-girls", ageGroup: "hs", gender: "girls", headCoachesNeeded: 2, coaches: [] },
  { id: "s-hs-boys", ageGroup: "hs", gender: "boys", headCoachesNeeded: 2, coaches: [] },
];

function statusOf(headCount: number, needed: number) {
  if (headCount === 0) return "empty";
  if (headCount >= needed) return "staffed";
  return "needs";
}

function GenderColumn({
  title,
  headCoaches,
  assistants,
  needed,
  fallbackName,
  onApply,
}: {
  title: string;
  headCoaches: Coach[];
  assistants: Coach[];
  needed: number;
  fallbackName: string;
  onApply: () => void;
}) {
  const status = statusOf(headCoaches.length, needed);
  const isFull = status === "staffed";
  const isEmpty = status === "empty";
  const pct = needed > 0 ? Math.min(100, (headCoaches.length / needed) * 100) : 0;
  const openSlots = Math.max(0, needed - headCoaches.length);
  const visibleHead = headCoaches.slice(0, 8);
  const moreHead = Math.max(0, headCoaches.length - 8);
  const visibleHeadIds = new Set(visibleHead.map((c) => c.assignmentId));

  const unpairedAssistants = assistants.filter(
    (a) => !a.headAssignmentId || !visibleHeadIds.has(a.headAssignmentId)
  );

  function pairedAssistantsFor(assignmentId: string) {
    return assistants.filter((a) => a.headAssignmentId === assignmentId);
  }

  return (
    <div
      className={`coach-gender-col ${
        isEmpty ? "coach-gender-col--empty" : isFull ? "coach-gender-col--staffed" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-display text-warmwhite text-2xl uppercase tracking-wide">{title}</h4>
      </div>
      <div className="text-warmwhite/55 text-sm">
        <strong className={isFull ? "text-risegreen-light" : "text-gold"}>{headCoaches.length}</strong> / {needed} head coaches
      </div>

      <div className="coach-progress">
        <div
          className={`coach-progress__bar${isFull ? " coach-progress__bar--full" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {isFull && (
        <div className="flex items-center gap-2 text-risegreen text-sm font-medium mt-2">
          <span>✓</span> Fully staffed
        </div>
      )}

      {isEmpty ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gold/40 flex items-center justify-center text-gold text-xl mx-auto mb-3">
            +
          </div>
          <div className="text-warmwhite font-medium text-sm">No head coaches yet</div>
          <p className="text-warmwhite/40 text-xs mt-1 max-w-[240px] mx-auto">
            Be the first to coach {fallbackName} this season. We'll pair you with experienced coaches and cover your training.
          </p>
          <button
            data-testid="button-be-first"
            className="mt-4 px-4 py-2 bg-crimson text-warmwhite text-sm font-medium rounded-lg hover:bg-crimson-dark transition-colors"
            onClick={onApply}
          >
            Be the first <span aria-hidden="true">→</span>
          </button>
        </div>
      ) : (
        <>
          <div className="text-warmwhite/40 text-xs uppercase tracking-wider mt-4 mb-2">Coaches</div>
          <div className="space-y-1.5">
            {visibleHead.map((head) => {
              const pairedAssistants = pairedAssistantsFor(head.assignmentId);
              return (
                <div key={head.assignmentId} data-testid={`coach-head-${head.assignmentId}`} className="rounded-md bg-warmwhite/5 border border-warmwhite/10 overflow-hidden">
                  <div className="px-2.5 py-1.5 flex items-center justify-between">
                    <span className="text-xs text-warmwhite/80">{head.displayName}</span>
                    <span className="text-[10px] text-gold/60 uppercase tracking-wider font-medium">Head</span>
                  </div>
                  {pairedAssistants.map((asst) => (
                    <div
                      key={asst.assignmentId}
                      data-testid={`coach-assistant-paired-${asst.assignmentId}`}
                      className="px-2.5 py-1 flex items-center gap-1.5 bg-warmwhite/3 border-t border-warmwhite/8"
                    >
                      <span className="text-[10px] text-warmwhite/30 uppercase tracking-wider w-8">Asst</span>
                      <span className="text-xs text-warmwhite/55">{asst.displayName}</span>
                    </div>
                  ))}
                </div>
              );
            })}
            {moreHead > 0 && (
              <span className="inline-block px-2.5 py-1 text-xs rounded-md border border-dashed border-warmwhite/20 text-warmwhite/40">
                +{moreHead} more
              </span>
            )}
          </div>

          {/* Unassigned assistants and assistants whose head is beyond the visible slice */}
          {unpairedAssistants.length > 0 && (
            <>
              <div className="text-warmwhite/40 text-xs uppercase tracking-wider mt-4 mb-2">Additional assistants</div>
              <div className="flex flex-wrap gap-1.5">
                {unpairedAssistants.slice(0, 6).map((c) => (
                  <span
                    key={c.assignmentId}
                    data-testid={`coach-assistant-unpaired-${c.assignmentId}`}
                    className="px-2.5 py-1 text-xs rounded-md bg-warmwhite/5 border border-warmwhite/10 text-warmwhite/60"
                  >
                    {c.displayName}
                  </span>
                ))}
                {unpairedAssistants.length > 6 && (
                  <span className="px-2.5 py-1 text-xs rounded-md border border-dashed border-warmwhite/20 text-warmwhite/40">
                    +{unpairedAssistants.length - 6} more
                  </span>
                )}
              </div>
            </>
          )}

          {!isFull ? (
            <button
              data-testid="button-sign-up"
              className="mt-4 text-gold text-sm font-medium hover:text-gold/80 transition-colors"
              onClick={onApply}
            >
              {openSlots} open spot{openSlots > 1 ? "s" : ""} · Sign up <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              data-testid="button-join-assistant"
              className="mt-4 text-warmwhite/50 text-sm hover:text-warmwhite/70 transition-colors"
              onClick={onApply}
            >
              Join as an assistant <span aria-hidden="true">→</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default function DashboardSection({ onApply }: DashboardSectionProps) {
  const [active, setActive] = useState("g34");

  const { data, isLoading } = useQuery<{ divisions: Division[] }>({
    queryKey: ["/api/coaching-board"],
    queryFn: async () => {
      const res = await fetch("/api/coaching-board");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    staleTime: 30_000,
    retry: 1,
  });

  const divisions = data?.divisions?.length ? data.divisions : SAMPLE_DIVISIONS;
  const tabDivisions = divisions.filter((d) => d.ageGroup === active);
  const isCoed = active === "prek";

  function getTabStatus(tabId: string) {
    const divs = divisions.filter((d) => d.ageGroup === tabId);
    if (divs.length === 0) return "empty";
    const allStaffed = divs.every((d) => {
      const heads = d.coaches.filter((c) => c.role === "head").length;
      return heads >= d.headCoachesNeeded;
    });
    if (allStaffed) return "staffed";
    const anyEmpty = divs.some((d) => d.coaches.filter((c) => c.role === "head").length === 0);
    if (anyEmpty) return "empty";
    return "needs";
  }

  return (
    <section className="bg-night py-20" id="dashboard">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
              ROOTS Fall 2026
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
              See where coaches are needed
            </h2>
            <p className="text-warmwhite/55 mt-3 max-w-[500px]">
              This board updates as coaches sign up for the fall season. Take a look below
              to see who's already in and where we still have open spots. Pick your kid's
              grade level and find a spot that works for you.
            </p>
          </div>

        </div>

        <div className="flex flex-wrap gap-2 mt-8" role="tablist">
          {TABS.map((t) => {
            const status = getTabStatus(t.id);
            return (
              <button
                key={t.id}
                className={`px-4 py-2.5 rounded-lg border text-sm transition-colors ${
                  active === t.id
                    ? "border-gold bg-gold/10 text-warmwhite"
                    : "border-warmwhite/10 text-warmwhite/60 hover:border-warmwhite/30"
                }`}
                onClick={() => setActive(t.id)}
                role="tab"
                aria-selected={active === t.id}
              >
                <span className="font-display uppercase tracking-wide">{t.label}</span>
                <span className="font-mono text-warmwhite/40 text-[10px] uppercase tracking-widest ml-2 hidden sm:inline">{t.years}</span>
                <span
                  className={`inline-block w-2 h-2 rounded-full ml-2 ${
                    status === "staffed" ? "bg-risegreen-light" : status === "empty" ? "bg-crimson" : "bg-gold"
                  }`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="mt-8 text-warmwhite/40 text-center py-12">Loading coaching board...</div>
        ) : (
          <div
            className="coach-board__columns mt-6"
            style={{ gridTemplateColumns: isCoed ? "1fr" : "1fr 1fr" }}
          >
            {isCoed ? (
              tabDivisions[0] && (
                <GenderColumn
                  title="Co-ed"
                  headCoaches={tabDivisions[0].coaches.filter((c) => c.role === "head")}
                  assistants={tabDivisions[0].coaches.filter((c) => c.role === "assistant")}
                  needed={tabDivisions[0].headCoachesNeeded}
                  fallbackName={`${TABS.find((t) => t.id === active)?.label} Co-ed`}
                  onApply={onApply}
                />
              )
            ) : (
              <>
                {tabDivisions.map((d) => (
                    <GenderColumn
                      key={d.id}
                      title={d.gender === "girls" ? "Girls" : "Boys"}
                      headCoaches={d.coaches.filter((c) => c.role === "head")}
                      assistants={d.coaches.filter((c) => c.role === "assistant")}
                      needed={d.headCoachesNeeded}
                      fallbackName={`${TABS.find((t) => t.id === active)?.label} ${d.gender === "girls" ? "Girls" : "Boys"}`}
                      onApply={onApply}
                    />
                  ))}
              </>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <button
            className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
            onClick={onApply}
          >
            Claim a spot
          </button>
          <span className="text-warmwhite/40 text-xs flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-risegreen-light" />Staffed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-gold" />Spots open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-crimson" />No coach yet
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
