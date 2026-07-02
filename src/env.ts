import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

function loadEnvFile(path: string): void {
  if (!existsSync(path)) return;

  const content = readFileSync(path, "utf-8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

/** Load API keys and defaults from .env files (does not override existing env vars). */
export function loadDotEnv(): void {
  loadEnvFile(join(homedir(), ".claude", ".env"));
  loadEnvFile(join(process.cwd(), ".env"));
}
