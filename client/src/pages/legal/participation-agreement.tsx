import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EFFECTIVE_DATE = "June 5, 2026";

export default function ParticipationAgreement() {
  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-[140px] md:pt-28 pb-16">
        <div className="mb-10">
          <p className="text-warmwhite/50 text-xs uppercase tracking-[0.2em] mb-3">Nipomo Soccer Club</p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-warmwhite mb-3">
            Annual Player & Parent Agreement
          </h1>
          <p className="text-warmwhite/55 text-sm">Effective: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-warmwhite/80 leading-relaxed">
          <section>
            <p>
              This Agreement is entered into between Nipomo Soccer Club ("Nipomo SC," "the Club")
              and the undersigned Parent/Guardian and Player for participation in Club programs
              during the applicable seasonal year.
            </p>
            <p>
              By clicking "I Agree" or indicating agreement in any fashion, Parent/Guardian and
              Player acknowledge that they have read, understand, and agree to all terms below.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">1. Club Terms & Conditions (Participation Agreement)</h2>
            <p>
              Participation in Nipomo SC is voluntary and subject to compliance with all Club
              policies, procedures, and rules.
            </p>
            <p>Parent/Guardian and Player agree that:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The Player will abide by all Club rules, team rules, and coaching instructions.</li>
              <li>The Club retains sole authority over team placement, roster decisions, coaching assignments, scheduling, and playing time philosophies.</li>
              <li>Participation is a seasonal commitment. Withdrawal may impact eligibility for refunds as outlined below.</li>
              <li>The Club may modify policies when reasonably necessary. Updated policies will be communicated electronically.</li>
            </ul>
            <p>
              Failure to comply with Club policies may result in disciplinary action, suspension,
              or removal from the program without refund.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">2. Assumption of Risk & Liability Waiver</h2>
            <p>
              Soccer is a physical sport that involves inherent risks including, but not limited
              to, falls, collisions, overexertion, and contact with other players, equipment, or
              field conditions.
            </p>
            <p>
              Parent/Guardian and Player knowingly and voluntarily assume all risks associated with
              participation.
            </p>
            <p>
              To the fullest extent permitted by law, Parent/Guardian and Player release, waive,
              and hold harmless Nipomo SC, its board members, officers, employees, coaches,
              volunteers, agents, and facility providers from any and all claims, demands, actions,
              or causes of action arising out of participation, except for gross negligence or
              willful misconduct.
            </p>
            <p>
              Parent/Guardian agrees to indemnify and defend the Club against any claim arising
              from Player's participation.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">3. Medical Treatment Authorization</h2>
            <p>
              Parent/Guardian authorizes Nipomo SC representatives to obtain emergency medical
              treatment for Player if Parent/Guardian cannot be reached.
            </p>
            <p>Parent/Guardian accepts responsibility for all medical expenses incurred.</p>
            <p>
              Parent/Guardian affirms that Player is physically capable of participating and has no
              condition that would prevent safe participation unless disclosed to the Club.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">4. Code of Conduct (Player & Parent)</h2>
            <p>
              Nipomo SC is a development-first, community-focused club that expects respectful
              behavior at all times.
            </p>
            <p>Players and Parents/Guardians agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Show respect to referees, opponents, teammates, coaches, and volunteers</li>
              <li>Refrain from abusive language, harassment, threats, or discriminatory behavior</li>
              <li>Support positive sideline behavior</li>
              <li>Follow all facility rules</li>
            </ul>
            <p>
              Violations may result in disciplinary action including warnings, suspension, or
              removal from the program.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">5. Photo & Video Media Consent</h2>
            <p>
              Parent/Guardian grants Nipomo SC permission to photograph and/or record Player and to
              use Player's likeness for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Club website</li>
              <li>Social media</li>
              <li>Marketing and promotional materials</li>
              <li>Internal communications and training</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">6. Payment & Refund Policy</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>All fees must be paid by published deadlines.</li>
              <li>Installment plans, if offered, must remain current.</li>
              <li><strong className="text-warmwhite">No refunds will be issued once uniforms or equipment have been ordered.</strong></li>
              <li>Prior to equipment ordering, any refund requests are subject to approval and issued solely at the discretion of the Program Director.</li>
              <li>Administrative and processing fees are non-refundable.</li>
              <li>Failure to remain current on payments may result in suspension or removal.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">7. Electronic Acceptance & Binding Agreement</h2>
            <p>By clicking <strong className="text-warmwhite">"I Agree"</strong>:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Parent/Guardian certifies they are the legal guardian of the Player</li>
              <li>Parent/Guardian and Player acknowledge they have read and understand this Agreement</li>
              <li>Parent/Guardian and Player agree to be legally bound by all terms</li>
              <li>This acceptance serves as the legal equivalent of a handwritten signature</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
