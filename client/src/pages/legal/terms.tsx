import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const EFFECTIVE_DATE = "June 5, 2026";

export default function Terms() {
  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-[140px] md:pt-28 pb-16">
        <div className="mb-10">
          <p className="text-warmwhite/50 text-xs uppercase tracking-[0.2em] mb-3">Nipomo Soccer Club</p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-warmwhite mb-3">
            Terms of Service
          </h1>
          <p className="text-warmwhite/55 text-sm">Effective: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-warmwhite/80 leading-relaxed">
          <section>
            <p>
              These Terms of Service ("Terms") govern your use of the website at{" "}
              <a href="https://nipomosc.org" className="text-gold underline underline-offset-2">nipomosc.org</a>{" "}
              and the Summer Skills Challenge program (together, the "Service"), operated by Nipomo
              Soccer Club ("Nipomo SC," "we," "us"). By creating an account or otherwise using the
              Service, you agree to these Terms.
            </p>
            <p>
              If you are using the Service on behalf of a child, you represent that you are the
              child's parent or legal guardian and that you accept these Terms for both yourself
              and the child.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">1. Eligibility</h2>
            <p>
              Account holders must be at least 18 years old and the parent or legal guardian of any
              child whose information they submit. By creating an account, you confirm that this is
              true.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">2. Your account</h2>
            <p>
              You are responsible for the information you provide and for the activity that happens
              under your account. Keep your login email secure and do not share it. If you sign in
              with Google or Apple, you are also bound by their terms with respect to that account.
              Notify us at{" "}
              <a href="mailto:admin@nipomosc.org" className="text-gold underline underline-offset-2">admin@nipomosc.org</a>{" "}
              if you believe your account has been used without your permission.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">3. Privacy</h2>
            <p>
              Our{" "}
              <Link href="/privacy" className="text-gold underline underline-offset-2">Privacy Policy</Link>{" "}
              explains what information we collect through the Service and how we use it, and is
              incorporated into these Terms by reference.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">4. Participation Agreement</h2>
            <p>
              Participation in Nipomo SC programs is governed by our{" "}
              <Link href="/participation-agreement" className="text-gold underline underline-offset-2">Annual Player & Parent Agreement</Link>,
              which covers club rules, assumption of risk, medical authorization, code of conduct,
              photo and video media consent, and payment and refund policy. The Participation
              Agreement is in addition to, and not in place of, these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">5. User content and submissions</h2>
            <p>
              The Summer Skills Challenge invites you to upload short videos of your child
              practicing soccer skills ("Submissions"). By uploading a Submission, you represent
              that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are the parent or legal guardian of every person identifiable in the video.</li>
              <li>You have the right to record and share the content of the video.</li>
              <li>The video does not violate anyone else's privacy, publicity, or intellectual property rights.</li>
              <li>The video does not contain unsafe, abusive, threatening, sexually explicit, or otherwise inappropriate content.</li>
            </ul>
            <p>
              You retain ownership of your Submissions. By uploading them, you grant Nipomo SC a
              worldwide, royalty-free, non-exclusive license to store, display, reformat, and reshare
              the Submissions for the purpose of operating the Summer Skills Challenge and promoting
              Nipomo SC. We will not sell your Submissions.
            </p>
            <p>
              We may remove any Submission, suspend any account, or refuse to award points for any
              Submission that we reasonably believe violates these Terms or the Participation
              Agreement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">6. Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service to violate any law or anyone else's rights.</li>
              <li>Impersonate another person or misrepresent your relationship to a child.</li>
              <li>Submit videos that are not actually of the child registered on your account.</li>
              <li>Attempt to game the points system, leaderboard, or prize drawings through automation or false submissions.</li>
              <li>Interfere with the Service, attempt to access it through unauthorized means, or probe it for vulnerabilities outside of a responsible disclosure to us.</li>
              <li>Harass, threaten, or abuse other participants, our coaches, or volunteers through any feature of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">7. Prizes and program rules</h2>
            <p>
              Specific rules for the Summer Skills Challenge — including weekly point caps, prize
              drawing mechanics, age tracks, and submission windows — are published on the{" "}
              <Link href="/challenge" className="text-gold underline underline-offset-2">/challenge</Link>{" "}
              page and may be updated during the program. We reserve the right to adjust the rules,
              the prizes, or the program schedule when reasonably necessary, and to disqualify any
              participant for violating these Terms or the program rules.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">8. Intellectual property</h2>
            <p>
              Except for the Submissions you upload, all content on the Service — including the
              Nipomo SC name, logos, photos, copy, designs, and software — is owned by Nipomo SC or
              its licensors and is protected by intellectual property laws. You may not copy,
              reproduce, or create derivative works from it without our written permission, other
              than for personal, non-commercial reference.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">9. Third-party services</h2>
            <p>
              The Service relies on third parties for hosting, video storage, email, and optional
              sign-in (see the Privacy Policy for the current list). We are not responsible for the
              availability, content, or practices of those providers beyond what we describe in the
              Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">10. Disclaimer of warranties</h2>
            <p>
              The Service is provided on an "as is" and "as available" basis. We do not warrant
              that the Service will be uninterrupted, error-free, secure, or free of viruses or
              other harmful components. To the fullest extent permitted by law, we disclaim all
              implied warranties, including warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">11. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Nipomo SC and its board members, officers,
              employees, coaches, volunteers, and agents will not be liable for any indirect,
              incidental, special, consequential, or punitive damages, or for any loss of data,
              goodwill, or profits, arising out of or related to your use of the Service. Our
              total liability for any claim arising out of or related to the Service will not
              exceed the amount you paid to Nipomo SC, if any, during the twelve months before the
              claim arose, or one hundred U.S. dollars, whichever is greater.
            </p>
            <p>
              Nothing in these Terms limits any liability that cannot be limited under applicable
              law, including for gross negligence or willful misconduct.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">12. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Nipomo SC and its board members,
              officers, employees, coaches, volunteers, and agents from any claim, demand, or
              damages, including reasonable attorneys' fees, arising out of your use of the
              Service, your Submissions, or your violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">13. Termination</h2>
            <p>
              You may stop using the Service and close your account at any time by emailing{" "}
              <a href="mailto:admin@nipomosc.org" className="text-gold underline underline-offset-2">admin@nipomosc.org</a>.
              We may suspend or terminate your access to the Service at any time if we believe you
              have violated these Terms, the Participation Agreement, or applicable law, or if we
              are required to do so to protect the Service or other users. Sections that by their
              nature should survive termination (including ownership, disclaimers, limitation of
              liability, indemnification, and governing law) will survive.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">14. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. When we do, we will change the effective
              date at the top of this page. For material changes, we will also notify families with
              active accounts by email. Your continued use of the Service after a change takes
              effect means you accept the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">15. Governing law and disputes</h2>
            <p>
              These Terms are governed by the laws of the State of California, without regard to
              its conflict-of-laws rules. You agree that any dispute arising out of or related to
              these Terms or the Service will be brought exclusively in the state or federal
              courts located in San Luis Obispo County, California, and you consent to the personal
              jurisdiction of those courts.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">16. Contact</h2>
            <p>
              Nipomo Soccer Club<br />
              Nipomo, California<br />
              <a href="mailto:admin@nipomosc.org" className="text-gold underline underline-offset-2">admin@nipomosc.org</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
