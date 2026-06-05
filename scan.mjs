#!/usr/bin/env node

/**
 * scan.mjs — University program scanner
 *
 * Reads programs.yml, fetches each tracked_programs.program_url to confirm
 * it is still live, applies title_filter, deduplicates against
 * data/scan-history.tsv + data/pipeline.md + data/applications.md, and
 * appends new program URLs to pipeline.md for downstream evaluation.
 *
 * Universities do NOT expose stable Greenhouse/Ashby/Lever-style APIs, so
 * the Node script only handles `tracked_programs` (concrete URLs). The
 * search_queries section is agent-only: run `/uni-ops scan` for the
 * Playwright + WebSearch flow over DAAD / MastersPortal / FindAMasters /
 * Erasmus Mundus.
 *
 * Usage:
 *   node scan.mjs                       # scan all enabled tracked_programs
 *   node scan.mjs --dry-run             # preview without writing files
 *   node scan.mjs --program "TU Munich" # scan a single program by name
 */

import { readFileSync, writeFileSync, appendFileSync, existsSync, mkdirSync } from 'fs';
import yaml from 'js-yaml';
const parseYaml = yaml.load;

// ── Config ──────────────────────────────────────────────────────────

const PROGRAMS_PATH = 'programs.yml';
const SCAN_HISTORY_PATH = 'data/scan-history.tsv';
const PIPELINE_PATH = 'data/pipeline.md';
const APPLICATIONS_PATH = 'data/applications.md';

mkdirSync('data', { recursive: true });

const CONCURRENCY = 5;
const FETCH_TIMEOUT_MS = 15_000;
const TODAY = new Date().toISOString().slice(0, 10);

// ── Title filter ────────────────────────────────────────────────────

function buildTitleFilter(titleFilter) {
  const positive = (titleFilter?.positive || []).map(k => k.toLowerCase());
  const negative = (titleFilter?.negative || []).map(k => k.toLowerCase());

  return (title) => {
    const lower = (title || '').toLowerCase();
    const hasPositive = positive.length === 0 || positive.some(k => lower.includes(k));
    const hasNegative = negative.some(k => lower.includes(k));
    return hasPositive && !hasNegative;
  };
}

// ── Dedup ───────────────────────────────────────────────────────────

function loadSeenUrls() {
  const seen = new Set();

  if (existsSync(SCAN_HISTORY_PATH)) {
    const lines = readFileSync(SCAN_HISTORY_PATH, 'utf-8').split('\n');
    for (const line of lines.slice(1)) {
      const url = line.split('\t')[0];
      if (url) seen.add(url);
    }
  }

  if (existsSync(PIPELINE_PATH)) {
    const text = readFileSync(PIPELINE_PATH, 'utf-8');
    for (const match of text.matchAll(/- \[[ x]\] (https?:\/\/\S+)/g)) {
      seen.add(match[1]);
    }
  }

  if (existsSync(APPLICATIONS_PATH)) {
    const text = readFileSync(APPLICATIONS_PATH, 'utf-8');
    for (const match of text.matchAll(/https?:\/\/[^\s|)]+/g)) {
      seen.add(match[0]);
    }
  }

  return seen;
}

function loadSeenUniversityPrograms() {
  const seen = new Set();
  if (existsSync(APPLICATIONS_PATH)) {
    const text = readFileSync(APPLICATIONS_PATH, 'utf-8');
    // Parse markdown table rows: | # | Date | University | Program | ...
    for (const match of text.matchAll(/\|[^|]+\|[^|]+\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g)) {
      const uni = match[1].trim().toLowerCase();
      const prog = match[2].trim().toLowerCase();
      if (uni && prog && uni !== 'university') {
        seen.add(`${uni}::${prog}`);
      }
    }
  }
  return seen;
}

// ── Liveness fetch ──────────────────────────────────────────────────

