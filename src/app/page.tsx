import Hero from "@/components/Hero";
import About from "@/components/About";
import SelectedWork from "@/components/SelectedWork";
import HowIBuild from "@/components/HowIBuild";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SelectedWork />
      <HowIBuild />
      <Stack />
      <Contact />
    </main>
  );
}
