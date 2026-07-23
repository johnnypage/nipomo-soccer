export default function RegistrationSection() {
  return (
    <section className="bg-paper py-20" id="registration">
      <div className="max-w-[880px] mx-auto px-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-crimson">
          Registration
        </span>
        <h2 className="font-heading text-2xl md:text-3xl font-bold mt-2 text-night">
          Registration
        </h2>

        <div className="mt-8 bg-white rounded-xl border border-black/8 overflow-hidden">
          <table className="roots-pricing-table">
            <thead>
              <tr>
                <th>Division</th>
                <th>Early Bird</th>
                <th>Regular</th>
                <th>Late (after July 31)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-night">Pre-K through 3rd Grade</td>
                <td className="text-slate">$150</td>
                <td className="text-slate">$175</td>
                <td className="text-slate">$200</td>
              </tr>
              <tr>
                <td className="font-medium text-night">Parent & Me</td>
                <td className="text-slate">$120 flat</td>
                <td className="text-slate">$120 flat</td>
                <td className="text-slate">$120 flat</td>
              </tr>
              <tr>
                <td className="font-medium text-night">Special Needs</td>
                <td className="text-slate">$50 flat</td>
                <td className="text-slate">$50 flat</td>
                <td className="text-slate">$50 flat</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-4 text-slate text-[15px] leading-relaxed">
          <p>
            <strong>Registration deadline:</strong> Regular registration ends July 31. Late registration begins August 1.
          </p>
          <p>
            <strong>Season start:</strong> Games begin once school is back in session. The specific game schedule and practice schedule will be released as the season gets closer.
          </p>
          <p>
            <strong>Coach perk:</strong> All volunteer coaches receive Early Bird pricing ($150) for their player, regardless of when they register.
          </p>
          <p>
            <strong>Scholarships:</strong> We have scholarship opportunities available through donors in the community. We do not want cost to keep any kid off the field. Reach out to{" "}
            <a href="mailto:admin@nipomosoccer.com" className="text-crimson hover:underline">admin@nipomosoccer.com</a>{" "}
            if your family needs assistance.
          </p>
          <p>
            <strong>Sibling discount:</strong> There is no sibling discount. Registration is a flat rate per player.
          </p>
        </div>
      </div>
    </section>
  );
}