async function fetchLive(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: 'follow',
      headers: { 'User-Agent': 'uni-ops-scanner/1.0 (+https://github.com/lutfullah/teber/uni-ops)' },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const html = await res.text();
    return { ok: true, status: res.status, html };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

// ── Stale-page heuristics ───────────────────────────────────────────

const STALE_PATTERNS = [
  /applications? (are )?closed/i,
  /no longer accepting/i,
  /programme? (has been )?discontinued/i,
  /this programme? is not offered/i,
  /admissions? closed/i,
];

function detectStale(html) {
  if (!html) return null;
  for (const pat of STALE_PATTERNS) {
    const m = html.match(pat);
    if (m) return m[0];
  }
  return null;
}

// ── Pipeline + history writers ──────────────────────────────────────

function appendToPipeline(offers) {
  if (offers.length === 0) return;

  let text = existsSync(PIPELINE_PATH)
    ? readFileSync(PIPELINE_PATH, 'utf-8')
    : '# Pipeline\n\n## Pendientes\n\n## Procesadas\n';

  const marker = '## Pendientes';
  const idx = text.indexOf(marker);
  const block = offers.map(o =>
    `- [ ] ${o.url} | ${o.university} | ${o.title}`
  ).join('\n');

  if (idx === -1) {
    const procIdx = text.indexOf('## Procesadas');
    const insertAt = procIdx === -1 ? text.length : procIdx;
    text = text.slice(0, insertAt) + `\n${marker}\n\n${block}\n\n` + text.slice(insertAt);
  } else {
    const afterMarker = idx + marker.length;
    const nextSection = text.indexOf('\n## ', afterMarker);
    const insertAt = nextSection === -1 ? text.length : nextSection;
    text = text.slice(0, insertAt) + `\n${block}\n` + text.slice(insertAt);
  }

  writeFileSync(PIPELINE_PATH, text, 'utf-8');
}

function appendToScanHistory(offers) {
  if (!existsSync(SCAN_HISTORY_PATH)) {
    writeFileSync(
      SCAN_HISTORY_PATH,
      'url\tfirst_seen\tsource\ttitle\tuniversity\tstatus\n',
      'utf-8'
    );
  }

  const lines = offers.map(o =>
    `${o.url}\t${TODAY}\t${o.source}\t${o.title}\t${o.university}\t${o.status}`
  ).join('\n') + '\n';

  appendFileSync(SCAN_HISTORY_PATH, lines, 'utf-8');
}

// ── Parallel fetch ──────────────────────────────────────────────────

async function parallelFetch(tasks, limit) {
  const results = [];
  let i = 0;

  async function next() {
    while (i < tasks.length) {
      const task = tasks[i++];
      results.push(await task());
    }
  }

  const workers = Array.from(
    { length: Math.min(limit, tasks.length) },
    () => next()
  );
  await Promise.all(workers);
  return results;
}

// ── Helpers ─────────────────────────────────────────────────────────

function splitUniversityProgram(name) {
  // "TU Munich — MSc Informatics" → ["TU Munich", "MSc Informatics"]
  const sep = name.match(/[—–-]/);
  if (sep) {
    const parts = name.split(/\s+[—–-]\s+/);
    if (parts.length >= 2) {
      return { university: parts[0].trim(), program: parts.slice(1).join(' - ').trim() };
    }
  }
  return { university: name.trim(), program: name.trim() };
}

function isDeadlinePast(deadline) {
  if (!deadline || deadline === 'rolling') return false;
  return deadline < TODAY;
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const programFlag = args.indexOf('--program');
  const filterProgram = programFlag !== -1 ? args[programFlag + 1]?.toLowerCase() : null;

  if (!existsSync(PROGRAMS_PATH)) {
    console.error(`Error: ${PROGRAMS_PATH} not found. Run onboarding first.`);
    process.exit(1);
  }

  const config = parseYaml(readFileSync(PROGRAMS_PATH, 'utf-8'));

  if (config.tracked_companies && !config.tracked_programs) {
    console.error('Error: programs.yml contains career-ops legacy tracked_companies but no tracked_programs.');
    console.error('Migrate the file: replace tracked_companies with tracked_programs (see templates/programs.example.yml).');
    process.exit(1);
  }

  const programs = config.tracked_programs || [];
  const titleFilter = buildTitleFilter(config.title_filter);

  const targets = programs
    .filter(p => p.enabled !== false)
    .filter(p => !filterProgram || (p.name || '').toLowerCase().includes(filterProgram));

  console.log(`Scanning ${targets.length} tracked programs`);
  if (dryRun) console.log('(dry run — no files will be written)\n');

  const seenUrls = loadSeenUrls();
  const seenPairs = loadSeenUniversityPrograms();

  let totalChecked = 0;
  let totalFiltered = 0;
  let totalDupes = 0;
  let totalStale = 0;
  let totalDeadlinePast = 0;
  const newOffers = [];
  const errors = [];
  const staleNotes = [];

  const tasks = targets.map(prog => async () => {
    totalChecked++;
    const name = prog.name || 'Unknown program';
    const url = prog.program_url;

    if (!url) {
      errors.push({ program: name, error: 'missing program_url' });
      return;
    }

    if (!titleFilter(name)) {
      totalFiltered++;
      return;
    }

    if (isDeadlinePast(prog.deadline)) {
      totalDeadlinePast++;
      staleNotes.push({ program: name, reason: `deadline ${prog.deadline} < today ${TODAY}` });
      return;
    }

    const { university, program } = splitUniversityProgram(name);
    const pairKey = `${university.toLowerCase()}::${program.toLowerCase()}`;

    if (seenUrls.has(url) || seenPairs.has(pairKey)) {
      totalDupes++;
      return;
    }

    const result = await fetchLive(url);
    if (!result.ok) {
      errors.push({ program: name, error: result.error || `HTTP ${result.status}` });
      return;
    }

    const stale = detectStale(result.html);
    if (stale) {
      totalStale++;
      staleNotes.push({ program: name, reason: `page matched stale pattern: "${stale}"` });
      return;
    }

    seenUrls.add(url);
    seenPairs.add(pairKey);
    newOffers.push({
      url,
      title: program,
      university,
      country: prog.country || '',
      deadline: prog.deadline || '',
      source: 'tracked_programs',
      status: 'added',
    });
  });

  await parallelFetch(tasks, CONCURRENCY);

  if (!dryRun && newOffers.length > 0) {
    appendToPipeline(newOffers);
    appendToScanHistory(newOffers);
  }

  // Summary
  console.log(`\n${'━'.repeat(45)}`);
  console.log(`University Program Scan — ${TODAY}`);
  console.log(`${'━'.repeat(45)}`);
  console.log(`Programs checked:        ${totalChecked}`);
  console.log(`Filtered by title:       ${totalFiltered} removed`);
  console.log(`Deadline past:           ${totalDeadlinePast} skipped`);
  console.log(`Stale page detected:     ${totalStale} skipped`);
  console.log(`Duplicates:              ${totalDupes} skipped`);
  console.log(`New programs added:      ${newOffers.length}`);

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors) {
      console.log(`  ✗ ${e.program}: ${e.error}`);
    }
  }

  if (staleNotes.length > 0) {
    console.log(`\nStale / past-deadline notes (review manually):`);
    for (const s of staleNotes) {
      console.log(`  ! ${s.program}: ${s.reason}`);
    }
  }

  if (newOffers.length > 0) {
    console.log('\nNew programs:');
    for (const o of newOffers) {
      console.log(`  + ${o.university} | ${o.title} | ${o.country || 'N/A'} | deadline: ${o.deadline || 'N/A'}`);
    }
    if (dryRun) {
      console.log('\n(dry run — run without --dry-run to save results)');
    } else {
      console.log(`\nResults saved to ${PIPELINE_PATH} and ${SCAN_HISTORY_PATH}`);
    }
  }

  const searchQueries = (config.search_queries || []).filter(q => q.enabled !== false);
  if (searchQueries.length > 0) {
    console.log(`\nNote: ${searchQueries.length} search_queries are agent-only.`);
    console.log('Run /uni-ops scan to execute WebSearch + Playwright over aggregators');
    console.log('(DAAD / MastersPortal / FindAMasters / Erasmus Mundus catalogue).');
  }

  console.log(`\n→ Run /uni-ops pipeline to evaluate new programs.`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
