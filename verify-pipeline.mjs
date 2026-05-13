#!/usr/bin/env node
/**
 * verify-pipeline.mjs — Health check for uni-ops pipeline integrity
 *
 * Checks both data/applications.md (programs) and data/scholarships.md (scholarships).
 *
 * For each tracker:
 * 1. All statuses are canonical (per templates/states.yml)
 * 2. No duplicate university+program (or scholarship+body) entries
 * 3. Pending TSVs not yet merged
 * 4. Row format integrity
 *
 * Run: node verify-pipeline.mjs
 */

import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const UNI_OPS = dirname(fileURLToPath(import.meta.url));
const APPS_FILE = join(UNI_OPS, 'data/applications.md');
const SCHOLARS_FILE = join(UNI_OPS, 'data/scholarships.md');
const ADDITIONS_DIR = join(UNI_OPS, 'batch/tracker-additions');
const REPORTS_DIR = join(UNI_OPS, 'reports');

mkdirSync(join(UNI_OPS, 'data'), { recursive: true });
mkdirSync(REPORTS_DIR, { recursive: true });

const APP_STATUSES = ['drafting', 'submitted', 'awaiting decision', 'interview', 'admitted', 'waitlisted', 'rejected', 'withdrawn', 'skip'];
const SCHOLAR_STATUSES = ['identified', 'drafting', 'submitted', 'awaiting decision', 'interview', 'awarded', 'rejected', 'withdrawn', 'skip'];

const APP_ALIASES = {
  'draft': 'drafting', 'wip': 'drafting', 'in-progress': 'drafting',
  'applied': 'submitted', 'sent': 'submitted',
  'under-review': 'awaiting decision', 'in-review': 'awaiting decision', 'pending': 'awaiting decision',
  'interview-invited': 'interview', 'interviewing': 'interview',
  'accepted': 'admitted', 'offer': 'admitted',
  'waitlist': 'waitlisted',
  'denied': 'rejected',
  'withdrew': 'withdrawn',
  'no-fit': 'skip', 'monitor': 'skip',
};

const SCHOLAR_ALIASES = {
  'scanned': 'identified', 'found': 'identified',
  'draft': 'drafting', 'wip': 'drafting',
  'applied': 'submitted', 'sent': 'submitted',
  'under-review': 'awaiting decision',
  'panel': 'interview',
  'won': 'awarded', 'granted': 'awarded',
  'denied': 'rejected',
  'withdrew': 'withdrawn',
  'ineligible': 'skip', 'no-fit': 'skip',
};

let totalErrors = 0;
let totalWarnings = 0;

function error(msg) { console.log(`ERROR: ${msg}`); totalErrors++; }
function warn(msg)  { console.log(`WARN:  ${msg}`); totalWarnings++; }
function ok(msg)    { console.log(`OK:    ${msg}`); }

function parseTable(file) {
  if (!existsSync(file)) return null;
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  const rows = [];
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (line.includes('---')) continue;
    const parts = line.split('|').map(s => s.trim());
    parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();
    if (parts.length === 0) continue;
    const num = parseInt(parts[0]);
    if (isNaN(num)) continue;
    rows.push(parts);
  }
  return rows;
}

function checkTracker({ name, file, statuses, aliases, keyCols }) {
  console.log(`\n--- ${name} (${file}) ---`);
  const rows = parseTable(file);
  if (rows === null) {
    console.log(`No ${name} tracker yet — skipping.`);
    return;
  }
  if (rows.length === 0) {
    console.log(`Empty ${name} tracker — nothing to verify.`);
    return;
  }
  console.log(`Rows: ${rows.length}`);

  // Status check
  let badStatus = 0;
  const STATUS_COL = statuses === APP_STATUSES ? 9 : 7; // applications: col 10 (index 9), scholarships: col 8 (index 7)
  for (const row of rows) {
    const raw = (row[STATUS_COL] || '').replace(/\*\*/g, '').trim().toLowerCase();
    if (!raw) continue;
    if (!statuses.includes(raw) && !aliases[raw]) {
      error(`${name} #${row[0]}: non-canonical status "${row[STATUS_COL]}"`);
      badStatus++;
    }
    if (row[STATUS_COL].includes('**')) {
      error(`${name} #${row[0]}: status has markdown bold`);
      badStatus++;
    }
    if (/\d{4}-\d{2}-\d{2}/.test(row[STATUS_COL])) {
      error(`${name} #${row[0]}: status contains a date — move to a date column`);
      badStatus++;
    }
  }
  if (badStatus === 0) ok(`${name}: statuses canonical`);

  // Duplicate check
  const seen = new Map();
  let dups = 0;
  for (const row of rows) {
    const key = keyCols.map(c => (row[c] || '').toLowerCase().replace(/[^a-z0-9]/g, '')).join('::');
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key).push(row[0]);
  }
  for (const [key, ids] of seen) {
    if (ids.length > 1) {
      warn(`${name}: possible duplicates ${ids.map(i => `#${i}`).join(', ')}`);
      dups++;
    }
  }
  if (dups === 0) ok(`${name}: no exact duplicates`);
}

checkTracker({
  name: 'applications',
  file: APPS_FILE,
  statuses: APP_STATUSES,
  aliases: APP_ALIASES,
  keyCols: [2, 3], // University, Program (indexes after dropping leading empty)
});

checkTracker({
  name: 'scholarships',
  file: SCHOLARS_FILE,
  statuses: SCHOLAR_STATUSES,
  aliases: SCHOLAR_ALIASES,
  keyCols: [2, 3], // Scholarship, Body
});

// Pending TSVs
console.log('\n--- TSV staging ---');
let pendingTsvs = 0;
if (existsSync(ADDITIONS_DIR)) {
  const files = readdirSync(ADDITIONS_DIR).filter(f => f.endsWith('.tsv'));
  pendingTsvs = files.length;
  if (pendingTsvs > 0) {
    warn(`${pendingTsvs} pending TSVs in batch/tracker-additions/ — run \`npm run merge\``);
  }
}
if (pendingTsvs === 0) ok('No pending TSVs');

// Summary
console.log('\n' + '='.repeat(50));
console.log(`Pipeline Health: ${totalErrors} errors, ${totalWarnings} warnings`);
if (totalErrors === 0 && totalWarnings === 0) {
  console.log('Pipeline is clean.');
} else if (totalErrors === 0) {
  console.log('Pipeline OK with warnings.');
} else {
  console.log('Pipeline has errors — fix before proceeding.');
}
process.exit(totalErrors > 0 ? 1 : 0);
