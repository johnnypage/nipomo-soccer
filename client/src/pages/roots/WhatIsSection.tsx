export default function WhatIsSection() {
  return (
    <section className="bg-paper" id="about">
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        <div className="grid md:grid-cols-[1fr_340px] gap-12 items-start">
          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-crimson/30 bg-crimson/10 text-crimson">
              What is ROOTS?
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-bold mt-3 text-night">
              Built for the Nipomo community
            </h2>
            <p className="text-slate mt-4 text-[17px] leading-relaxed">
              Many of the same people who ran youth soccer in Nipomo over the last few years are
              continuing that work through Nipomo Soccer. If your family played last year, you
              will see familiar faces on the sidelines. What is new is the structure behind it,
              and this page is designed to walk you through everything you need to know about
              the upcoming season.
            </p>
            <p className="text-slate mt-4 text-[17px] leading-relaxed">
              ROOTS is recreational soccer built for the Nipomo community. We have divisions for
              kids as young as 2 years old through our Parent &amp; Me program, all the way up
              through 14U. Whether your kid has been playing for years or is stepping on the
              field for the first time, there is a place for them in ROOTS.
            </p>
          </div>

          <div className="bg-night rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
              style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "40px 40px"}}
            />
            <span className="relative z-10 block font-display text-crimson text-7xl leading-none select-none mb-4" aria-hidden="true">"</span>
            <blockquote className="relative z-10">
              <p className="text-warmwhite text-[17px] leading-relaxed italic">
                This was our first season and we loved our experience. I love the family feel out on these fields.
              </p>
              <footer className="mt-5 pt-4 border-t border-white/10">
                <span className="text-warmwhite/40 text-xs font-mono uppercase tracking-wider">Parent — 2025 Survey</span>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
