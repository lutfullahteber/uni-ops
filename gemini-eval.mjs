#!/usr/bin/env node
/**
 * gemini-eval.mjs — Gemini-powered University Program Evaluator for uni-ops
 *
 * A free-tier alternative to the Claude-based pipeline.
 * Reads evaluation logic from modes/program.md + modes/_shared.md, reads
 * the user's CV from cv.md (+ academic-record.md when present), and
 * evaluates a program listing passed as a command-line argument.
 *
 * Usage:
 *   node gemini-eval.mjs "Paste full program page text here"
 *   node gemini-eval.mjs --file ./jds/tum-msc-informatics.txt
 *   node gemini-eval.mjs --url https://...   (text must still be pasted; URL is metadata)
 *
 * Requires:
 *   GEMINI_API_KEY in .env (or environment variable)
 *
 * Free-tier model: gemini-2.0-flash (generous quota, no billing required)
 */

import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Bootstrap: load .env before anything else
// ---------------------------------------------------------------------------
try {
  const { config } = await import('dotenv');
  config();
} catch {
  // dotenv is optional — fall back to process.env if not installed
}

import { GoogleGenerativeAI } from '@google/generative-ai';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const ROOT = dirname(fileURLToPath(import.meta.url));

const PATHS = {
  shared:        join(ROOT, 'modes', '_shared.md'),
  program:       join(ROOT, 'modes', 'program.md'),
  profile:       join(ROOT, 'config', 'profile.yml'),
  userProfile:   join(ROOT, 'modes', '_profile.md'),
  cv:            join(ROOT, 'cv.md'),
  academic:      join(ROOT, 'academic-record.md'),
  extras:        join(ROOT, 'extracurriculars.md'),
  reports:       join(ROOT, 'reports'),
  tracker:       join(ROOT, 'data', 'applications.md'),
};

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║       uni-ops — Gemini Program Evaluator (free-tier)             ║
╚══════════════════════════════════════════════════════════════════╝

  Evaluate a university program using Google Gemini instead of Claude.

  USAGE
    node gemini-eval.mjs "<program page text>"
    node gemini-eval.mjs --file ./jds/program.txt
    node gemini-eval.mjs --url <program-url> --file ./jds/program.txt
    node gemini-eval.mjs --model gemini-2.0-flash "<program text>"

  OPTIONS
    --file <path>    Read program text from a file
    --url <url>      Program URL (metadata; embedded in report header)
    --model <name>   Gemini model to use (default: gemini-2.0-flash)
    --no-save        Do not save report to reports/ directory
    --help           Show this help

  SETUP
    1. Get a free API key at https://aistudio.google.com/apikey
    2. Add GEMINI_API_KEY=<your-key> to .env
    3. Run: npm install   (installs @google/generative-ai + dotenv)

  EXAMPLES
    node gemini-eval.mjs "MSc Informatics at TU Munich..."
    node gemini-eval.mjs --url https://cit.tum.de/... --file ./jds/tum.txt
`);
  process.exit(0);
}

let programText = '';
let programUrl = '';
let modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
let saveReport = true;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--file' && args[i + 1]) {
    const filePath = args[++i];
    if (!existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    programText += (programText ? '\n' : '') + readFileSync(filePath, 'utf-8').trim();
  } else if (args[i] === '--url' && args[i + 1]) {
    programUrl = args[++i];
  } else if (args[i] === '--model' && args[i + 1]) {
    modelName = args[++i];
  } else if (args[i] === '--no-save') {
    saveReport = false;
  } else if (!args[i].startsWith('--')) {
    programText += (programText ? '\n' : '') + args[i];
  }
}

if (!programText) {
  console.error('No program text provided. Run with --help for usage.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Validate environment
// ---------------------------------------------------------------------------
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error(`
GEMINI_API_KEY not found.

   1. Get a free key at https://aistudio.google.com/apikey
   2. Add it to .env:   GEMINI_API_KEY=your_key_here
   3. Or export it:     export GEMINI_API_KEY=your_key_here
