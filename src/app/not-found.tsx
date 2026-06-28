import type { Metadata } from "next";
import Terminal404 from "@/components/Terminal404";

export const metadata: Metadata = {
  title: "404 — Dawson Do",
};

export default function NotFound() {
  return <Terminal404 />;
}
