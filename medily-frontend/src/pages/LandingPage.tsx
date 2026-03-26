import React from "react";
import "../styles/LandingPage.css";

// Layout
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

// Sections
import HeroSection from "../components/ui/sections/HeroSection";
import FeaturesSection from "../components/ui/sections/FeaturesSection";
import SecureSharingSection from "../components/ui/sections/SecureSharingSection";
import ForDoctorsSection from "../components/ui/sections/ForDoctorsSection";
import MedicalFeedSection from "../components/ui/sections/MedicalFeedSection";
import CTASection from "../components/ui/sections/CTASection";

const LandingPage: React.FC = () => {
  return (
      <div className="landing-page">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <SecureSharingSection />
        <ForDoctorsSection />
        <MedicalFeedSection />
        <CTASection />
        <Footer />
      </div>
  );
};

export default LandingPage;