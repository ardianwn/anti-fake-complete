#!/usr/bin/env node

import { readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import process from "node:process";

const IGNORED_DIRECTORIES = new Set([".git", "node_modules", "dist", "build", "coverage"]);
const SECRET_PATTERNS = [
  { name: "private key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
  { name: "AWS access key", pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: "GitHub token", pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/ },
  { name: "provider API key", pattern: /\b(?:sk|nvapi)-[A-Za-z0-9_-]{20,}\b/ },
  {
    name: "secret assignment",
    pattern: /\b(?:api[_-]?key|secret|password|token)\b\s*[:=]\s*["'][^"'$\n]{12,}["']/i,
  },
];

const TEXT_EXTENSIONS = new Set([
  ".cjs", ".css", ".env", ".example", ".go", ".html", ".java", ".js", ".json",
  ".jsx", ".md", ".mjs", ".py", ".rb", ".rs", ".sh", ".sql", ".swift", ".ts",
  ".tsx", ".toml", ".txt", ".xml", ".yaml", ".yml",
]);

async function collectFiles(path, files = []) {
  const info = await stat(path);
  if (info.isFile()) {
    files.push(path);
    return files;
  }

  const entries = await (await import("node:fs/promises")).readdir(path, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    await collectFiles(join(path, entry.name), files);
  }
  return files;
}

async function main() {
  const roots = process.argv.slice(2);
  if (roots.length === 0) {
    console.error("Usage: secret-scan.mjs <file-or-directory> [...]");
    process.exitCode = 2;
    return;
  }

  const files = (await Promise.all(roots.map((root) => collectFiles(root)))).flat();
  const findings = [];
  for (const file of files) {
    const extension = file.slice(file.lastIndexOf(".")).toLowerCase();
    if (!TEXT_EXTENSIONS.has(extension) && !file.endsWith(".env")) continue;
    const content = await readFile(file, "utf8");
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const { name, pattern } of SECRET_PATTERNS) {
        if (pattern.test(line) && !line.trimStart().startsWith("#")) {
          findings.push(`${relative(process.cwd(), file)}:${index + 1} ${name}`);
          break;
        }
      }
    });
  }

  if (findings.length > 0) {
    console.error(`Potential secrets found (${findings.length}):`);
    console.error(findings.join("\n"));
    process.exitCode = 1;
    return;
  }
  console.log(`Secret scan passed (${files.length} files inspected)`);
}

await main();
