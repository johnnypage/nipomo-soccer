import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EFFECTIVE_DATE = "June 12, 2026";

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
              <a href="https://nipomosoccer.com" className="text-gold underline underline-offset-2">nipomosoccer.com</a>.
              This policy explains what information we collect, how we use it, and the choices you
              have. Questions can be sent to{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">1. Information we collect</h2>
            <p>
              We collect information you choose to provide, such as your name, email address, and
              the details you submit when you contact us, volunteer, or register for our programs
              through our registration platform. We also collect limited information automatically
              when you visit the website, such as IP address, browser information, and the pages
              you view, through cookies and standard server logs.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">2. How we use information</h2>
            <p>
              We use information to operate our programs, communicate with families, run and
              improve the website, measure our outreach and advertising, and meet legal
              obligations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">3. Advertising and analytics</h2>
            <p>
              We use the Meta Pixel on this website to understand how visitors find us and to
              measure our advertising on Facebook and Instagram. The pixel sets cookies and reports
              standard event data to Meta Platforms, Inc., such as the pages you visit, clicks
              through to our registration platform, your IP address, and browser information. We
              may also share a hashed (one way encrypted) version of a parent's email address with
              Meta to measure whether our ads led to registrations and to reach families who may be
              interested in our programs. We do not share children's information for advertising
              purposes, and we do not sell personal information.
            </p>
            <p>
              You can control how Meta uses this data in your Facebook ad preferences at{" "}
              <a href="https://www.facebook.com/adpreferences" className="text-gold underline underline-offset-2">facebook.com/adpreferences</a>,
              opt out of interest based advertising at{" "}
              <a href="https://optout.aboutads.info" className="text-gold underline underline-offset-2">optout.aboutads.info</a>,
              or block cookies in your browser settings. The website works normally with these
              cookies blocked.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">4. How we share information</h2>
            <p>
              We do not sell personal information. We share information only with the service
              providers that help us operate (such as website hosting, email delivery, and our
              registration platform), with club staff and authorized volunteers who run our
              programs, when required by law, or in connection with a transfer of club operations
              to a successor organization.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">5. Children's privacy</h2>
            <p>
              This website is intended for parents and legal guardians. Information about children
              is provided to us by a parent or guardian, for example during program registration.
              We do not knowingly collect personal information online from children under 13
              without parental consent. If you believe a child has provided us information without
              consent, contact{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>{" "}
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">6. Your choices and rights</h2>
            <p>
              You may ask us what information we hold about your family, ask us to correct it, or
              ask us to delete it by emailing{" "}
              <a href="mailto:admin@nipomosoccer.com" className="text-gold underline underline-offset-2">admin@nipomosoccer.com</a>.
              You can unsubscribe from announcement emails using the link in any such email.
              California residents have these rights under the California Consumer Privacy Act,
              along with the right not to be discriminated against for exercising them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">7. Security and retention</h2>
            <p>
              We use HTTPS across the website and rely on reputable service providers for storage
              and delivery. We keep information only as long as needed for the purposes above. No
              system is perfectly secure, and we cannot guarantee the security of information
              transmitted over the internet.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. When we do, we will change the effective
              date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-2xl text-warmwhite mb-3">9. Contact us</h2>
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
