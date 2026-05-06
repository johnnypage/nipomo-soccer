import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowUpRight, X, Check, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { apiRequest } from "@/lib/queryClient";
import heroImg from "@assets/coach_huddle.png";

// ─── Types ───────────────────────────────────────────────────────────────────

type RoleStatus = "open" | "filled";

interface FilledBy {
  name: string;
  since: string;
  initials: string;
  photo?: string;
  photoPosition?: string;
  photoScale?: number;
  email?: string;
}

interface Role {
  id: string;
  title: string;
  desc: string;
  time: string;
  timeShort: string;
  status?: RoleStatus;
  filledBy?: FilledBy;
  summary: string;
  responsibilities: string[];
  worksWith: string;
  goodFit: string;
  paid?: boolean;
  compensation?: string;
}

interface RoleGroup {
  key: "leadership" | "team" | "gameday";
  anchor: string;
  eyebrow: string;
  title: string;
  description: string;
  roles: Role[];
}

// ─── Roles Data ──────────────────────────────────────────────────────────────

const ROLE_GROUPS: RoleGroup[] = [
  {
    key: "leadership",
    anchor: "leadership",
    eyebrow: "Season-Long Roles",
    title: "Leadership Team",
    description:
      "These are the people who make the season happen. It's a real commitment, and it's also one of the most rewarding things you can do with your time while your kids are young. Full training and support provided for every role.",
    roles: [
      {
        id: "program-director",
        title: "Program Director",
        desc: "Owns the player and volunteer experience for the entire program, from the first practice to the last game of the season.",
        time: "8 hrs/wk in-season",
        timeShort: "8 hrs/wk",
        status: "open",
        paid: true,
        compensation: "Depends on experience",
        summary: "Owns the player and volunteer experience for the entire program. The operational leader every family and volunteer reports through.",
        responsibilities: [
          "Own the player experience: every kid on the field should feel seen, developed, and part of something",
          "Own the volunteer experience: every volunteer should feel supported, trained, and clear on their role",
          "Ensure every volunteer role is filled and every person in it has what they need to succeed",
          "Build and maintain the full season schedule (Saturday games, weekday games, practice windows, makeup dates)",
          "Lead team formation from registration data, handling sibling requests and balanced composition",
          "Own parent escalations that coaches or Team Parents cannot resolve",
          "Run the end-of-season tournament (brackets, schedule, field assignments, scorekeeping)",
          "Make weather cancellation calls and coordinate communication",
          "Manage score tracking and standings, publish weekly",
          "Coordinate all leadership roles as the central hub, the person every other role checks in with",
        ],
        worksWith: "Everyone. This is the central node.",
        goodFit: "Organized, decisive, calm under pressure, respected in the community.",
      },
      {
        id: "coach-coordinator",
        title: "Coach Coordinator",
        desc: "Recruits, trains, equips, and supports every coach in the program.",
        time: "5-8 hrs/wk pre-season, 2-3 hrs/wk in-season",
        timeShort: "5-8 hrs/wk pre-season",
        status: "filled",
        filledBy: { name: "Johnny Page", since: "2024", initials: "JP", email: "johnny@nipomosc.org", photo: "/johnny-page.jpg", photoPosition: "center top" },
        summary: "Recruits, trains, and supports every coach in the program.",
        responsibilities: [
          "Lead coach recruiting before registration opens",
          "Plan and run the pre-season coach training clinic (curriculum, scheduling, venue, and delivery)",
          "Cover rules, practice planning, game-day expectations, player development, and code of conduct at the clinic",
          "Coordinate pre-season evaluation day (3rd grade and up) with coaches and Program Director",
          "Distribute coach gear: shirts, whistles, first aid kits, practice equipment",
          "Provide ongoing support during the season (troubleshooting, resources, check-ins)",
          "Coordinate with Safety Director to ensure every coach clears background checks",
          "Communicate tournament logistics and end-of-season info to all coaches",
        ],
        worksWith: "All coaches, Program Director, Safety Director",
        goodFit: "Connector, persuasive, soccer knowledge helpful but not required.",
      },
      {
        id: "referee-coordinator",
        title: "Referee Coordinator",
        desc: "Recruits, trains, and manages the referee workforce. Owns scheduling and game-day coverage for every match.",
        time: "~5 hrs/wk",
        timeShort: "~5 hrs/wk",
        status: "open",
        paid: true,
        compensation: "Depends on experience",
        summary: "Recruits, trains, and manages every referee in the program. No referees means no games. This role keeps the season running.",
        responsibilities: [
          "Recruit referees from within the community (parents, high school students) and externally",
          "Plan and run the pre-season referee training clinic (rules, positioning, mechanics, and conduct)",
          "Provide ongoing in-season coaching and support to develop referee quality",
          "Ensure all refs are properly certified or trained to the level required by Cal South",
          "Ensure refs have required gear (whistle, cards, uniform, rules reference)",
          "Create and manage the weekly ref schedule across all Saturday and weekday games",
          "Handle ref no-shows and last-minute coverage with a deep bench",
          "Coordinate with Treasurer on timely, accurate ref payments",
          "Develop a pipeline of new referees (parents, students, community members)",
        ],
        worksWith: "Treasurer, Program Director, all referees",
        goodFit: "Detail-oriented, reliable, good at logistics, calm on game day.",
      },
      {
        id: "safety-director",
        title: "Safety Director",
        desc: "Manages background checks, fingerprinting, and volunteer screening for every adult in the program.",
        time: "~15 hrs pre-season",
        timeShort: "~15 hrs pre-season",
        status: "filled",
        filledBy: { name: "Arturo Ruiz", since: "2025", initials: "AR", email: "Andres@nipomosc.org", photo: "/arturo-ruiz.jpeg", photoPosition: "center top" },
        summary: "Ensures every adult around our kids has been screened and cleared.",
        responsibilities: [
          "Manage the background check and fingerprinting process for all volunteers",
          "Arrange on-site fingerprinting events (at least one during pre-season at the fields)",
          "Maintain records of every volunteer's clearance status",
          "Have admin access to the registration and screening backend systems",
          "Review and communicate safety policies to coaches and volunteers during pre-season",
          "Ensure first aid kits are stocked and present at every game location",
          "Handle any safety incidents (documentation, follow-up, policy enforcement)",
        ],
        worksWith: "Coach Coordinator, all volunteers, registration system",
        goodFit: "Detail-oriented, compliance-minded, comfortable with sensitive information.",
      },
      {
        id: "facilities-lead",
        title: "Facilities Lead",
        desc: "Owns the fields, weekly painting, game-day setup logistics, and physical infrastructure.",
        time: "4-6 hrs/wk",
        timeShort: "4-6 hrs/wk",
        status: "open",
        summary: "Owns the fields, physical infrastructure, and oversees the facilities team.",
        responsibilities: [
          "Oversee weekly field painting (lines and markings across all active fields, midweek)",
          "Conduct pre-season field safety inspections (goals anchored, surfaces safe)",
          "Manage equipment storage access and coordinate with the school on field availability",
          "Open gates on game days and ensure facilities are accessible",
          "Direct the Saturday setup and teardown crew",
          "Handle mid-season equipment repairs and replacements",
          "Oversee Practice Field Coordinator and Equipment Manager",
        ],
        worksWith: "Practice Field Coordinator, Equipment Manager, Program Director, school administration",
        goodFit: "Hands-on, physically able, reliable, and doesn't mind early mornings.",
      },
      {
        id: "practice-field",
        title: "Practice Field Coordinator",
        desc: "Assigns practice fields and times to all teams so coaches aren't competing for space.",
        time: "6-8 hrs pre-season, 1-2 hrs/wk in-season",
        timeShort: "6-8 hrs pre-season",
        status: "open",
        summary: "Assigns practice fields and times to all teams so coaches aren't competing for space.",
        responsibilities: [
          "Build the full practice schedule before the season starts",
          "Map every team to specific fields and time slots based on division and available space",
          "Manage field availability across Nipomo High School and other locations",
          "Handle schedule conflicts and change requests quickly",
          "Communicate the practice schedule to coaches and Team Parents",
          "Coordinate with the school on restrictions, blackout dates, and access requirements",
          "Balance load across locations so no single field is overused",
        ],
        worksWith: "All coaches, Program Director, Facilities Lead, school administration",
        goodFit: "Organized, good with spreadsheets, responsive to change requests.",
      },
      {
        id: "equipment-manager",
        title: "Equipment Manager",
        desc: "Procures, builds team kits, distributes, and collects all equipment for the season.",
        time: "8-12 hrs pre-season, 1-2 hrs/wk in-season",
        timeShort: "8-12 hrs pre-season",
        status: "open",
        summary: "Procures, distributes, and collects all team equipment for the season.",
        responsibilities: [
          "Audit pre-season inventory: balls, bags, pumps, cones, pinnies, first aid kits",
          "Order all equipment based on team count and division needs",
          "Build and distribute team equipment kits for every coach",
          "Run equipment distribution day (coordinate with Coach Coordinator for pickup)",
          "Handle mid-season replacement requests",
          "Run end-of-season collection, inventory returns, and store for next season",
          "Coordinate jersey ordering and distribution with the jersey vendor",
        ],
        worksWith: "Treasurer, Coach Coordinator, Facilities Lead, jersey vendor",
        goodFit: "Organized, detail-oriented, comfortable with logistics and inventory.",
      },
      {
        id: "communications-lead",
        title: "Communications Lead",
        desc: "Sends the weekly parent email, manages social media, and handles all outbound messaging.",
        time: "3-5 hrs/wk",
        timeShort: "3-5 hrs/wk",
        status: "filled",
        filledBy: { name: "Ashley Page", since: "2024", initials: "AP", email: "ashley@nipomosc.org", photo: "/ashley-page.jpg", photoPosition: "center top" },
        summary: "The voice of the program to every registered family.",
        responsibilities: [
          "Send a weekly email to all registered families (schedule updates, reminders, highlights)",
          "Manage social media during the season (game-day content, community highlights)",
          "Create pre-season communications (welcome emails, logistics guides, expectations)",
          "Coordinate with Team Parents on messaging consistency",
          "Handle weather cancellation communications with Program Director",
          "Create field signage (schedules, field maps, sponsor recognition, wayfinding)",
          "Coordinate with Sponsorship Coordinator on sponsor shoutouts",
        ],
        worksWith: "Program Director, Team Parents, Sponsorship Coordinator",
        goodFit: "Good writer, consistent, social media savvy.",
      },
      {
        id: "secretary",
        title: "Secretary",
        desc: "Monitors the inbox, triages parent questions, and routes issues to the right person.",
        time: "3-5 hrs/wk",
        timeShort: "3-5 hrs/wk",
        status: "filled",
        filledBy: { name: "Kacie Lopez", since: "2026", initials: "KL", photo: "/kacie-lopez.jpeg", photoPosition: "center top" },
        summary: "First point of contact for every inbound question and issue.",
        responsibilities: [
          "Monitor and respond to the admin inbox daily",
          "Perform first-round triage (answer simple questions directly, route complex issues)",
          "Track issue resolution so nothing falls through the cracks",
          "Maintain the leadership contact directory",
          "Handle registration support questions (payment issues, transfer requests, waitlist)",
        ],
        worksWith: "All leadership members, parents",
        goodFit: "Responsive, organized, good communicator, patient.",
      },
      {
        id: "treasurer",
        title: "Treasurer",
        desc: "Tracks registration revenue, manages referee payments, and handles all financials.",
        time: "2-4 hrs/wk",
        timeShort: "2-4 hrs/wk",
        status: "filled",
        filledBy: { name: "Andres Lopez", since: "2025", initials: "AL", email: "Andres@nipomosc.org" },
        summary: "Manages all money in and out of the program.",
        responsibilities: [
          "Track all registration revenue",
          "Manage the referee payment system (timely, accurate payment is critical)",
          "Collect food vendor fees and track against the vendor schedule",
          "Track sponsorship revenue and coordinate with Sponsorship Coordinator",
          "Manage equipment and supply purchases",
          "Handle any scholarship or financial aid funds",
          "Provide financial reports to the board",
        ],
        worksWith: "Referee Coordinator, Sponsorship Coordinator, Vendor Coordinator, Program Director",
        goodFit: "Detail-oriented, trustworthy, comfortable with spreadsheets.",
      },
      {
        id: "sponsorship",
        title: "Sponsorship Coordinator",
        desc: "Primary point of contact for all sponsors. Sells, delivers on, and shows appreciation for every sponsorship.",
        time: "5-10 hrs pre-season, 1 hr/wk in-season",
        timeShort: "5-10 hrs pre-season + 1 hr/wk",
        status: "filled",
        filledBy: { name: "Taylor Rhea", since: "2026", initials: "TR", photo: "/taylor-rhea.jpeg", photoPosition: "center top" },
        summary: "The primary liaison for all club sponsors. Sells sponsorships, delivers on them, and shows appreciation.",
        responsibilities: [
          "Serve as the main point of contact for all interested and active sponsors",
          "Sell sponsorship packages and close deals with local businesses",
          "Coordinate with other volunteers who help recruit sponsors (many people open doors, you close and manage)",
          "Deliver on sponsorship commitments (signage, recognition, logo placement, game-day presence)",
          "Manage sponsor relationships throughout the season (check-ins, invites, thank-yous)",
          "Ensure sponsor recognition across channels (social, email, signage, events)",
          "Track sponsorship revenue with Treasurer and identify new opportunities",
        ],
        worksWith: "Treasurer, Communications Lead, all volunteers who recruit sponsors",
        goodFit: "Sales-oriented, relationship builder, connected in the community.",
      },
      {
        id: "vendor-events",
        title: "Vendor & Events Coordinator",
        desc: "Recruits and schedules food vendors for game days, organizes photo day, and coordinates event logistics.",
        time: "1-2 hrs/wk",
        timeShort: "1-2 hrs/wk",
        status: "open",
        summary: "Manages food vendors, photo day, and seasonal event logistics.",
        responsibilities: [
          "Recruit and schedule food vendors for Saturday game days",
          "Prevent vendor overlap (no two vendors selling the same thing on the same Saturday)",
          "Coordinate field gate access for vendors with Facilities Lead",
          "Collect vendor fees and pass to Treasurer",
          "Organize photo day (book photographer, create team schedule, coordinate with Team Parents)",
          "Announce vendor presence to families through Communications Lead",
          "Coordinate trophy and medal ordering with Program Director and Equipment Manager",
        ],
        worksWith: "Treasurer, Communications Lead, Facilities Lead, Team Parents",
        goodFit: "Organized, good at coordinating multiple parties, detail-oriented.",
      },
    ],
  },
  {
    key: "team",
    anchor: "team",
    eyebrow: "Per-Team Roles",
    title: "Team Roles",
    description:
      "Every team needs a coach and a Team Parent working together. The coach handles the field. The Team Parent handles the logistics. No experience required for either. We train all of our coaches and support every Team Parent through the season.",
    roles: [
      {
        id: "head-coach",
        title: "Head Coach",
        desc: "Leads practices, manages games, develops players, and represents the team on the field.",
        time: "4-6 hrs/wk (practices + games)",
        timeShort: "4-6 hrs/wk",
        status: "open",
        summary: "Leads the team on the field all season.",
        responsibilities: [
          "Plan and run weekly practices (1-2 per week depending on division)",
          "Manage game-day lineup, substitutions, and in-game decisions",
          "Develop players and foster a positive team culture",
          "Communicate with Team Parent on logistics, scores, and parent issues",
          "Attend pre-season coach training day",
          "Complete background check and any required certifications",
          "Represent the club code of conduct on and off the field",
        ],
        worksWith: "Team Parent, Coach Coordinator, Assistant Coach",
        goodFit: "Patient, positive, interested in player development. Soccer experience helpful but we train everyone.",
      },
      {
        id: "team-parent",
        title: "Team Parent",
        desc: "The logistics backbone of each team. Handles communications, schedules, and the sideline experience.",
        time: "~30 min/wk",
        timeShort: "~30 min/wk",
        status: "open",
        summary: "The logistics hub for the team -- keeping parents informed and the sideline running smoothly.",
        responsibilities: [
          "Maintain team communication channel (Spond, GroupMe, or similar)",
          "Distribute weekly schedule, field locations, and reminders",
          "Coordinate snack schedule if the team does end-of-game snacks",
          "Collect and submit any paperwork or fees to the appropriate coordinator",
          "Be a first point of contact for team-level parent concerns",
          "Help with photo day coordination and any team-specific events",
        ],
        worksWith: "Head Coach, Vendor Coordinator, Communications Lead",
        goodFit: "Organized, responsive, comfortable with group messaging apps.",
      },
      {
        id: "assistant-coach",
        title: "Assistant Coach",
        desc: "Supports the Head Coach at practices and games. Great entry point for anyone curious about coaching.",
        time: "2-3 hrs/wk",
        timeShort: "2-3 hrs/wk",
        status: "open",
        summary: "Supports the Head Coach and helps deliver a great experience for every player.",
        responsibilities: [
          "Assist the Head Coach at all practices and games",
          "Help manage player rotations and substitutions on game day",
          "Run warm-ups or drill stations during practice",
          "Be available as backup if the Head Coach is absent",
          "Complete background check requirements",
          "Available, good with kids, willing to learn. Soccer experience welcome but not required.",
        ],
        worksWith: "Head Coach, Team Parent",
        goodFit: "Available, good with kids, willing to learn. Soccer experience welcome but not required.",
      },
    ],
  },
  {
    key: "gameday",
    anchor: "gameday",
    eyebrow: "A Day or Two Per Season",
    title: "Game Day Help",
    description:
      "Already at the field on Saturdays? You're halfway there. These are single shifts that take less than an hour. Pick a Saturday, show up a little early or stay a little late, and you've made the whole day run smoother for every family there.",
    roles: [
      {
        id: "saturday-setup",
        title: "Saturday Setup Crew",
        desc: "Arrive 45 minutes before the first game. Position goals, set corner flags, place benches across all fields.",
        time: "One Saturday morning, about 45 minutes",
        timeShort: "~45 min, one Saturday",
        summary: "Gets the fields ready before the first whistle.",
        responsibilities: [
          "Arrive 45 minutes before the first game",
          "Position goals on all active fields",
          "Set corner flags at each field",
          "Place team benches and any field markers",
          "Follow directions from the Facilities Lead on where everything goes",
        ],
        worksWith: "Facilities Lead, other setup families",
        goodFit: "Physically able, can arrive early on a Saturday.",
      },
      {
        id: "saturday-teardown",
        title: "Saturday Teardown Crew",
        desc: "Stay 45 minutes after the last game. Pack up goals, collect flags, stack benches.",
        time: "One Saturday afternoon, about 45 minutes",
        timeShort: "~45 min, one Saturday",
        summary: "Packs everything up after the last game.",
        responsibilities: [
          "Stay 45 minutes after the last game ends",
          "Take down and store goals",
          "Collect corner flags from all fields",
          "Stack benches and secure all equipment in storage",
          "Follow directions from the Facilities Lead",
        ],
        worksWith: "Facilities Lead, other teardown families",
        goodFit: "Physically able, can stay after games on one Saturday.",
      },
      {
        id: "field-monitor",
        title: "Field Monitor",
        desc: "Roam the fields during games. General safety, help families find their field, handle small issues.",
        time: "One Saturday, during game hours",
        timeShort: "One Saturday",
        summary: "Roaming support during Saturday games.",
        responsibilities: [
          "Walk the fields during game hours",
          "Help families find their assigned field",
          "Watch for general safety issues and report to Facilities Lead",
          "Be a visible point of contact for questions or concerns",
          "Assist with small issues (lost items, minor disputes, wayfinding)",
        ],
        worksWith: "Facilities Lead, Team Parents",
        goodFit: "Friendly, approachable, comfortable talking to people.",
      },
    ],
  },
];

