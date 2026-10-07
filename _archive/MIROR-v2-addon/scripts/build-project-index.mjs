import { readFile, writeFile } from "node:fs/promises";

const input = process.argv[2] ?? "sample-projects.json";
const output = process.argv[3] ?? "public/project-index.json";
const raw = JSON.parse(await readFile(input, "utf8"));

if (!Array.isArray(raw)) throw new Error("Expected a project array.");

const index = raw.map((project, position) => ({
  position: position + 1,
  slug: project.slug,
  title: project.title,
  category: project.category,
  location: project.location ?? null,
  status: project.status ?? "client-supplied-pending",
}));

await writeFile(output, JSON.stringify(index, null, 2) + "\n", "utf8");
console.log(`Indexed ${index.length} project records -> ${output}`);
