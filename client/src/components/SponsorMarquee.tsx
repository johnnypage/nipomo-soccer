import { SPONSORS } from "@/lib/sponsors";

interface SponsorMarqueeProps {
  heading?: string;
}

// Sponsor ribbon (Monjur-style: dark strip, white monochrome logos, infinite marquee).
export default function SponsorMarquee({
  heading = "Sponsored by Nipomo businesses",
}: SponsorMarqueeProps) {
  return (
    <section data-testid="sponsor-ribbon" className="bg-[#0D0D0D] py-8 md:py-10 overflow-hidden">
      <p className="text-center text-warmwhite/55 text-xs md:text-sm font-semibold tracking-[0.22em] uppercase px-5">
        {heading}
      </p>
      <div className="mt-6 w-full overflow-hidden">
        <div className="sponsor-marquee flex w-max items-center gap-12 md:gap-16 pr-12 md:pr-16">
          {[0, 1].map((copy) =>
            SPONSORS.map((s, i) => {
              const img = (
                <img
                  src={s.src}
                  alt={copy === 0 ? s.name : ""}
                  className="object-contain opacity-85 w-auto"
                  style={{ height: `${s.h}px` }}
                />
              );
              return (
                <div
                  key={`${copy}-${i}`}
                  aria-hidden={copy === 1 ? "true" : undefined}
                  className="h-[84px] flex items-center justify-center flex-shrink-0"
                >
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      {img}
                    </a>
                  ) : (
                    img
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
