interface FinalCTASectionProps {
  onApply: () => void;
}

export default function FinalCTASection({ onApply }: FinalCTASectionProps) {
  return (
    <section className="coach-final-cta bg-crimson py-24 text-center">
      <div className="relative z-10 max-w-[760px] mx-auto px-6">
        <h2 className="font-display text-warmwhite text-[clamp(48px,7vw,88px)] uppercase leading-[0.95]">
          See you on the sideline
        </h2>
        <p className="text-warmwhite/70 mt-4 text-lg leading-relaxed">
          Coaching with Nipomo Soccer is the most direct way to know your kid's peers, meet more local families,
          and shape what soccer looks like in this community. We are here to support you while you make a
          difference for the kids on your team.
        </p>
        <button
          onClick={onApply}
          className="mt-8 px-8 py-4 bg-white text-crimson font-bold rounded-lg hover:bg-warmwhite transition-colors text-lg"
        >
          Sign Up to Coach <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
