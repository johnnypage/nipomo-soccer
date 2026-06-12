import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

const EFFECTIVE_DATE = "June 11, 2026";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-night">
      <Header />
      <main className="max-w-3xl mx-auto px-4 pt-[140px] md:pt-28 pb-16">
        <div className="mb-10">
          <p className="text-warmwhite/50 text-xs uppercase tracking-[0.2em] mb-3">Nipomo Soccer Club</p>
          <h1 className="font-display text-4xl sm:text-5xl uppercase tracking-wide text-warmwhite mb-3">
            Privacy Policy
          </h1>
          <p className="text-warmwhite/55 text-sm">Effective: {EFFECTIVE_DATE}</p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8 text-warmwhite/80 leading-relaxed">
          <section>
            <p>
              Nipomo Soccer Club ("Nipomo SC," "we," "us") operates the website at{" "}
              <a href="https://nipomosoccer.com" className="text-gold underline underline-offset-2">nipomosoccer.com</a>{" "}
              and the Summer Skills Challenge program (collectively, the "Service"). This Privacy
              Policy explains what information we collect, how we use it, and the choices you have.
            </p>
            <p>
              We are a community youth soccer organization based in Nipomo, California. Questions
              about this policy can be sent to{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">1. Who this policy applies to</h2>
            <p>
              This policy applies to parents and legal guardians who create accounts on the Service
              and to the children whose participation is recorded by those parents. The Service is
              designed for parent-managed accounts: parents sign up, add their children, and submit
              content on their behalf. Children do not currently have their own logins. See Section 8
              for our approach to children's data and our future plans.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">2. Information we collect</h2>
            <p>We collect the following information directly from parents and guardians:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-warmwhite">Account information.</strong> Your email address,
                an optional name, and a timestamp of your consent to this policy. If you sign in
                with Google or Apple, we additionally receive a unique provider identifier from
                that service and the email address associated with it.
              </li>
              <li>
                <strong className="text-warmwhite">Child profile information.</strong> For each
                child you add to your account, we collect first name, last name, and birthdate. From
                the birthdate we derive an age track (Little Kicks, Starter, or Advanced) and a
                public display name in the format "First L." (first name plus last initial).
              </li>
              <li>
                <strong className="text-warmwhite">Challenge submissions.</strong> When you submit a
                challenge for your child, we record which child and which challenge it was for, the
                week number, the submission type (skill or fitness), the points earned, the date
                and time of submission, and a reference to the uploaded video stored with our video
                provider (see Section 4).
              </li>
              <li>
                <strong className="text-warmwhite">Communications.</strong> If you contact us by
                email or via website forms, we receive the content of those messages and your
                contact information.
              </li>
            </ul>
            <p>We also collect limited information automatically:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-warmwhite">Session cookies.</strong> When you sign in, we
                set a single session cookie (HTTP-only, Secure, SameSite=Lax) that keeps you logged
                in for up to 30 days. The cookie holds a random session identifier, not your
                personal data.
              </li>
              <li>
                <strong className="text-warmwhite">Server logs.</strong> Our hosting provider may
                record standard request information such as IP address, browser user agent, and
                timestamps. We use this information for security and to diagnose problems.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">3. How we use information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To create and authenticate your account, including sending magic-link login emails.</li>
              <li>To run the Summer Skills Challenge: track submissions, award points, and produce a public leaderboard.</li>
              <li>To display your child's public name (first name plus last initial) and age track on the leaderboard.</li>
              <li>To send you account-related communications (login links, account updates, and program announcements).</li>
              <li>To enable Nipomo SC administrators to review submissions for program operation and social media resharing.</li>
              <li>To investigate abuse, enforce our Terms of Service, and comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">4. Service providers</h2>
            <p>
              We use a small number of third-party services to operate the Service. These providers
              process information on our behalf under their own privacy policies.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-warmwhite">Neon</strong> (database hosting) — stores your
                account, child profiles, and submission records.
              </li>
              <li>
                <strong className="text-warmwhite">Cloudinary</strong> (video storage) — receives
                and stores the videos you upload. Videos are accessed by Nipomo SC administrators
                and are not publicly browsable from the Service.
              </li>
              <li>
                <strong className="text-warmwhite">SendGrid</strong> (email delivery) — delivers
                magic-link login emails and program communications on our behalf.
              </li>
              <li>
                <strong className="text-warmwhite">Google</strong> and <strong className="text-warmwhite">Apple</strong>{" "}
                (optional sign-in) — if you choose to sign in with Google or Apple, we receive an
                authentication response from that provider that includes your email and a unique
                provider identifier. We do not receive your provider password.
              </li>
              <li>
                <strong className="text-warmwhite">Replit</strong> (application hosting) — runs the
                Service infrastructure.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">5. Public information on the Service</h2>
            <p>
              The Summer Skills Challenge leaderboard at{" "}
              <Link href="/challenge/leaderboard" className="text-gold underline underline-offset-2">/challenge/leaderboard</Link>{" "}
              is publicly viewable without logging in. The leaderboard displays each participating
              child's first name with last initial (e.g. "Maria G."), age track, total points, and
              whether they are a registered Nipomo SC player. The leaderboard does not display full
              names, birthdates, email addresses, videos, or any other identifying information.
            </p>
            <p>
              Photo and video media that Nipomo SC chooses to reshare on its website or social media
              channels is subject to the separate{" "}
              <Link href="/participation-agreement" className="text-gold underline underline-offset-2">Participation Agreement</Link>{" "}
              that families sign at registration.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">6. How we share information</h2>
            <p>We do not sell personal information. We share information only in these situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With the service providers listed in Section 4, to operate the Service.</li>
              <li>With Nipomo SC board members, coaches, and authorized volunteers, to run programs.</li>
              <li>When required by law, court order, or to investigate suspected fraud or abuse.</li>
              <li>In connection with a merger, dissolution, or transfer of club operations to a successor organization.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">7. Data retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Magic-link login tokens are deleted immediately after use and in any case expire after 15 minutes.</li>
              <li>Account and submission records are retained for as long as your account is active and for a reasonable period afterward for record-keeping and dispute resolution.</li>
              <li>Uploaded videos are retained by Cloudinary until you request deletion or we determine they are no longer needed for the program.</li>
              <li>Server logs are retained for a short period (typically under 30 days) for security and operational purposes.</li>
            </ul>
            <p>
              You can request deletion of your account and associated data at any time by emailing{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">8. Children's privacy (COPPA)</h2>
            <p>
              Today, the Service is designed to be used by parents and legal guardians on behalf of
              their children. Children do not have their own logins, and all information about a
              child is provided to us by a parent or guardian.
            </p>
            <p>
              We may in the future offer direct accounts for children. When we do, we will comply
              with the federal Children's Online Privacy Protection Act ("COPPA"): for any child
              under 13, we will obtain verifiable parental consent before collecting personal
              information directly from that child, give parents the ability to review and delete
              that information, and limit data collection to what is reasonably necessary for the
              program.
            </p>
            <p>
              We do not knowingly collect personal information from children under 13 without
              parental consent. If you believe a child under 13 has provided us with information
              without their parent's consent, please contact{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>{" "}
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">9. Your choices and rights</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-warmwhite">Access.</strong> You can ask what information we hold about your family.</li>
              <li><strong className="text-warmwhite">Correction.</strong> You can ask us to correct inaccurate information.</li>
              <li><strong className="text-warmwhite">Deletion.</strong> You can ask us to delete your account and the associated records.</li>
              <li><strong className="text-warmwhite">Withdraw consent.</strong> You can stop participating in the Summer Skills Challenge or close your account at any time.</li>
              <li><strong className="text-warmwhite">Email.</strong> You can unsubscribe from program announcements through the link in any such email; we will still send transactional messages such as login links while your account is active.</li>
            </ul>
            <p>
              To exercise any of these rights, email{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">10. Security</h2>
            <p>
              We use HTTPS for all traffic to the Service, store session cookies with the HttpOnly
              and Secure attributes, hash and rotate magic-link tokens, and rely on reputable
              service providers (listed in Section 4) for storage and delivery. No system is
              perfectly secure; we cannot guarantee that information transmitted over the internet
              or stored on any system is invulnerable. If we discover a breach affecting your
              information, we will notify you in accordance with applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">11. Advertising and analytics</h2>
            <p>
              We use the Meta Pixel on this website to understand how visitors find us and to
              measure the performance of our registration advertising on Facebook and Instagram.
              The pixel sets cookies and reports standard event data to Meta Platforms, Inc., such
              as the pages you visit, clicks through to our registration platform, your IP address,
              and browser information. We may also share a hashed (one way encrypted) version of a
              parent's email address with Meta to measure whether our ads led to registrations and
              to reach families who may be interested in our programs. We do not share children's
              information for advertising purposes, and we do not sell personal information.
            </p>
            <p>
              You can control how Meta uses this data in your Facebook ad preferences at{" "}
              <a href="https://www.facebook.com/adpreferences" className="text-gold underline underline-offset-2">facebook.com/adpreferences</a>,
              opt out of interest based advertising at{" "}
              <a href="https://optout.aboutads.info" className="text-gold underline underline-offset-2">optout.aboutads.info</a>,
              or block these cookies in your browser settings. The Service works normally with
              these cookies blocked.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">12. California residents</h2>
            <p>
              If you are a California resident, the California Consumer Privacy Act gives you
              certain rights regarding personal information, including the right to know what we
              collect, the right to request deletion, and the right not to be discriminated against
              for exercising your rights. We do not sell personal information. To exercise these
              rights, email{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">13. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. When we do, we will change the effective
              date at the top of this page. For material changes, we will also notify families with
              active accounts by email.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">14. Contact us</h2>
            <p>
              Nipomo Soccer Club<br />
              Nipomo, California<br />
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
