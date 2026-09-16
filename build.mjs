import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const outputDirectory = join(process.cwd(), "dist");
const staticFiles = [
  "index.html",
  "app.js",
  "data.js",
  "styles.css",
  "favicon.svg"
];

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of staticFiles) {
  cpSync(join(process.cwd(), file), join(outputDirectory, file));
}

console.log(`Static Sport Day site built in ${outputDirectory}`);
