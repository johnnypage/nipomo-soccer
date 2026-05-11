import type { ReactNode } from "react";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "When does the ROOTS season run?",
    a: (
      <>
        <p className="mb-3">The ROOTS Fall 2026 season runs from <strong>August 1 through November 7</strong>. Here's how it breaks down:</p>
        <ul className="space-y-3">
          <li>
            <strong>Kickoff Days (August 1 &amp; 8)</strong><br />
            Two Saturday events where players play small-sided pickup games for team balancing and get measured for custom jerseys. Players only need to attend one.
          </li>
          <li>
            <strong>Pre-Season (August 10 -- September 7)</strong><br />
            Weekday practices begin the week of August 10. Two Saturday scrimmages (August 22 and 29) give players a full game-day experience before the regular season starts.
          </li>
          <li>
            <strong>Regular Season (September 12 -- October 31)</strong><br />
            Eight Saturday games plus four midweek games. All matches 8U and up are refereed and scored with live standings on nipomosc.org.
          </li>
          <li>
            <strong>End-of-Season Tournament (November 7)</strong><br />
            A weekend tournament seeded by regular season standings. For 8U and up. 6U plays the full regular season but does not participate in the tournament.
          </li>
          <li>
            <strong>Parent &amp; Me and Special Needs</strong><br />
            These programs run a 10-week season from August 22 through October 31. No Kickoff Day required, no tournament.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "Does my kid need soccer experience?",
    a: "No. ROOTS is open to all skill levels with no tryouts. Whether your child has been playing for years or has never kicked a ball, there is a division for them.",
  },
  {
    q: "Which division does my child play in?",
    a: (
      <>
        Nipomo Soccer uses a September 1 cutoff so your child plays in the division that matches their school grade. Use our{" "}
        <a href="/find-my-division" className="text-crimson hover:underline">
          Find My Division tool
        </a>{" "}
        to enter your child's birthday and see their exact division, format, and what to expect.
      </>
    ),
  },
  {
    q: "Can my child play ROOTS if they are on a competitive club team or playing other sports?",
    a: "Yes. ROOTS is open to all players regardless of what other programs or sports they are in. Playtime is tied to practice attendance, and that applies to everyone equally.",
  },
  {
    q: "What is the playtime policy?",
    a: "For 1st grade and up, playing time is tied to practice attendance tracked in Spond. Kids who come to practice consistently earn more game time. Players with full participation follow the three-quarter rule, meaning every player must play three quarters before any player plays the full game. This rewards effort while making sure every committed player gets meaningful time on the field.",
  },
  {
    q: "How are teams and rosters created?",
    a: "We use returning player data from last season, a pre-season evaluation day, and player requests to build balanced teams. This is an evolving process and we are committed to improving it every season.",
  },
  {
    q: "Is there a sibling discount?",
    a: "No. Registration is a flat rate per player.",
  },
  {
    q: "How is Nipomo Soccer different from AYSO?",
    a: (
      <>
        Nipomo Soccer was started by many of the same volunteers who ran youth soccer in Nipomo over
        the last two years. We created a new organization with the same people in the same community
        to continue improving, with the flexibility to do things like pay referees and set our own
        policies.{" "}
        <a href="/about/compare" className="text-crimson hover:underline">
          Read the full story here.
        </a>
      </>
    ),
  },
  {
    q: "Do I need to volunteer?",
    a: (
      <>
        Volunteering is not mandatory, but Nipomo Soccer depends on community support. Our entire
        board and all coaches are volunteers. Every helping hand makes a real difference. If you are
        interested in coaching, visit our{" "}
        <a href="/coach" className="text-crimson hover:underline">
          Coach With Us
        </a>{" "}
        page.
      </>
    ),
  },
  {
    q: "Are there scholarships available?",
    a: "Yes. We have scholarship opportunities through donors in the community. We do not want cost to keep any kid off the field. Email admin@nipomosc.org if your family needs assistance.",
  },
  {
    q: "What should my kid bring to games and practices?",
    a: "Shin guards, cleats, and a water bottle. The kit is provided.",
  },
  {
    q: "What if my kid misses games or practices?",
    a: "Some missed time is fine. If your child will miss an extended stretch, let the coach know so they can plan. For divisions with participation-based playtime, attendance is tracked in Spond and does factor into game time.",
  },
  {
    q: "Where are games and practices held?",
    a: "All games are held at Nipomo High School fields. Some practices may be held at other schools around Nipomo depending on field availability. Your coach will communicate practice locations through Spond.",
  },
  {
    q: "What is Spond?",
    a: "Spond is the app we use for all season communication, scheduling, and attendance tracking. After you register, you will receive instructions to set up your Spond account.",
  },
  {
    q: "Are there refunds?",
    a: "No refunds. If your child is injured, credit toward a future Nipomo Soccer program may be offered at the director's discretion.",
  },
  {
    q: "When will I find out what team my kid is on?",
    a: "Team assignments are released before the season starts, after the pre-season evaluation day for 3rd grade and up.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-paper py-20" id="faq">
      <div className="max-w-[880px] mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            FAQ
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            Questions families ask before registering
          </h2>
          <p className="text-slate mt-3 text-[17px]">
            If something is missing, email{" "}
            <a href="mailto:admin@nipomosc.org" className="text-crimson hover:underline">
              admin@nipomosc.org
            </a>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group bg-white rounded-xl border border-black/8"
              open={i === 0}
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-medium text-night list-none [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <svg
                  className="w-5 h-5 text-slate/40 group-open:text-crimson transition-all group-open:rotate-180 flex-shrink-0 ml-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-slate text-[15px] leading-relaxed">
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
