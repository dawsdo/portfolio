import type { Metadata } from "next";
import Contact from "@/components/Contact";

export const metadata: Metadata = {
  title: "Contact — Dawson Do",
  description: "Get in touch with Dawson Do.",
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
    </main>
  );
}
