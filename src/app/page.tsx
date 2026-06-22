import Hero from "@/components/Hero";
import About from "@/components/About";
import SelectedWorkSection from "@/components/SelectedWorkSection";
import Stack from "@/components/Stack";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SelectedWorkSection />
      <Stack />
      <Contact />
    </main>
  );
}
