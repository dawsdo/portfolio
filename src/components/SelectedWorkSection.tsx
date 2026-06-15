import fs from "fs";
import path from "path";
import SelectedWork, { type ProjectCard, type Metric } from "@/components/SelectedWork";

const PROJECT_ORDER = ["drone", "seizure-diary", "cloud-files"] as const;

type RawSegment = { text: string; emphasis?: boolean };
type RawProject = {
  slug: string;
  title: string;
  dates: string;
  description: string;
  metricsSegments: RawSegment[][];
  tags: string[];
};

function readProject(slug: string): ProjectCard | null {
  try {
    const filePath = path.join(process.cwd(), "content", "projects", `${slug}.json`);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as RawProject;
    return {
      slug: raw.slug,
      title: raw.title,
      dates: raw.dates,
      description: raw.description,
      metrics: (raw.metricsSegments ?? []) as Metric[],
      tags: raw.tags,
    };
  } catch {
    return null;
  }
}

export default function SelectedWorkSection() {
  const projects = PROJECT_ORDER
    .map(readProject)
    .filter((p): p is ProjectCard => p !== null);

  return <SelectedWork projects={projects} />;
}
