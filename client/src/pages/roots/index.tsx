import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import DivisionSection from "./DivisionSection";
import PhotoBand from "./PhotoBand";
import FamilyFeedbackSection from "./FamilyFeedbackSection";
import FAQSection from "./FAQSection";
import CoachCTASection from "./CoachCTASection";
import FinalCTASection from "./FinalCTASection";
import "./roots.css";

export default function Roots() {
  return (
    <>
      <Header />
      <HeroSection />
      <DivisionSection />
      <PhotoBand />
      <FamilyFeedbackSection />
      <CoachCTASection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </>
  );
}
