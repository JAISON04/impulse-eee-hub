import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedEvents from "@/components/FeaturedEvents";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/CircuitBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <CircuitBackground />
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <StatsSection />
        <FeaturedEvents />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
