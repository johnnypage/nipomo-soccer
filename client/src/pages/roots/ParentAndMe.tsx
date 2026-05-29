import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./roots.css";

const REGISTER_URL = "https://club.spond.com/landing/signup/nipomosc/form/7F3CC0F6316343DCB8851A6A05399DAA";

const FAQS = [
  {
    q: "Does my 2 year old need to know how to play soccer?",
    a: "No. Most kids at this age have never touched a soccer ball. That is the whole point. This is an introduction, and the activities are designed to meet kids wherever they are developmentally.",
  },
  {
    q: "Do I have to be on the field the whole time?",
    a: "Yes. This is a parent-and-child program. You are on the field participating alongside your child. That is what makes it work at this age.",
  },
  {
    q: "What if my child is almost 4?",
    a: "If your child turns 4 during the season and seems ready for more structure, they may be a better fit for the Pre-K / Kindergarten division. If you are unsure, register for Parent & Me and we can move them up if needed.",
  },
  {
    q: "Is this the same as the older divisions?",
    a: "No. Parent & Me is its own thing. There are no teams, no games, no scores, and no practices during the week. It is Saturday only, and the focus is entirely on fun and introduction to movement and the sport.",
  },
];

export default function ParentAndMe() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="roots-hero bg-night" id="top">
        <div className="roots-hero__inner text-center flex flex-col items-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-[#B99EE8]/40 bg-[#B99EE8]/10 text-[#B99EE8] mb-6">
            ROOTS Parent & Me
          </span>
          <h1 className="font-display text-warmwhite text-[clamp(44px,8vw,96px)] leading-[0.92] uppercase tracking-tight max-w-[900px]">
            Their first season, your first sideline.
          </h1>
          <p className="text-warmwhite/80 text-xl mt-6 leading-relaxed max-w-[600px]">
            A Saturday morning program for 2 and 3 year olds where you get on the field with your child for soccer-related games, drills, and play. No practices during the week. No competitive games. Just an introduction to the sport with mom or dad right there.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-8 mb-10 justify-center">
            {["Ages 2-3", "Saturday only", "No practices", "Parent on field", "$120 flat"].map((stat) => (
              <span key={stat} className="px-4 py-1.5 bg-warmwhite/[0.06] border border-warmwhite/10 rounded-full text-warmwhite/65 text-sm font-medium">
                {stat}
              </span>
            ))}
          </div>

          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
          >
            Register Now <span aria-hidden="true">&#8594;</span>
          </a>
        </div>
      </section>

      {/* What to Expect */}
      <section className="bg-paper py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            What to expect
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-3 text-night">
            Soccer-shaped play for you and your child
          </h2>

          <div className="mt-6 space-y-5 text-slate text-[17px] leading-relaxed">
            <p>
              Think of it like organized PE that happens to have soccer balls on the field. You and your child are out there together for activities designed around body awareness, coordination, and fun. Some Saturdays your kid will be ready to run around independently. Other Saturdays they will need you right next to them. Both are completely normal, and the program is built for both.
            </p>
            <p>
              Each Saturday session runs about an hour. The first portion is structured games and drills led by a coach. After that, kids who are ready can move into light scrimmage play. Kids who are not ready yet continue with additional activities and games. You get to choose your own adventure based on where your child is that day.
            </p>
            <p>
              There are no scores, no standings, and no pressure. The goal is for your child to have fun, move their body, and start to associate soccer with a great time.
            </p>
          </div>
        </div>
      </section>

      {/* Season Details */}
      <section className="bg-night py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Season details
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            What the season looks like
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {[
              { label: "Schedule", value: "Saturday sessions only, 10 sessions per season" },
              { label: "Location", value: "Nipomo High School fields" },
              { label: "Season window", value: "August through November" },
              { label: "Gender", value: "Co-ed. Parent & Me will not be separated by gender." },
              { label: "What to bring", value: "Comfortable clothes, closed-toe shoes (cleats optional at this age), water bottle, and sunscreen" },
            ].map((item) => (
              <div key={item.label} className="bg-warmwhite/[0.04] border border-warmwhite/10 rounded-xl p-6">
                <div className="text-xs font-semibold tracking-wider uppercase text-gold mb-2 font-mono">
                  {item.label}
                </div>
                <p className="text-warmwhite/80 text-[15px] leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration and Pricing */}
      <section className="bg-paper py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
            Registration
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
            Registration and pricing
          </h2>

          <div className="mt-8 bg-white rounded-xl border border-black/8 p-8">
            <div className="font-display text-4xl text-crimson tracking-wide leading-none">
              $120
            </div>
            <p className="text-slate text-sm mt-1">Flat rate. No early bird or late tiers.</p>

            <div className="mt-6">
              <div className="text-xs font-semibold tracking-wider uppercase text-crimson mb-3 font-mono">
                What's included
              </div>
              <ul className="space-y-1.5">
                {["Kit (shirt and shorts)", "Insurance", "Participation medal at end of season"].map((item) => (
                  <li key={item} className="text-[15px] text-night/85 pl-5 relative before:content-['&#10003;'] before:absolute before:left-0 before:text-gold before:font-bold">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-slate text-[15px] mt-6 leading-relaxed">
              <strong>Scholarships:</strong> We do not want cost to keep any family off the field. Email{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-crimson hover:underline">admin@nipomosoccer.com</a>{" "}
              if your family needs assistance.
            </p>

            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 px-6 py-3 bg-crimson text-warmwhite font-semibold rounded-lg hover:bg-crimson-dark transition-colors"
            >
              Sign up for Parent & Me <span aria-hidden="true">&#8594;</span>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-night py-20">
        <div className="max-w-[880px] mx-auto px-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-gold/50 bg-gold/10 text-gold">
            Questions
          </span>
          <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-warmwhite">
            Common questions about Parent & Me
          </h2>

          <div className="flex flex-col gap-3 mt-8">
            {FAQS.map((f, i) => (
              <details
                key={i}
                className="group bg-warmwhite/[0.04] border border-warmwhite/10 rounded-xl"
                open={i === 0}
              >
                <summary className="flex items-center justify-between cursor-pointer px-6 py-5 font-medium text-warmwhite list-none [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <svg
                    className="w-5 h-5 text-warmwhite/40 group-open:text-gold transition-all group-open:rotate-180 flex-shrink-0 ml-4"
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
                <div className="px-6 pb-5 text-warmwhite/70 text-[15px] leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Back to ROOTS + CTA */}
      <section className="roots-final-cta bg-crimson py-16 text-center">
        <div className="relative z-10 max-w-[760px] mx-auto px-6">
          <h2 className="font-display text-warmwhite text-[clamp(40px,6vw,72px)] uppercase leading-[0.95]">
            Ready to play?
          </h2>
          <p className="text-warmwhite/75 mt-4 text-lg leading-relaxed">
            Sign up for Parent & Me and get your family on the field this fall.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-crimson font-bold rounded-lg hover:bg-warmwhite transition-colors text-lg"
            >
              Register Now <span aria-hidden="true">&#8594;</span>
            </a>
          </div>
          <a
            href="/roots"
            className="inline-block mt-6 text-warmwhite/60 hover:text-warmwhite text-sm transition-colors"
          >
            &#8592; See all ROOTS divisions
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
