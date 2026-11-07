import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);
const scanner = join(
  process.cwd(),
  "skills/anti-fake-complete/scripts/secret-scan.mjs",
);

async function runScan(content) {
  const directory = await mkdtemp(join(tmpdir(), "anti-fake-secret-scan-"));
  const file = join(directory, "fixture.mjs");
  await writeFile(file, content, "utf8");
  return execFileAsync(process.execPath, [scanner, file]);
}

test("passes source without secret-shaped values", async () => {
  const result = await runScan("const apiKey = process.env.API_KEY;\n");
  assert.match(result.stdout, /Secret scan passed/);
});

test("fails on a private key", async () => {
  await assert.rejects(
    runScan(`const key = '-----BEGIN ${"PRIVATE KEY"}-----';\n`),
    (error) => {
      assert.match(error.stderr, /private key/);
      return true;
    },
  );
});