`);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// File helpers
// ---------------------------------------------------------------------------
function readFile(path, label, optional = false) {
  if (!existsSync(path)) {
    if (!optional) console.warn(`${label} not found at: ${path}`);
    return `[${label} not found — skipping]`;
  }
  return readFileSync(path, 'utf-8').trim();
}

function nextReportNumber() {
  if (!existsSync(PATHS.reports)) return '001';
  const nums = readdirSync(PATHS.reports)
    .filter(f => /^\d{3}-/.test(f))
    .map(f => parseInt(f.slice(0, 3), 10))
    .filter(n => !isNaN(n));
  if (nums.length === 0) return '001';
  return String(Math.max(...nums) + 1).padStart(3, '0');
}

function slug(s) {
  return (s || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ---------------------------------------------------------------------------
// Load context files
// ---------------------------------------------------------------------------
console.log('\nLoading context files...');

const sharedContext  = readFile(PATHS.shared,      'modes/_shared.md');
const programLogic   = readFile(PATHS.program,     'modes/program.md');
const profileYaml    = readFile(PATHS.profile,     'config/profile.yml', true);
const userProfile    = readFile(PATHS.userProfile, 'modes/_profile.md',  true);
const cvContent      = readFile(PATHS.cv,          'cv.md');
const academic       = readFile(PATHS.academic,    'academic-record.md', true);
const extras         = readFile(PATHS.extras,      'extracurriculars.md', true);

// ---------------------------------------------------------------------------
// Build the system prompt (mirrors the Claude skill router logic)
// ---------------------------------------------------------------------------
const systemPrompt = `You are uni-ops, an AI-powered university & scholarship application assistant.
You evaluate university programs against the student's CV and academic record using the structured A–G scoring system.

Follow the methodology exactly as defined below.

═══════════════════════════════════════════════════════
SYSTEM CONTEXT (_shared.md)
═══════════════════════════════════════════════════════
${sharedContext}

═══════════════════════════════════════════════════════
EVALUATION MODE (program.md)
═══════════════════════════════════════════════════════
${programLogic}

═══════════════════════════════════════════════════════
STUDENT PROFILE (config/profile.yml)
═══════════════════════════════════════════════════════
${profileYaml}

═══════════════════════════════════════════════════════
STUDENT CUSTOMIZATION (modes/_profile.md)
═══════════════════════════════════════════════════════
${userProfile}

═══════════════════════════════════════════════════════
CANDIDATE CV (cv.md)
═══════════════════════════════════════════════════════
${cvContent}

═══════════════════════════════════════════════════════
ACADEMIC RECORD (academic-record.md)
═══════════════════════════════════════════════════════
${academic}

═══════════════════════════════════════════════════════
EXTRACURRICULARS (extracurriculars.md)
═══════════════════════════════════════════════════════
${extras}

═══════════════════════════════════════════════════════
IMPORTANT OPERATING RULES FOR THIS CLI SESSION
═══════════════════════════════════════════════════════
1. You do NOT have access to WebSearch, Playwright, or file-writing tools.
   - For Block C (faculty / lab research): use only the program text supplied; if specific faculty names are not in the text, state that explicitly instead of guessing.
   - For Block D (Funding fit): use numbers from profile.yml (funding.total_annual_cap, scholarships) and any tuition/living figures present in the program text. Mark estimates as such.
   - For Block G (Legitimacy): analyze the supplied program text only; skip live URL freshness checks. If a URL was provided via --url, use it for context (domain reputation, official institution domain).
   - Post-evaluation file saving is handled by this script, not by you.
2. Generate Blocks A through G in full, in English unless the program text is in another language.
3. NEVER fabricate GPA, test scores, course grades, or publications. Always cite from cv.md / academic-record.md.
4. At the very end, output a machine-readable summary block in this exact format:

