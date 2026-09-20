#!/usr/bin/env node
"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync } = require("child_process");

const jobRe = /^\[\s*(queued|in progress|done)\s*\]\s*-\s*(.+)$/i;

function readStdin() {
  if (process.stdin.isTTY) return "";
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function parsePayload(raw) {
  const trimmed = String(raw || "").trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    return {};
  }
}

function gitRoot(cwd) {
  try {
    const out = execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd: cwd || process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.trim();
  } catch {
    return "";
  }
}

function findRepoRoot(start) {
  let dir = path.resolve(start || process.cwd());
  for (;;) {
    if (
      fs.existsSync(path.join(dir, "features.md")) ||
      fs.existsSync(path.join(dir, "package.json"))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return "";
    dir = parent;
  }
}

function gitConfigGet(root, key) {
  try {
    return execFileSync("git", ["config", "--get", key], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function huskyHooksPathOk(root) {
  const value = gitConfigGet(root, "core.hooksPath").replace(/\\/g, "/");
  if (!value) return false;
  const normalized = value.replace(/\/+$/, "");
  return normalized === ".husky/_" || normalized.endsWith("/.husky/_");
}

function ensureHusky(root) {
  const notes = [];
  const huskyBin = path.join(root, "node_modules", "husky", "bin.js");
  const preCommitPath = path.join(root, ".husky", "pre-commit");

  if (!fs.existsSync(huskyBin)) {
    notes.push(
      "Husky is not installed (node_modules/husky missing). Run npm install so the pre-commit build hook can run.",
    );
    return notes;
  }

  if (!huskyHooksPathOk(root)) {
    try {
      execFileSync(process.execPath, [huskyBin], {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 10000,
      });
      if (huskyHooksPathOk(root)) {
        notes.push("Initialized Husky git hooks (core.hooksPath=.husky/_).");
      } else {
        notes.push(
          "Tried to initialize Husky but core.hooksPath is still unset. Run npm run prepare.",
        );
      }
    } catch (err) {
      const detail = err && err.message ? err.message : String(err);
      notes.push(`Failed to initialize Husky: ${detail}. Run npm run prepare.`);
    }
  }

  if (!fs.existsSync(preCommitPath)) {
    try {
      fs.mkdirSync(path.dirname(preCommitPath), { recursive: true });
      fs.writeFileSync(preCommitPath, "npm run build\n");
      notes.push("Restored .husky/pre-commit (npm run build).");
    } catch (err) {
      const detail = err && err.message ? err.message : String(err);
      notes.push(`Missing .husky/pre-commit and could not restore it: ${detail}.`);
    }
  }

  return notes;
}

function alreadyEmitted(sessionId, source) {
  if (!sessionId) return false;
  const safeSession = String(sessionId).replace(/[^a-zA-Z0-9._-]/g, "_");
  const safeSource = String(source || "startup").replace(/[^a-zA-Z0-9._-]/g, "_");
  const stamp = path.join(
    os.tmpdir(),
    `fortuna-session-start-${safeSession}-${safeSource}`,
  );
  try {
    fs.writeFileSync(stamp, "1", { flag: "wx" });
    return false;
  } catch (err) {
    return err && err.code === "EEXIST";
  }
}

function emit(additionalContext) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "SessionStart",
        additionalContext,
      },
    }) + "\n",
  );
}

function parseJobs(markdown) {
  const inProgress = [];
  const queued = [];
  let inFence = false;
  for (const raw of markdown.split(/\r?\n/)) {
    if (raw.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = jobRe.exec(raw.trim());
    if (!match) continue;
    const status = match[1].toLowerCase();
    const text = match[2].trim();
    if (status === "in progress") inProgress.push(text);
    else if (status === "queued") queued.push(text);
  }
  return { inProgress, queued };
}

function isDeferred(text) {
  return /^example\b/i.test(text) || /\bdo not implement\b/i.test(text);
}

function contextFor({ inProgress, queued }) {
  const skipUnlessAsked =
    "If the job text says not to implement unless asked, leave it queued and stop. Do not promote unmarked bullets into jobs.";

  if (inProgress.length > 0) {
    return [
      "Job queue (features.md): continue the in-progress job, then create exactly one git commit when it is done.",
      `Current job: ${inProgress[0]}.`,
      "Mark it [ done ] when finished. Do not start another queued job unless the user asks.",
      "Follow AGENTS.md commit rules. features.md is the source of truth — re-read it before editing.",
      skipUnlessAsked,
    ].join(" ");
  }

  const actionable = queued.filter((text) => !isDeferred(text));
  if (actionable.length > 0) {
    return [
      "Job queue (features.md): unless the user gave a different explicit task this session, take the next queued job.",
      `Next job: ${actionable[0]}.`,
      "Flip it to [ in progress ] before changing product code, implement only that job, mark [ done ], then create exactly one git commit for it.",
      "Follow AGENTS.md commit rules. Do not start further queued jobs.",
      skipUnlessAsked,
    ].join(" ");
  }

  if (queued.length > 0) {
    return [
      "Job queue (features.md): the remaining queued jobs are examples or marked do-not-implement.",
      "Follow the user's prompt. Do not start them unless asked. Do not invent work from unmarked lines.",
    ].join(" ");
  }

  return [
    "Job queue (features.md): no queued or in-progress jobs.",
    "Follow the user's prompt. Do not invent work from unmarked lines.",
  ].join(" ");
}

const payload = parsePayload(readStdin());
const sessionId =
  payload.sessionId ||
  payload.session_id ||
  process.env.GROK_SESSION_ID ||
  process.env.CLAUDE_SESSION_ID ||
  "";
const source = payload.source || "startup";

const hint =
  payload.workspaceRoot ||
  payload.cwd ||
  process.env.GROK_WORKSPACE_ROOT ||
  process.env.CLAUDE_PROJECT_DIR ||
  process.cwd();
const root =
  gitRoot(hint) ||
  findRepoRoot(hint) ||
  path.resolve(hint);

const huskyNotes = ensureHusky(root);

if (alreadyEmitted(sessionId, source)) {
  process.exit(0);
}

function withHuskyNotes(text) {
  if (huskyNotes.length === 0) return text;
  return `${text} Husky: ${huskyNotes.join(" ")}`;
}

const featuresPath = path.join(root, "features.md");
if (!fs.existsSync(featuresPath)) {
  emit(
    withHuskyNotes(
      "features.md is missing. Do not invent jobs. Follow the user's prompt only.",
    ),
  );
  process.exit(0);
}

emit(
  withHuskyNotes(contextFor(parseJobs(fs.readFileSync(featuresPath, "utf8")))),
);
