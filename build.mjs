import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDirectory = join(process.cwd(), "dist");
const staticFiles = [
  "index.html",
  "app.js",
  "cloud.js",
  "data.js",
  "styles.css",
  "favicon.svg"
];

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

for (const file of staticFiles) {
  cpSync(join(process.cwd(), file), join(outputDirectory, file));
}

function localSupabaseConfig() {
  const keyPath = join(process.cwd(), "supbase", "key");
  if (!existsSync(keyPath)) return {};
  const text = readFileSync(keyPath, "utf8").trim();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    return {
      url: parsed.SUPABASE_URL || parsed.url || parsed.projectUrl,
      key: parsed.SUPABASE_ANON_KEY || parsed.anonKey || parsed.publishableKey
    };
  } catch {
    const url = text.match(/SUPABASE_URL\s*=\s*["']?([^\s"']+)/)?.[1] || text.match(/https:\/\/[^\s"']+\.supabase\.co/)?.[0];
    const key = text.match(/SUPABASE_(?:ANON_KEY|PUBLISHABLE_KEY)\s*=\s*["']?([^\s"']+)/)?.[1] || text.match(/(?:sb_publishable_|eyJ)[A-Za-z0-9._-]+/)?.[0];
    return { url, key };
  }
}

const localConfig = localSupabaseConfig();
const publicConfig = {
  supabaseUrl: process.env.SUPABASE_URL || localConfig.url || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || localConfig.key || ""
};
writeFileSync(join(outputDirectory, "runtime-config.js"), `window.SPORT_DAY_CONFIG = ${JSON.stringify(publicConfig)};\n`);

console.log(`Static Sport Day site built in ${outputDirectory}`);
console.log(`Supabase configuration: ${publicConfig.supabaseUrl && publicConfig.supabaseAnonKey ? "enabled" : "not configured"}`);
