export default function PhotoBand() {
  return (
    <section
      className="relative bg-scroll md:bg-fixed bg-cover bg-center"
      style={{
        backgroundImage: `url(/roots-photo-band.jpg)`,
      }}
      aria-label="Kids playing soccer on the field"
    >
      <div className="absolute inset-0 bg-night/80" />
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 md:py-32 text-center">
        <p className="font-display text-warmwhite text-3xl md:text-5xl uppercase tracking-tight leading-[1.05] max-w-3xl mx-auto">
          The best part of the week happens on the field.
        </p>
        <p className="text-warmwhite/70 text-lg mt-5 max-w-xl mx-auto">
          Real families, real coaches, and a whole community that shows up every Saturday.
        </p>
      </div>
    </section>
  );
}
