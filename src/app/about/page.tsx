import type { Metadata } from "next";
import About from "@/components/About";
import Stack from "@/components/Stack";

export const metadata: Metadata = {
  title: "About — Dawson Do",
  description:
    "CS student at UAB building full-stack web, cloud, and applied ML systems.",
};

export default function AboutPage() {
  return (
    <main>
      <About />
      <Stack />
    </main>
  );
}
