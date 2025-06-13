import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import RTIComposer from "@/components/rti-composer-new";
import TemplatesSection from "@/components/templates-section-new";
import GuestCTA from "@/components/guest-cta";
import Footer from "@/components/footer-new";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      <Navigation />
      <HeroSection />
      <RTIComposer />
      <TemplatesSection />
      <GuestCTA />
      <Footer />
    </div>
  );
}
