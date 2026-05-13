#!/usr/bin/env node
/**
 * followup-cadence.mjs — Deadline & follow-up cadence helper for uni-ops
 *
 * Reads:
 *   data/applications.md  — programs tracker
 *   data/scholarships.md  — scholarships tracker (optional)
 *   recommenders.yml      — referee cadence config (optional)
 *   data/recommenders.md  — recommender outreach state (optional)
 *   data/follow-ups.md    — outreach log (optional)
 *
 * Emits JSON to stdout grouped by cadence type:
 *   - application_deadlines  : programs sorted by days until deadline
 *   - post_submit_followups  : programs in Submitted/Awaiting Decision longer than threshold
 *   - recommender_chasers    : referees overdue per recommenders.yml.cadence_days
 *
 * Flags:
 *   --summary            : human-readable text instead of JSON
 *   --post-submit-days N : threshold for post-submit follow-up (default 42)
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const UNI_OPS = dirname(fileURLToPath(import.meta.url));
const APPS_FILE = join(UNI_OPS, 'data/applications.md');
const SCHOLARS_FILE = join(UNI_OPS, 'data/scholarships.md');
const RECOMMENDERS_YML = join(UNI_OPS, 'recommenders.yml');
const RECOMMENDERS_MD = join(UNI_OPS, 'data/recommenders.md');

const args = process.argv.slice(2);
const summaryMode = args.includes('--summary');
const postSubmitIdx = args.indexOf('--post-submit-days');
const POST_SUBMIT_THRESHOLD = postSubmitIdx !== -1 ? parseInt(args[postSubmitIdx + 1]) || 42 : 42;

const today = new Date();
today.setHours(0, 0, 0, 0);

function daysBetween(dateStr) {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const d = new Date(dateStr);
  return Math.round((d - today) / (1000 * 60 * 60 * 24));
}

function parseTable(file) {
  if (!existsSync(file)) return [];
  const content = readFileSync(file, 'utf-8');
  const rows = [];
  let header = null;
  for (const line of content.split('\n')) {
    if (!line.startsWith('|')) continue;
    if (line.includes('---')) continue;
    const parts = line.split('|').map(s => s.trim());
    parts.shift();
    if (parts[parts.length - 1] === '') parts.pop();
    if (!header) {
      header = parts.map(h => h.toLowerCase().replace(/[^a-z0-9]/g, '_'));
      continue;
    }
    if (parts.length === 0) continue;
    if (isNaN(parseInt(parts[0]))) continue;
    const row = {};
    for (let i = 0; i < parts.length; i++) row[header[i] || `col${i}`] = parts[i];
    rows.push(row);
  }
  return rows;
}

// 1. Application deadlines
const applications = parseTable(APPS_FILE);
const applicationDeadlines = applications
  .map(row => ({
    n: row['#'] || row.col0,
    university: row.university,
    program: row.program,
    country: row.country,
    deadline: row.deadline,
    days_remaining: daysBetween(row.deadline),
    status: row.status,
    sop: row.sop,
    cv: row.cv,
    rec_letters: row.rec_letters_nm || row.rec_letters,
  }))
  .filter(r => r.days_remaining !== null)
  .sort((a, b) => a.days_remaining - b.days_remaining);

// 2. Post-submit follow-ups
const postSubmitFollowups = applications
  .filter(row => /submitted|awaiting decision/i.test(row.status || ''))
  .map(row => ({
    n: row['#'] || row.col0,
    university: row.university,
    program: row.program,
    submission_date: row.date,
    days_since_submission: row.date ? -daysBetween(row.date) : null,
    status: row.status,
  }))
  .filter(r => r.days_since_submission !== null && r.days_since_submission >= POST_SUBMIT_THRESHOLD)
  .sort((a, b) => b.days_since_submission - a.days_since_submission);

// 3. Recommender chasers (basic — without YAML parsing, just read recommenders.md if present)
const recommenderChasers = [];
if (existsSync(RECOMMENDERS_MD)) {
  const rows = parseTable(RECOMMENDERS_MD);
  for (const row of rows) {
    const lastContacted = row.last_contacted;
    const daysSince = lastContacted && /^\d{4}-\d{2}-\d{2}$/.test(lastContacted)
      ? -daysBetween(lastContacted)
      : null;
    // Default cadence 14 days; override if YAML parsed in future
    const cadence = 14;
    if (daysSince !== null && daysSince >= cadence && !/yes|true/i.test(row.confirmed || '')) {
      recommenderChasers.push({
        n: row['#'] || row.col0,
        referee: row.referee,
        programs_requested: row.programs_requested,
        days_since_last_contact: daysSince,
        cadence_days: cadence,
      });
    }
  }
}

const output = {
  metadata: {
    today: today.toISOString().slice(0, 10),
    applications_tracked: applications.length,
    post_submit_threshold_days: POST_SUBMIT_THRESHOLD,
  },
  application_deadlines: applicationDeadlines,
  post_submit_followups: postSubmitFollowups,
  recommender_chasers: recommenderChasers,
};

if (summaryMode) {
  console.log(`\nuni-ops follow-up summary — ${output.metadata.today}\n`);

  console.log(`Programs tracked: ${output.metadata.applications_tracked}`);
  if (applicationDeadlines.length === 0) {
    console.log('No program deadlines on record.\n');
  } else {
    console.log('\nUpcoming deadlines:');
    for (const d of applicationDeadlines.slice(0, 10)) {
      const tag = d.days_remaining < 0 ? '[PAST]' : d.days_remaining <= 7 ? '[URGENT]' : d.days_remaining <= 30 ? '[SOON]' : '';
      console.log(`  T${d.days_remaining >= 0 ? '−' : '+'}${Math.abs(d.days_remaining)}d  ${tag} ${d.university} — ${d.program} (${d.deadline}) status=${d.status}`);
    }
  }

  if (postSubmitFollowups.length > 0) {
    console.log('\nPost-submit follow-ups (≥' + POST_SUBMIT_THRESHOLD + 'd since submission, still pending):');
    for (const p of postSubmitFollowups) {
      console.log(`  ${p.days_since_submission}d  ${p.university} — ${p.program}`);
    }
  }

  if (recommenderChasers.length > 0) {
    console.log('\nRecommender chasers due:');
    for (const r of recommenderChasers) {
      console.log(`  ${r.days_since_last_contact}d since last contact  ${r.referee} (programs: ${r.programs_requested})`);
    }
  }

  console.log('');
} else {
  console.log(JSON.stringify(output, null, 2));
}
