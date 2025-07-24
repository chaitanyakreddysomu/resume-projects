import React from "react";

import Footer from "@/components/Footer";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from "@/components/Navigation";
import WhatsAppButton from "@/components/WhatsAppButton";
import Heromain from "@/components/Services/HeroMain";
import TechnologiesSection from "@/components/Services/TechnologiesSection";
import ServicesSection from "@/components/Services/ServicesSection";
import ExpertiseSection from "@/components/Services/ExpertiseSection";
import ToolsSection from "@/components/Services/ToolSection";
import ResourcesSection from "@/components/Services/ResourcesSection";

const ServicePage = () => {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
    {/* <div className="min-h-screen bg-background overflow-x-hidden"></div> */}
      <Navigation />
      <WhatsAppButton />
      <Heromain />
      <TechnologiesSection />
      <ServicesSection />
      <ExpertiseSection />
      <ResourcesSection />
      
      <ToolsSection />

      <Footer />
    </>
  );
};

export default ServicePage;