const ALL_ROLES = ROLE_GROUPS.flatMap((g) => g.roles);

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: RoleStatus }) {
  if (!status) return null;
  if (status === "filled") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1a4d2e]/40 border border-[#2d7a4f]/60 font-heading font-bold text-[10.5px] tracking-[0.16em] uppercase text-[#4ade80]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
        Filled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-crimson/[0.18] border border-crimson/45 font-heading font-bold text-[10.5px] tracking-[0.16em] uppercase text-[#E07880]">
      <span className="w-1.5 h-1.5 rounded-full bg-crimson shadow-[0_0_0_3px_rgba(139,29,36,0.18)]" />
      Open
    </span>
  );
}

function RoleCard({
  role,
  index,
  onClick,
}: {
  role: Role;
  index: number;
  onClick: (role: Role) => void;
}) {
  const isFilled = role.status === "filled";

  return (
    <button
      onClick={() => onClick(role)}
      className={`group relative text-left flex flex-col gap-3 p-6 rounded-lg border transition-all duration-[220ms] ease-out min-h-[200px] cursor-pointer ${
        isFilled
          ? "bg-[#131313] border-warmwhite/[0.08] hover:border-gold/45"
          : "bg-[#161616] border-warmwhite/[0.08] hover:-translate-y-0.5 hover:border-crimson/55 hover:bg-[#1c1c1c]"
      }`}
      data-testid={`card-role-${role.id}`}
      aria-label={`View role: ${role.title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading font-bold text-[19px] leading-[1.18] text-warmwhite">
          {role.title}
        </h3>
        <StatusBadge status={role.status} />
      </div>
      {role.paid && (
        <p className="text-gold text-[13px] font-heading font-semibold -mt-1">Paid Position</p>
      )}
      <p className="text-[14px] leading-[1.55] text-warmwhite/68 flex-1">{role.desc}</p>
      <div className="flex items-center justify-between gap-3 pt-3 mt-auto border-t border-warmwhite/[0.08]">
        <span className="font-heading font-semibold text-[11.5px] tracking-[0.10em] uppercase text-warmwhite/65">
          {role.timeShort}
        </span>
        <span className="text-warmwhite/55 group-hover:text-crimson group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-[220ms]">
          <ArrowUpRight className="w-[18px] h-[18px]" />
        </span>
      </div>
    </button>
  );
}

// ─── Volunteer Form ───────────────────────────────────────────────────────────

type FormState = "idle" | "submitting" | "success" | "error";

function VolunteerForm({ role, onSubmitted }: { role: Role; onSubmitted: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [why, setWhy] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");
    try {
      await apiRequest("POST", "/api/volunteer-application", {
        roleId: role.id,
        roleTitle: role.title,
        name,
        email,
        phone,
        whyGoodFit: why || undefined,
      });
      setFormState("success");
      onSubmitted();
    } catch (err: any) {
      setFormState("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "w-full bg-night border border-warmwhite/[0.18] text-warmwhite placeholder:text-warmwhite/35 text-[15px] px-3.5 py-3 rounded-lg transition-all duration-150 outline-none focus:border-crimson focus:ring-2 focus:ring-crimson/25";
  const labelClass =
    "block font-heading font-bold text-[11px] tracking-[0.14em] uppercase text-warmwhite/65 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4" data-testid="form-volunteer">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-name" className={labelClass}>Your Name</label>
          <input
            id="vol-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First and last"
            className={inputClass}
            data-testid="input-vol-name"
          />
        </div>
        <div>
          <label htmlFor="vol-email" className={labelClass}>Email Address</label>
          <input
            id="vol-email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClass}
            data-testid="input-vol-email"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vol-phone" className={labelClass}>Phone Number</label>
          <input
            id="vol-phone"
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(805) 555-0123"
            className={inputClass}
            data-testid="input-vol-phone"
          />
        </div>
        <div>
          <label className={labelClass}>Role</label>
          <input
            readOnly
            value={role.title}
            className={`${inputClass} bg-warmwhite/[0.04] font-semibold cursor-default`}
            data-testid="input-vol-role"
          />
        </div>
      </div>
      <div>
        <label htmlFor="vol-why" className={labelClass}>Why are you a good fit? (optional)</label>
        <textarea
          id="vol-why"
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="A few words about your background, availability, or what draws you to this role."
          rows={3}
          className={`${inputClass} resize-y`}
          data-testid="textarea-vol-why"
        />
      </div>
      {formState === "error" && (
        <p className="text-[13px] text-red-400">{errorMsg}</p>
      )}
      <div className="flex items-center gap-3 mt-1">
        <button
          type="submit"
          disabled={formState === "submitting"}
          className="inline-flex items-center gap-2.5 bg-crimson hover:bg-crimson-dark disabled:opacity-60 text-warmwhite px-5 py-3.5 rounded-lg font-heading font-bold text-[14px] transition-colors duration-[220ms]"
          data-testid="button-vol-submit"
        >
          {formState === "submitting" ? "Submitting..." : "Send Application"}
          {formState !== "submitting" && <ArrowRight className="w-4 h-4" />}
        </button>
        <span className="text-[12px] text-warmwhite/50">Replies within a few days.</span>
      </div>
    </form>
  );
}

// ─── Role Modal ───────────────────────────────────────────────────────────────

function RoleModal({ role, onClose }: { role: Role; onClose: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isFilled = role.status === "filled";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-[rgba(5,5,5,0.82)] backdrop-blur-md animate-in fade-in duration-[220ms]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-[880px] max-h-[88vh] overflow-y-auto bg-[#161616] border border-warmwhite/[0.08] rounded-lg shadow-[0_24px_40px_-12px_rgba(0,0,0,0.55)] animate-in fade-in zoom-in-95 duration-[320ms]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-night/60 border border-warmwhite/[0.08] rounded-lg text-warmwhite/60 hover:text-warmwhite transition-colors"
          data-testid="button-modal-close"
        >
          <X className="w-4.5 h-4.5" />
        </button>

        {/* Modal Header */}
        <div className="px-6 sm:px-11 pt-10 pb-7 border-b border-warmwhite/[0.08] bg-gradient-to-b from-crimson/[0.08] to-transparent">
          <div className="flex items-center gap-2 mb-3 font-heading font-bold text-[11px] tracking-[0.18em] uppercase text-warmwhite/55">
            Volunteer Role
            <span className="text-crimson mx-1">·</span>
            <StatusBadge status={role.status} />
          </div>
          <h2
            id="modal-title"
            className="font-integral font-bold uppercase text-warmwhite leading-none mb-3.5"
            style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
          >
            {role.title}
          </h2>
          <p className="text-[17px] italic leading-[1.55] text-warmwhite/78 max-w-[58ch]">
            {role.summary}
          </p>
        </div>

        {/* Modal Body */}
        <div className="px-6 sm:px-11 py-8">
          {/* Responsibilities */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2.5 font-heading font-bold text-[11px] tracking-[0.18em] uppercase text-crimson mb-4">
              <span className="w-7 h-0.5 bg-crimson" />
              What You'll Do
            </div>
            <ul className="flex flex-col gap-2.5">
              {role.responsibilities.map((item, i) => (
                <li
                  key={i}
                  className="grid gap-2 text-[15px] leading-[1.55] text-warmwhite/85"
                  style={{ gridTemplateColumns: "20px 1fr" }}
                >
                  <span
                    className="w-1.5 h-1.5 bg-crimson rounded-[1px] shrink-0 mt-[9px]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Paid banner */}
          {role.paid && (
            <div className="flex items-center gap-4 bg-gold/[0.08] border border-gold/35 rounded-lg px-5 py-4 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <div>
                <span className="font-heading font-bold text-[11px] tracking-[0.16em] uppercase text-gold">Paid Position</span>
                <span className="text-warmwhite/60 text-[13px] ml-3">One of two paid roles in the organization. Compensation depends on experience.</span>
              </div>
            </div>
          )}

          {/* Meta grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-lg border border-warmwhite/[0.08] mb-8 divide-y sm:divide-y-0 sm:divide-x divide-warmwhite/[0.08]">
            {[
              { k: "Time Commitment", v: role.time },
              { k: "You'll Work With", v: role.worksWith },
              { k: "Good Fit If You're", v: role.goodFit },
            ].map(({ k, v }) => (
              <div key={k} className="bg-[#1c1c1c] px-5 py-4">
                <div className="font-heading font-bold text-[10.5px] tracking-[0.16em] uppercase text-warmwhite/55 mb-1.5">
                  {k}
                </div>
                <div className="text-[14px] leading-[1.45] text-warmwhite">{v}</div>
              </div>
            ))}
          </div>

          {/* Status zone */}
          {isFilled && role.filledBy ? (
            <div className="flex items-center gap-6 p-7 bg-[#131313] border border-gold/35 rounded-lg">
              <div className="w-[88px] h-[88px] shrink-0 rounded-full border-2 border-gold overflow-hidden bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                {role.filledBy.photo ? (
                  <img
                    src={role.filledBy.photo}
                    alt={role.filledBy.name}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: role.filledBy.photoPosition ?? "center top",
                      transform: role.filledBy.photoScale ? `scale(${role.filledBy.photoScale})` : undefined,
                      transformOrigin: role.filledBy.photoPosition ?? "center top",
                    }}
                  />
                ) : (
                  <span className="font-integral font-bold text-[28px] text-gold tracking-[0.02em]">
                    {role.filledBy.initials}
                  </span>
                )}
              </div>
              <div>
                <p className="font-heading font-bold text-[20px] text-warmwhite mb-0.5">{role.filledBy.name}</p>
                {role.filledBy.email && (
                  <a href={`mailto:${role.filledBy.email}`} className="font-heading text-[13px] text-gold/75 hover:text-gold transition-colors block mb-1">
                    {role.filledBy.email}
                  </a>
                )}
                <p className="font-heading font-semibold text-[12px] tracking-[0.14em] uppercase text-gold">
                  Serving since {role.filledBy.since}
                </p>
              </div>
            </div>
          ) : submitted ? (
            <div className="p-7 bg-[#131313] border border-crimson/45 rounded-lg">
              <div className="w-11 h-11 rounded-full bg-crimson/18 flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-[#E07880]" strokeWidth={2.5} />
              </div>
              <h4 className="font-integral font-bold text-[22px] uppercase text-warmwhite mb-2">Thanks!</h4>
              <p className="text-[15px] leading-[1.55] text-warmwhite/75 max-w-[48ch]">
                We'll review your interest and follow up within a few days.
              </p>
            </div>
          ) : (
            <div className="p-7 bg-[#131313] border border-crimson/45 rounded-lg">
              {!showForm ? (
                <div>
                  <p className="font-heading font-semibold text-[13px] text-warmwhite/85 mb-4">
                    This role is open.
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2.5 bg-crimson hover:bg-crimson-dark text-warmwhite px-5 py-3.5 rounded-lg font-heading font-bold text-[14px] transition-colors duration-[220ms]"
                    data-testid="button-show-form"
                  >
                    Volunteer for This Role
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <VolunteerForm role={role} onSubmitted={() => setSubmitted(true)} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Role Section ─────────────────────────────────────────────────────────────

function RoleSection({
  group,
  alt,
  onOpen,
}: {
  group: RoleGroup;
  alt: boolean;
  onOpen: (role: Role) => void;
}) {
  const openCount = group.roles.filter((r) => r.status === "open").length;
  const filledCount = group.roles.length - openCount;

  return (
    <section
      id={group.anchor}
      className={`py-20 sm:py-24 ${alt ? "bg-[#111111]" : "bg-night"}`}
      style={{ scrollMarginTop: "120px" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12 mb-10">
          <div className="shrink-0">
            <div className="font-heading font-bold text-[11px] tracking-[0.18em] uppercase text-crimson mb-2">
              {group.eyebrow}
            </div>
            <h2
              className="font-integral font-bold uppercase text-warmwhite leading-none"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              {group.title}
            </h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="w-2 h-2 rounded-full bg-crimson" />
              <span className="font-heading font-semibold text-[12px] text-warmwhite/65">
                {openCount} Open
              </span>
              {filledCount > 0 && (
                <span className="font-heading font-semibold text-[12px] text-warmwhite/40">
                  · {filledCount} Filled
                </span>
              )}
              <span className="text-warmwhite/30 mx-0.5">·</span>
              <span className="font-heading font-semibold text-[12px] text-warmwhite/40">
                {group.roles.length} Total
              </span>
            </div>
          </div>
          <p className="text-[16px] leading-[1.6] text-warmwhite/65 max-w-[52ch] md:pb-1">
            {group.description}
          </p>
        </header>
        <div
          className={`grid gap-4 ${
            group.roles.length <= 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {group.roles.map((role, i) => (
            <RoleCard key={role.id} role={role} index={i} onClick={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Volunteer() {
  const [activeRole, setActiveRole] = useState<Role | null>(null);

  const openRole = useCallback((role: Role) => setActiveRole(role), []);
  const closeRole = useCallback(() => setActiveRole(null), []);

  useEffect(() => {
    const ogImage = window.location.origin + heroImg;
    const metaTags: Record<string, string> = {
      "og:image": ogImage,
      "og:image:width": "1200",
      "og:image:height": "630",
      "twitter:image": ogImage,
      "twitter:card": "summary_large_image",
    };
    Object.entries(metaTags).forEach(([key, value]) => {
      const attr = key.startsWith("twitter:") ? "name" : "property";
      let tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", value);
    });
    return () => {
      const fallback = window.location.origin + "/nsc-logo-og.png";
      ["og:image", "twitter:image"].forEach((key) => {
        const attr = key.startsWith("twitter:") ? "name" : "property";
        const tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
        if (tag) tag.setAttribute("content", fallback);
      });
    };
  }, []);

  const openCount = ALL_ROLES.filter((r) => r.status === "open").length;
  const filledCount = ALL_ROLES.filter((r) => r.status === "filled").length;

  const handleScrollTo = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-night text-warmwhite">
      <Header />

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex items-end pb-16 sm:pb-20"
        style={{ paddingTop: "112px" }}
        data-testid="section-hero"
      >
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "200% auto", backgroundPosition: "5% 50%" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(13,13,13,0.97) 0%, rgba(13,13,13,0.93) 28%, rgba(13,13,13,0.35) 46%, rgba(13,13,13,0.08) 65%, rgba(13,13,13,0.04) 100%)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-night/55" aria-hidden="true" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="font-heading font-bold text-[11px] tracking-[0.24em] uppercase text-warmwhite/70 mb-4">
              Get Involved
            </div>
            <h1
              className="font-integral font-bold uppercase text-warmwhite leading-[0.92] mb-6"
              style={{ fontSize: "clamp(36px, 4.5vw, 66px)" }}
              data-testid="heading-hero"
            >
              Let's Do This
              <br />
              <span className="text-crimson italic">Together</span>
            </h1>
            <p className="text-[17px] sm:text-[19px] leading-[1.55] text-warmwhite/80 max-w-[52ch] mb-8">
              Nipomo Soccer exists because families decided to build something together. Every season, every game, every kid on that field is there because someone stepped up. This page is how you find your spot.
            </p>
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 font-heading font-semibold text-[14px]">
              <span className="text-warmwhite/70">
                <b className="font-integral text-[28px] text-warmwhite leading-none mr-1">{openCount}</b>
                Open Roles
              </span>
              <span className="text-warmwhite/40" aria-hidden="true">·</span>
              <span className="text-warmwhite/70">
                <b className="font-integral text-[28px] text-warmwhite leading-none mr-1">{filledCount}</b>
                Filled
              </span>
              <span className="text-warmwhite/40" aria-hidden="true">·</span>
              <span className="text-warmwhite/70">
                <b className="font-integral text-[28px] text-warmwhite leading-none mr-1">650</b>
                Players Served
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values Quote ── */}
      <section className="bg-paper py-16 sm:py-20" data-testid="section-values">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            <div className="w-1 shrink-0 bg-crimson rounded-full" aria-hidden="true" />
            <blockquote className="text-[19px] sm:text-[22px] leading-[1.6] italic text-night/85 font-[Inter,sans-serif]">
              We believe every kid in Nipomo deserves quality soccer close to home. We believe development matters more than trophies and community matters more than ego. If that sounds like you, keep reading.
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Three-Column Message ── */}
      <section className="bg-night py-20 sm:py-24 border-t border-warmwhite/[0.06]" data-testid="section-three-col">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                num: "01",
                title: "Your Kids Are Watching",
                body: "When you show up for your community, your kids notice. They see what it looks like to give your time to something bigger than yourself. The soccer is great. The example you set by being part of it is what they'll remember.",
              },
              {
                num: "02",
                title: "We Train Everyone",
                body: "What matters is commitment and follow-through. We have training, documentation, and hands-on support for every role on this page. You don't need a background in any of this. You just need to show up ready to learn.",
              },
              {
                num: "03",
                title: "We Actually Enjoy This",
                body: "Everyone on the leadership team is in a similar stage of life. Young kids, stretched thin, trying to make the most of these years while our kids are still young enough to think we're cool. We have a genuinely good time running this together and we'd love more people at the table.",
              },
            ].map(({ num, title, body }) => (
              <div key={num} className="flex flex-col gap-4">
                <div className="font-integral font-bold text-[48px] leading-none text-crimson">{num}</div>
                <h3 className="font-heading font-bold text-[18px] text-warmwhite leading-[1.25]">{title}</h3>
                <p className="text-[15px] leading-[1.6] text-warmwhite/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Find Your Spot ── */}
      <section className="bg-[#0a0a0a] py-20 sm:py-28 border-t border-warmwhite/[0.06]" data-testid="section-find-spot">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16 mb-12">
            <div className="shrink-0">
              <div className="font-heading font-bold text-[11px] tracking-[0.22em] uppercase text-warmwhite/50 mb-4">
                The Volunteer Roster
              </div>
              <h2
                className="font-integral font-bold uppercase leading-[0.86] text-warmwhite"
                style={{ fontSize: "clamp(56px, 10vw, 130px)" }}
              >
                Find Your
                <br />
                <span className="text-crimson italic">Spot.</span>
              </h2>
            </div>
            <p className="text-[17px] leading-[1.6] text-warmwhite/65 max-w-[48ch] lg:pb-2">
              There are a lot of ways to help. Some are a single Saturday. Some are all season.{" "}
              <strong className="text-warmwhite font-semibold">Start wherever makes sense for you.</strong>{" "}
              The people who help on one game day often come back for more, and that's how this thing grows.
            </p>
          </div>

          {/* Sub-nav cards */}
          <nav className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Volunteer roles">
            {[
              {
                num: "01",
                label: "Season-Long",
                title: "Leadership Team",
                count: "11 Open · 1 Filled",
                anchor: "leadership",
              },
              {
                num: "02",
                label: "Per-Team",
                title: "Team Roles",
                count: "Filled via Coach Coordinator",
                anchor: "team",
              },
              {
                num: "03",
                label: "A Day or Two",
                title: "Game Day Help",
                count: "Coordinated by Team Managers",
                anchor: "gameday",
              },
            ].map(({ num, label, title, count, anchor }) => (
              <button
                key={anchor}
                onClick={() => handleScrollTo(anchor)}
                className="group flex items-center gap-4 p-5 bg-[#0f0f0f] border border-warmwhite/[0.08] rounded-lg text-left hover:bg-[#161616] hover:border-crimson/30 transition-all duration-[280ms]"
                data-testid={`nav-subnav-${anchor}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-integral text-[13px] tracking-[0.10em] text-warmwhite/40 mb-0.5">{num}</div>
                  <div className="font-heading font-semibold text-[11px] tracking-[0.14em] uppercase text-warmwhite/50 mb-1">{label}</div>
                  <div className="font-heading font-bold text-[16px] text-warmwhite leading-tight mb-1">{title}</div>
                  <div className="font-heading text-[12px] text-warmwhite/45">{count}</div>
                </div>
                <ArrowUpRight className="w-[18px] h-[18px] text-warmwhite/40 group-hover:text-crimson group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-[220ms] shrink-0" />
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* ── Role Sections ── */}
      {ROLE_GROUPS.map((group, i) => (
        <RoleSection key={group.key} group={group} alt={i % 2 === 0} onOpen={openRole} />
      ))}

      {/* ── Bottom CTA ── */}
      <section className="bg-paper py-20 sm:py-24" data-testid="section-cta">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-12 md:gap-14 items-center">
            <div>
              <h2
                className="font-integral font-bold uppercase text-night leading-[0.96] mb-4"
                style={{ fontSize: "clamp(38px, 5vw, 58px)" }}
              >
                Not Sure
                <br />
                Where You Fit?
              </h2>
              <p className="text-[17px] leading-[1.6] text-night/74">
                That's completely fine. Reach out and tell us a little about yourself. What you're good at, how much time you have, what interests you. We'll find the right spot together.
              </p>
            </div>
            <div className="bg-night rounded-lg p-8 sm:p-9">
              <div className="font-heading font-bold text-[11px] tracking-[0.18em] uppercase text-crimson mb-3">
                Email Us Direct
              </div>
              <a
                href="mailto:admin@nipomosoccer.com"
                className="inline-flex items-center gap-3 font-integral font-bold uppercase text-warmwhite text-[15px] sm:text-[17px] tracking-[0.02em] border-b-2 border-crimson pb-1.5 hover:text-warmwhite/80 transition-colors whitespace-nowrap"
                data-testid="link-email-cta"
              >
                admin@nipomosoccer.com
                <ArrowUpRight className="w-5 h-5 shrink-0" />
              </a>
              <p className="mt-5 text-[13px] text-warmwhite/55">
                Replies typically within a few days. We read every message.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Role Modal ── */}
      {activeRole && <RoleModal role={activeRole} onClose={closeRole} />}
    </div>
  );
}
