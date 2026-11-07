#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";

const VALID_STATUSES = new Set(["verified", "partial", "unverified", "failed"]);
const VALID_LEVELS = new Set([0, 1, 2, 3, 4, 5, 6]);

function fail(message) {
  console.error(`Invalid completion report: ${message}`);
  process.exitCode = 1;
}

function validateStatusEvidence(status, strongestLevel, minimumLevel, criterionId) {
  if (status !== "verified") {
    return;
  }
  if (strongestLevel < minimumLevel) {
    throw new Error(
      `criterion "${criterionId}" reaches L${strongestLevel}, below required L${minimumLevel}`,
    );
  }
}

function validateEvidence(evidence, criterionId) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    throw new Error(`criterion "${criterionId}" has no evidence`);
  }

  for (const item of evidence) {
    if (!item || typeof item !== "object") {
      throw new Error(`criterion "${criterionId}" contains invalid evidence`);
    }
    if (!VALID_LEVELS.has(item.level)) {
      throw new Error(`criterion "${criterionId}" has an invalid evidence level`);
    }
    if (typeof item.command !== "string" || item.command.trim() === "") {
      throw new Error(`criterion "${criterionId}" evidence needs a command`);
    }
    if (typeof item.result !== "string" || item.result.trim() === "") {
      throw new Error(`criterion "${criterionId}" evidence needs an observed result`);
    }
  }
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    fail("usage: validate-report.mjs <report.json>");
    return;
  }

  let report;
  try {
    report = JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    fail(`cannot read JSON (${error.message})`);
    return;
  }

  if (!report || typeof report !== "object" || Array.isArray(report)) {
    fail("report must be a JSON object");
    return;
  }
  if (!VALID_STATUSES.has(report.status)) {
    fail(`status must be one of: ${[...VALID_STATUSES].join(", ")}`);
    return;
  }
  if (!Array.isArray(report.criteria) || report.criteria.length === 0) {
    fail("criteria must be a non-empty array");
    return;
  }

  try {
    for (const criterion of report.criteria) {
      if (!criterion || typeof criterion !== "object") {
        throw new Error("each criterion must be an object");
      }
      if (typeof criterion.id !== "string" || criterion.id.trim() === "") {
        throw new Error("each criterion needs a non-empty id");
      }
      if (!VALID_LEVELS.has(criterion.minimumEvidenceLevel)) {
        throw new Error(`criterion "${criterion.id}" has an invalid minimum level`);
      }
      validateEvidence(criterion.evidence, criterion.id);

      const strongestLevel = Math.max(...criterion.evidence.map((item) => item.level));
      validateStatusEvidence(
        report.status,
        strongestLevel,
        criterion.minimumEvidenceLevel,
        criterion.id,
      );
    }
  } catch (error) {
    fail(error.message);
    return;
  }

  console.log(`Valid completion report: ${report.status} (${report.criteria.length} criteria)`);
}

await main();
