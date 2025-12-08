import herreraLogo from "@assets/Herrera_1765222077181.png";
import jgContractingLogo from "@assets/JG_Contracting_1765222077181.png";

export default function Sponsors() {
  const sponsors = [
    { name: "Herrera Farming Company", logo: herreraLogo },
    { name: "JG Contracting", logo: jgContractingLogo },
  ];

  return (
    <section id="sponsors" className="py-16 bg-slate/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-gold/20 border border-gold/40 rounded-full text-gold text-sm font-medium mb-4">
            Community Partners
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-warmwhite tracking-wide mb-3">
            OUR SPONSORS
          </h2>
          <p className="text-warmwhite/70 max-w-xl mx-auto text-sm">
            Thank you to our sponsors who help make quality youth soccer accessible in Nipomo.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {sponsors.map((sponsor, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-center"
              data-testid={`sponsor-logo-${idx}`}
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-16 md:h-20 w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
