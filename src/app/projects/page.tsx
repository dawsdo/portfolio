import type { Metadata } from "next";
import SelectedWorkSection from "@/components/SelectedWorkSection";

export const metadata: Metadata = {
  title: "Projects — Dawson Do",
  description:
    "Selected projects — collision analysis drone, seizure diary platform, AWS cloud file distribution.",
};

export default function ProjectsPage() {
  return (
    <main>
      <SelectedWorkSection />
    </main>
  );
}