---SCORE_SUMMARY---
UNIVERSITY: <university name or "Unknown">
PROGRAM: <program name>
COUNTRY: <country or "Unknown">
DEADLINE: <YYYY-MM-DD or "Unknown" or "rolling">
TUITION_PER_YEAR: <number with currency or "Unknown">
NET_COST_PER_YEAR: <number with currency or "Unknown">
SCORE: <global score as decimal, e.g. 4.3>
ARCHETYPE: <detected archetype>
LEGITIMACY: <High Confidence | Proceed with Caution | Suspicious>
---END_SUMMARY---
`;

// ---------------------------------------------------------------------------
// Call Gemini API
// ---------------------------------------------------------------------------
console.log(`Calling Gemini (${modelName})... this may take 30-60 seconds.\n`);

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: modelName,
  generationConfig: {
    temperature: 0.4,
    maxOutputTokens: 8192,
  },
});

const userMessage = (programUrl ? `PROGRAM URL: ${programUrl}\n\n` : '') +
  `PROGRAM LISTING TO EVALUATE:\n\n${programText}`;

let evaluationText;
try {
  const result = await model.generateContent([
    { text: systemPrompt },
    { text: userMessage },
  ]);
  evaluationText = result.response.text();
} catch (err) {
  console.error('Gemini API error:', err.message);
  if (err.message?.includes('API_KEY')) {
    console.error('    Check your GEMINI_API_KEY in .env');
  } else if (err.message?.includes('quota') || err.message?.includes('rate')) {
    console.error('    You may have hit the free-tier rate limit. Wait 60s and retry.');
  }
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Display evaluation
// ---------------------------------------------------------------------------
console.log('\n' + '═'.repeat(66));
console.log('  UNI-OPS PROGRAM EVALUATION — powered by Google Gemini');
console.log('═'.repeat(66) + '\n');
console.log(evaluationText);

// ---------------------------------------------------------------------------
// Parse score summary
// ---------------------------------------------------------------------------
const summaryMatch = evaluationText.match(
  /---SCORE_SUMMARY---\s*([\s\S]*?)---END_SUMMARY---/
);

let university       = 'unknown';
let program          = 'unknown';
let country          = 'unknown';
let deadline         = 'unknown';
let tuitionPerYear   = 'unknown';
let netCostPerYear   = 'unknown';
let score            = '?';
let archetype        = 'unknown';
let legitimacy       = 'unknown';

if (summaryMatch) {
  const block = summaryMatch[1];
  const extract = (key) => {
    const m = block.match(new RegExp(`${key}:\\s*(.+)`));
    return m ? m[1].trim() : 'unknown';
  };
  university     = extract('UNIVERSITY');
  program        = extract('PROGRAM');
  country        = extract('COUNTRY');
  deadline       = extract('DEADLINE');
  tuitionPerYear = extract('TUITION_PER_YEAR');
  netCostPerYear = extract('NET_COST_PER_YEAR');
  score          = extract('SCORE');
  archetype      = extract('ARCHETYPE');
  legitimacy     = extract('LEGITIMACY');
}

// ---------------------------------------------------------------------------
// Save report
// ---------------------------------------------------------------------------
if (saveReport) {
  try {
    if (!existsSync(PATHS.reports)) {
      mkdirSync(PATHS.reports, { recursive: true });
    }

    const num         = nextReportNumber();
    const today       = new Date().toISOString().split('T')[0];
    const uniSlug     = slug(university);
    const progSlug    = slug(program);
    const filename    = `${num}-${uniSlug}-${progSlug}-${today}.md`;
    const reportPath  = join(PATHS.reports, filename);

    const reportContent = `# Evaluation: ${university} — ${program}

**Date:** ${today}
**URL:** ${programUrl || 'n/a'}
**Archetype:** ${archetype}
**Score:** ${score}/5
**Legitimacy:** ${legitimacy}
**Country:** ${country}
**Deadline:** ${deadline}
**Tuition/year:** ${tuitionPerYear}
**Net cost/year:** ${netCostPerYear}
**SoP draft:** pending
**Tool:** Gemini (${modelName})

---

${evaluationText.replace(/---SCORE_SUMMARY---[\s\S]*?---END_SUMMARY---/, '').trim()}
`;

    writeFileSync(reportPath, reportContent, 'utf-8');
    console.log(`\nReport saved: reports/${filename}`);

    // Emit TSV for merge-tracker (uni-ops applications schema)
    const tsvDir = join(ROOT, 'batch', 'tracker-additions');
    mkdirSync(tsvDir, { recursive: true });
    const tsvPath = join(tsvDir, `${num}-${uniSlug}.tsv`);
    const tsvHeader = 'target\tnum\tdate\tuniversity\tprogram\tcountry\tdeadline\ttuition_per_year\tnet_cost_per_year\tfit_score\tstatus\tsop\tcv\trec_letters\tdecision\tnotes\n';
    const tsvRow = `applications\t${num}\t${today}\t${university}\t${program}\t${country}\t${deadline}\t${tuitionPerYear}\t${netCostPerYear}\t${score}\tDrafting\tpending\tpending\t0/3\t\tGemini eval\n`;
    writeFileSync(tsvPath, tsvHeader + tsvRow, 'utf-8');
    console.log(`Tracker TSV staged: batch/tracker-additions/${num}-${uniSlug}.tsv`);
    console.log('Run `npm run merge` to consolidate into data/applications.md.');
  } catch (err) {
    console.warn(`Could not save report: ${err.message}`);
  }
}

console.log('\n' + '─'.repeat(66));
console.log(`  Score: ${score}/5  |  Archetype: ${archetype}  |  Legitimacy: ${legitimacy}`);
console.log('─'.repeat(66) + '\n');
