import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "./HeroSection";
import DashboardSection from "./DashboardSection";
import WhatsDifferentSection from "./WhatsDifferentSection";
import SurveySection from "./SurveySection";
import BenefitsSection from "./BenefitsSection";
import FAQSection from "./FAQSection";
import FinalCTASection from "./FinalCTASection";
import ApplyModal from "./ApplyModal";
import "./coach.css";

export default function CoachWithUs() {
  const [modalOpen, setModalOpen] = useState(false);
  const open = useCallback(() => setModalOpen(true), []);
  const close = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <Header />
      <HeroSection onApply={open} />
      <DashboardSection onApply={open} />
      <WhatsDifferentSection />
      <SurveySection />
      <BenefitsSection />
      <FAQSection />
      <FinalCTASection onApply={open} />
      <Footer />
      <ApplyModal open={modalOpen} onClose={close} />
    </>
  );
}
