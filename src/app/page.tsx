import Hero from "@/components/Hero";
import About from "@/components/About";
import SelectedWorkSection from "@/components/SelectedWorkSection";
import HowIBuild from "@/components/HowIBuild";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SelectedWorkSection />
      <HowIBuild />
      <Stack />
      <Contact />
    </main>
  );
}
