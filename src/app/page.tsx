import HeroSection from "@/components/home/HeroSection";
import ProblemSection from "@/components/home/ProblemSection";
import SolutionSection from "@/components/home/SolutionSection";
import RoadmapSection from "@/components/home/RoadmapSection";
import OutcomesSection from "@/components/home/OutcomesSection";
import CallToAction from "@/components/home/CallToAction";
import TubesBackground from "@/components/home/TubesBackground";

export default function Home() {
  return (
    <TubesBackground>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <RoadmapSection />
      <OutcomesSection />
      <CallToAction />
    </TubesBackground>
  );
}
