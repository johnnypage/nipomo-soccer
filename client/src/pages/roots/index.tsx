import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import WhatIsSection from "./WhatIsSection";
import WhatsNewSection from "./WhatsNewSection";
import DivisionSection from "./DivisionSection";
import FamilyFeedbackSection from "./FamilyFeedbackSection";
import PathwaySection from "./PathwaySection";
import FAQSection from "./FAQSection";
import CoachCTASection from "./CoachCTASection";
import FinalCTASection from "./FinalCTASection";
import "./roots.css";

export default function Roots() {
  return (
    <>
      <Header />
      <HeroSection />
      <WhatIsSection />
      <DivisionSection />
      <WhatsNewSection />
      <FamilyFeedbackSection />
      <CoachCTASection />
      <FAQSection />
      <PathwaySection />
      <FinalCTASection />
      <Footer />
    </>
  );
}
