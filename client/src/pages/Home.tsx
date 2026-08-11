import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Programs from "@/components/Programs";
import About from "@/components/About";
import SponsorMarquee from "@/components/SponsorMarquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  const programsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    const refs: Record<string, React.RefObject<HTMLDivElement>> = {
      programs: programsRef,
      about: aboutRef,
      contact: contactRef,
    };

    const ref = refs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Links from other pages arrive as /#contact or /#about. The browser's native
  // anchor jump fires before React mounts these sections, so scroll ourselves
  // once the page has rendered.
  useEffect(() => {
    const section = window.location.hash.replace("#", "");
    if (!section) return;
    const timer = setTimeout(() => scrollToSection(section), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    scrollToSection("contact");
  };

  const handleLearnMore = () => {
    scrollToSection("programs");
  };

  const handleProgramSelect = (program: string) => {
    console.log(`Selected program: ${program}`);
    scrollToSection("contact");
  };

  return (
    <div className="min-h-screen bg-night">
      <Header onNavigate={scrollToSection} />
      
      <main>
        <Hero
          onGetStarted={handleGetStarted}
          onLearnMore={handleLearnMore}
        />

        <SponsorMarquee />

        <div ref={programsRef}>
          <Programs onProgramSelect={handleProgramSelect} />
        </div>
        
        <div ref={aboutRef}>
          <About />
        </div>

        <div ref={contactRef}>
          <Contact />
        </div>
      </main>
      
      <Footer onNavigate={scrollToSection} />
    </div>
  );
}
