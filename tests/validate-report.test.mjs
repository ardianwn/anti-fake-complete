import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";
import assert from "node:assert/strict";

const execFileAsync = promisify(execFile);
const validator = join(
  process.cwd(),
  "skills/anti-fake-complete/scripts/validate-report.mjs",
);

async function runReport(report) {
  const directory = await mkdtemp(join(tmpdir(), "anti-fake-complete-"));
  const file = join(directory, "report.json");
  await writeFile(file, JSON.stringify(report), "utf8");
  return execFileAsync(process.execPath, [validator, file]);
}

test("accepts verified evidence at the required level", async () => {
  const result = await runReport({
    status: "verified",
    criteria: [
      {
        id: "feature",
        minimumEvidenceLevel: 3,
        evidence: [{ level: 3, command: "npm test", result: "1 test passed" }],
      },
    ],
  });

  assert.match(result.stdout, /Valid completion report: verified/);
});

test("rejects verified claims below the required evidence level", async () => {
  await assert.rejects(
    runReport({
      status: "verified",
      criteria: [
        {
          id: "runtime",
          minimumEvidenceLevel: 5,
          evidence: [{ level: 2, command: "npm run lint", result: "passed" }],
        },
      ],
    }),
    (error) => {
      assert.match(error.stderr, /below required L5/);
      return true;
    },
  );
});

test("rejects evidence without an observed result", async () => {
  await assert.rejects(
    runReport({
      status: "partial",
      criteria: [
        {
          id: "feature",
          minimumEvidenceLevel: 1,
          evidence: [{ level: 1, command: "git diff" }],
        },
      ],
    }),
    (error) => {
      assert.match(error.stderr, /needs an observed result/);
      return true;
    },
  );
});
