import type { ReactNode } from "react";

const FAQS: { q: string; a: ReactNode }[] = [
  {
    q: "Do I need soccer experience?",
    a: "No. Many of our coaches started with none. We provide session plans, preseason training, and ongoing support throughout the season. If you can manage a group of kids and care about their experience, you are qualified. We teach you the soccer part.",
  },
  {
    q: "What training is required?",
    a: "All coaches complete a background check, fingerprinting, SafeSport training, and concussion awareness certification. On the soccer side, you will complete your US Soccer Grassroots certification, which is an online course for your specific age group. All expenses are covered by Nipomo Soccer. Total time commitment is roughly 3-5 hours before the season starts, and we walk you through every step.",
  },
  {
    q: "What is the playtime policy?",
    a: "Playing time is tied to practice attendance, tracked in Spond. If a player attends 50% of practices, they get roughly 50% of game time. Players with full participation follow the three-quarter rule, meaning every player must play three quarters before any player plays the full game. This gives coaches a real tool to reward the kids who show up and put in the work, while making sure every committed player gets meaningful time on the field.",
  },
  {
    q: "How is Nipomo Soccer different from AYSO?",
    a: (
      <>
        Nipomo Soccer was started by many of the same volunteers who ran youth soccer in Nipomo
        over the last two years. We created a new organization with the same people in the same
        community to continue improving, with the flexibility to do things like pay referees and
        set our own policies.{" "}
        <a href="/about/compare" className="text-crimson hover:underline">
          Read the full story here.
        </a>
      </>
    ),
  },
  {
    q: "How are teams and rosters created?",
    a: "We use returning player data from last season, a pre-season evaluation day, and player requests to build balanced teams. The evaluation day and returning player data are new for this year, and we expect them to help us create more competitive matchups than we have been able to in the past. This is an evolving process and we are committed to improving it every season.",
  },
  {
    q: "What is the time commitment?",
    a: "Pre-K: Saturday games only, no practices. 1st and 2nd grade: one to two practices per week plus Saturday games, up to the coach. 3rd grade and up: two practices per week plus games. Coaches set their own practice schedule. If you have time constraints but are willing to coach, let us know. We will pair you with assistant coaches who can cover when you are not available and do our best to schedule around your constraints. Having a coach who is there some of the time is better than not having a coach at all. If you are willing to help, sign up and tell us what works for you.",
  },
  {
    q: "Can my child play ROOTS if they are on a competitive club team or playing other sports?",
    a: "Yes. ROOTS is open to all players regardless of what other programs or sports they are in. There are no roster restrictions. Playtime is tied to practice attendance, and that applies to everyone equally. The kids who show up consistently earn more game time, whether they play competitive, play other sports, or ROOTS is their only activity.",
  },
  {
    q: "What about background checks?",
    a: "Every coach completes a background check, fingerprinting, SafeSport training, and concussion awareness certification before the season. We cover the costs and walk you through the entire process. Most of it is online and takes about 30 minutes. We will send you everything you need and make sure you are cleared before the first practice.",
  },
  {
    q: "Where does the survey data come from?",
    a: "The end-of-season family survey was created, distributed, and analyzed independently by our team using personal tools and resources. It is not owned by or affiliated with any other organization. We do this as a service to the Nipomo soccer community to make sure we are building a program that reflects what families actually want.",
  },
  {
    q: "I played in high school or I'm still a student. Where do I fit?",
    a: "If you have competitive experience, you can assistant coach at any level or lead a ROOTS team. If you are still in high school, we have teen helper roles where you assist coaches during practices and games and earn community service hours. We are also building a referee pipeline for student officials who want to earn money officiating games after school. Reach out and we will find the right fit.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-night py-20" id="faq">
      <div className="max-w-[880px] mx-auto px-6">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            FAQ
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            Questions coaches ask before signing up
          </h2>
          <p className="text-warmwhite/55 mt-3 text-[17px]">
            If something is missing, email{" "}
            <a href="mailto:admin@nipomosoccer.com" className="text-gold hover:underline">
              admin@nipomosoccer.com
            </a>.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => (
            <details
              key={i}
              className="group bg-warmwhite/[0.05] rounded-xl border border-warmwhite/10"
              open={i === 0}
            >
              <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-medium text-warmwhite list-none [&::-webkit-details-marker]:hidden">
                <span>{f.q}</span>
                <svg
                  className="w-5 h-5 text-warmwhite/30 group-open:text-gold transition-all group-open:rotate-180 flex-shrink-0 ml-4"
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
              <div className="px-6 pb-5">
                <p className="text-warmwhite/65 text-[15px] leading-relaxed">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
