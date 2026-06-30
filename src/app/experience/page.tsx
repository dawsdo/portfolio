import type { Metadata } from "next";
import WorkHistory from "@/components/WorkHistory";

export const metadata: Metadata = {
  title: "Experience — Dawson Do",
  description:
    "Work history — student technical support and delivery while studying CS at UAB.",
};

export default function ExperiencePage() {
  return (
    <main>
      <WorkHistory />
    </main>
  );
}
