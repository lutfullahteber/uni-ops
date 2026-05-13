# uni-ops — User Guide

A complete walkthrough for someone who has never used uni-ops before. By the end, you will have scanned programs, evaluated one, drafted a Statement of Purpose, set up recommender requests, and tracked everything.

> uni-ops runs inside an AI CLI (Claude Code, Codex, OpenCode, Gemini CLI, Qwen, Copilot CLI). The CLI does the thinking; uni-ops gives it structure. You talk to the CLI in natural language and via slash commands (`/uni-ops scan` etc.).

---

## Table of Contents

1. [What uni-ops does](#1-what-uni-ops-does)
2. [Prerequisites](#2-prerequisites)
3. [First-time setup (one-time)](#3-first-time-setup-one-time)
4. [Onboarding: your 6 data files](#4-onboarding-your-6-data-files)
5. [Your first scan](#5-your-first-scan)
6. [Evaluating a program](#6-evaluating-a-program)
7. [Drafting a Statement of Purpose](#7-drafting-a-statement-of-purpose)
8. [Asking your recommenders](#8-asking-your-recommenders)
9. [Filling the application form](#9-filling-the-application-form)
10. [Tracking everything](#10-tracking-everything)
11. [Follow-ups: deadlines, recommender chasing, post-submit](#11-follow-ups)
12. [Interview prep](#12-interview-prep)
13. [Soft preferences vs hard filters](#13-soft-preferences-vs-hard-filters)
14. [All commands](#14-all-commands)
15. [Troubleshooting](#15-troubleshooting)
16. [What is NOT in v0.1.0](#16-what-is-not-in-v010)

---

## 1. What uni-ops does

You point uni-ops at universities and scholarship pages. It:

- **Scans** program aggregators (DAAD, MastersPortal, FindAMasters, Erasmus Mundus) and a set of universities you list.
- **Evaluates** each program on 6 dimensions (Academic match, Research fit, Funding, Personalization plan, Application strategy) plus a legitimacy check.
- **Drafts** your Statement of Purpose, recommender request emails, and LinkedIn / professor outreach.
- **Generates** an ATS-friendly academic CV PDF and a Statement of Purpose PDF.
- **Tracks** every application, deadline, recommender's status, and decision.
- **Reminds** you about overdue rec letters, upcoming deadlines, post-submit follow-ups.
- **Analyzes** patterns after several decisions: which archetypes / countries / GPA bands convert.

It does **not** submit applications. You always review and click submit yourself.

---

## 2. Prerequisites

| Need | Why |
|------|-----|
| Windows / macOS / Linux | uni-ops is cross-platform |
| Node.js ≥ 18 | runs the scripts (`scan`, `doctor`, `generate-pdf`, etc.) |
| Git | optional, for version control of your work |
| An AI CLI (Claude Code recommended) | drives the slash commands |
| The CLI's API key (Anthropic / OpenAI / Google) | the CLI talks to its provider; uni-ops talks to the CLI |

Install Node.js: <https://nodejs.org> (LTS).

Install Claude Code: <https://docs.anthropic.com/en/docs/claude-code> (or whichever CLI you use).

---

## 3. First-time setup (one-time)

Open a terminal and `cd` to where you cloned uni-ops:

```bash
cd C:\2026\git-folder\uni-ops    # Windows path; adjust to your machine
```

Install dependencies and check the environment:

```bash
npm install
npm run doctor
```

`npm run doctor` will report which user files are missing. On a fresh checkout it will report:

```
✓ Node.js >= 18
✓ Dependencies installed
✓ Playwright chromium installed
✓ cv.md found              (a stub — you'll fill it next)
✓ academic-record.md found (also a stub)
✓ extracurriculars.md found (stub)
✗ config/profile.yml not found
✗ programs.yml not found
✗ recommenders.yml not found
✓ Fonts directory ready
✓ data/ directory ready
✓ output/ directory ready
✓ reports/ directory ready
```

The three `✗` are expected — you copy the example files in the next section.

---

## 4. Onboarding: your 6 data files

uni-ops works on six files **you own and control**. Templates are provided; you copy and edit. The CLI can write/edit them for you if you ask in natural language.

### 4.1 cv.md (your academic CV in Markdown)

A short stub exists. Replace with your real CV using one of three paths:

- **Paste path:** open the CLI (`claude`) and say: *"I'm about to paste my CV. Convert it to clean Markdown and overwrite `cv.md`."* Then paste.
- **LinkedIn path:** say *"My LinkedIn is `linkedin.com/in/janesmith`. Extract my CV and write `cv.md`."*
- **Draft-from-scratch path:** say *"Draft a CV for me. I'm a [degree] graduate in [field]. Capstone was [title] with [metric]. Internship at [company] doing [thing]."* The CLI drafts; you correct.

Standard sections (the academic order): Education → Research Experience → Publications → Projects → Skills → Awards → References.

### 4.2 academic-record.md (per-semester GPA, course grades, test scores)

The stub has `X.XX` placeholders. Replace with real numbers:

```bash
# Easiest: paste your transcript and tell the CLI to fill the table
claude
> I'm pasting my transcript. Fill academic-record.md with my per-semester GPA, the top 8 courses with grades, and my test scores (TOEFL/GRE/etc).
> [paste transcript]
```

Why a separate file from `cv.md`? Because admissions committees ask for detail (specific course grades, retakes, semester-by-semester trajectory) that doesn't belong on the 1-page CV.

### 4.3 extracurriculars.md (leadership, awards, languages, social profile)

The stub has empty sections. Fill in what you have:

```bash
> Update extracurriculars.md:
>   - AI Society lead (2 years, 80 members, organized 6 workshops)
>   - IEEE Xtreme 2024 — top 10 globally
>   - German A2 (Goethe Zertifikat 2025)
>   - Volunteer Turkish-English translator at refugee NGO (3 months)
```

### 4.4 config/profile.yml (identity + targets + filters + preferences)

Copy the example:

```bash
cp config/profile.example.yml config/profile.yml
```

Then fill it. The file has comments at every step; the key blocks are:

```yaml
student:                           # identity (name, email, location, links)
target:                            # WHO YOU WANT TO BE
  degree_level: "Master"
  fields: ["Computer Vision", "Machine Learning"]
  countries: ["Germany", "Netherlands"]
  cities: ["Munich", "Amsterdam"]
  start_term: "Fall 2027"
  funding_required: true

  # HARD FILTERS (each with *_strict flag)
  duration_years_min: 1
  duration_years_max: 2
  duration_strict: true            # true = scan drops out-of-range

  languages_of_instruction: ["English"]
  language_strict: true

  institution_type: "public"       # public | private | any
  institution_type_strict: false

  ranking_source: "QS Subject"
  ranking_max: 200
  ranking_strict: false

  thesis: "required"               # required | optional | no_thesis | either
  thesis_strict: false

  intake_seasons: []               # [] = any, ["Fall"] = only Fall
  intake_strict: false

academic:                          # GPA, university, test scores
narrative:                         # research interest, headline, proof points
funding:                           # YOUR MONEY LIMITS
  tuition_budget_max: 20000
  living_budget_max: 12000
  total_annual_cap: 32000
  currency: "EUR"
  citizenship: "Turkish"

preferences:                       # SOFT signals AI uses but never enforces
  application_fee:    { target_amount: 200, currency: "USD" }
  scholarship:        { importance: "strong" }
  standardized_tests: { take_gre: "if_required", take_gmat: "avoid" }
  cohort:             { international_student_share_min: 0.20 }
  application_volume: { target_count: 10 }
  post_degree_path:   { primary: "industry_research" }
  free_notes: |
    - Must visit Istanbul 2x/year.
    - Health insurance under €100/month.
```

Don't worry about filling it perfectly. Run `claude` and say *"Walk me through `config/profile.yml`. Ask me questions and fill in the answers."* The CLI does the rest.

### 4.5 programs.yml (universities + per-program tuition + filters)

Copy the example:

```bash
cp templates/programs.example.yml programs.yml
```

The file ships with 6 example programs (TU Munich, RWTH Aachen, ETH Zurich, EPFL, TU Delft, U Tokyo). Edit the list to fit your shortlist. Or ask the CLI: *"Replace tracked_programs in programs.yml with a fresh list: TU Munich, KTH Stockholm, ETH Zurich, EPFL, NUS, U Tokyo. Look up each program's tuition, deadlines, and ranking."*

### 4.6 recommenders.yml (your referees with talking points + cadence)

Copy the example:

```bash
cp templates/recommenders.example.yml recommenders.yml
```

Then either edit by hand or ask:

```
> Set up 3 recommenders in recommenders.yml:
>   1. Prof. Yilmaz — my capstone advisor on Karate AI, 89.82% accuracy. Email a.yilmaz@uni.edu. Strong for research-track MSc.
>   2. Dr. Demir — my internship supervisor at ExampleAI, 3 months. Email b.demir@example.com. Strong for applied/industry.
>   3. Prof. Kaya — top of Optimization class, 180 students. Email c.kaya@uni.edu. Strong for theory-heavy programs.
```

### 4.7 modes/_profile.md (your customizations, never auto-updated)

Copy the template:

```bash
cp modes/_profile.template.md modes/_profile.md
```

The template has sections for: archetypes, adaptive framing, SoP defaults, language policy, institution policy, ranking policy, thesis policy, intake policy, duration policy, funding strategy, soft preferences, and writing style.

You usually don't need to touch this on day 1. As you use the system, when you say *"Always emphasize my Karate AI project for research-track programs"*, the CLI writes that rule into `modes/_profile.md` and applies it forever after.

### 4.8 Verify

```bash
npm run doctor
npm run sync-check
```

Both should be green (one or two warnings are fine if you haven't filled every field).

---

## 5. Your first scan

```
claude
> /uni-ops scan
```

uni-ops will:

1. Read `programs.yml` and `config/profile.yml`.
2. Open each `tracked_programs` page in Playwright, read deadlines + curriculum.
3. WebFetch DAAD / MastersPortal / FindAMasters / Erasmus Mundus catalogue.
4. WebSearch each query in `programs.yml.search_queries`.
5. Filter by:
   - Title keywords (positive / negative / level)
   - Countries (your `target.countries` list)
   - Duration (`duration_years_min/_max`)
   - Language of instruction
   - Institution type (public / private)
   - Ranking ceiling (`ranking_max`)
   - Thesis policy
   - Intake seasons
6. Liveness-check every Web-discovered URL with Playwright.
7. Dedup against `data/scan-history.tsv` and your existing tracker.
8. Append new URLs to `data/pipeline.md` under `## Pending`.
9. Print a summary table.

Expected output sketch:

```
Program Scan — 2026-05-13
━━━━━━━━━━━━━━━━━━━━━━━━━━
Listings found:           187
Filtered by title:         54 relevant
Filtered by country:       28 in target list
Filtered by duration:      14 (1-2 yr)
Filtered by language:      14 English-taught
Filtered by ranking:       12 (QS Subject ≤200)
Filtered by thesis:         9 thesis-required
Duplicates:                 3 already in pipeline
Expired (Level 3):          0
NEW programs added:         9

  + TU Munich | MSc Informatics | Germany | 2026-01-15
  + ETH Zurich | MSc Computer Science | CH | 2025-12-15
  + ...

→ Run /uni-ops pipeline to evaluate the new programs.
```

Open `data/pipeline.md` — you will see the 9 new URLs under `## Pending`.

---

## 6. Evaluating a program

Two ways:

### 6a. One program at a time

Paste a single URL with no sub-command:

```
> /uni-ops https://www.cit.tum.de/.../msc-informatics
```

uni-ops runs the **auto-pipeline**: evaluation → SoP draft (if score ≥ 4.0) → CV+SoP PDFs → recommender prep → tracker.

### 6b. Process the whole pipeline inbox

```
> /uni-ops pipeline
```

Processes every `- [ ]` URL in `data/pipeline.md`. For 3+ URLs it parallelizes (max 3 Playwright at once).

### What each evaluation contains

The CLI writes a report to `reports/{NNN}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md` with these blocks:

- **Block A — Program summary**: degree, country, duration, ranking, deadline, thesis policy, language. Flags filter mismatches.
- **Block B — Academic match**: GPA vs cutoff, courses, test scores. Lists gaps and mitigation.
- **Block C — Research / interest alignment**: named faculty + labs from the page, scored against your `target.fields` + `narrative.research_interest`.
- **Block D — Funding fit**: the math line `Tuition X + Living Y − Coverage Z = Net N (cap C) → score S`.
- **Block E — Personalization plan**: which proof points to surface, which recommenders to pair, the SoP angle.
- **Block F — Application strategy**: documents required, rec letter count, deadline pacing, app fee deviation from your soft preference, GRE effort cost.
- **Block G — Posting legitimacy**: High Confidence / Proceed with Caution / Suspicious.

Plus a global 1–5 score.

---

## 7. Drafting a Statement of Purpose

When a program scores ≥ 4.0, auto-pipeline drafts an SoP automatically.

To re-draft or draft for any program manually:

```
> /uni-ops sop TU Munich MSc Informatics
```

The SoP follows a 5-paragraph structure (hook → academic foundation → bridge experience → fit with THIS program → forward arc). Length defaults adjust to archetype (700–1000 words for research-track MSc, 900–1200 for PhD, 500–700 for coursework MSc).

The draft is saved to `output/sop-{NNN}-{slug}-{date}.md`. Then a PDF:

```bash
node generate-pdf.mjs --template sop --source output/sop-001-tu-munich-...md output/sop-001-tu-munich-...pdf
```

**Always edit the draft.** uni-ops gives you a starting point that already weaves in your specific proof points, named faculty, and `narrative.research_interest`. Your voice has to do the final 20%.

---

## 8. Asking your recommenders

```
> /uni-ops recommenders
```

Shows you a table of which referees are paired with which programs, their confirmation status, and overdue chasers.

To draft a fresh request:

```
> /uni-ops recommenders ask Prof. Yilmaz TU Munich
```

uni-ops drafts an email and saves it to `output/email-recommender-yilmaz-tum-msc-ask.md`. You review, edit, and send from your own email client. uni-ops never sends.

To chase a referee who hasn't confirmed after the cadence period:

```
> /uni-ops recommenders chase Prof. Yilmaz
```

To mark a letter as submitted:

```
> /uni-ops recommenders submitted Prof. Yilmaz TU Munich
```

This increments the `Submitted (n/m)` count in `data/recommenders.md` and `data/applications.md`.

---

## 9. Filling the application form

When you're ready to actually apply:

```
> /uni-ops apply https://application.tum.de/...
```

uni-ops opens the form in Playwright, reads every field, maps them to your data files, generates free-text answers, and pre-fills the form. Then it **stops** and asks you to review and click Submit yourself.

A pre-submission summary file goes to `output/apply-summary-{NNN}-{slug}-{date}.md`.

---

## 10. Tracking everything

```
> /uni-ops tracker
```

Shows:

- Programs tracker (`data/applications.md`): deadlines, status, net cost, fit score, materials readiness.
- Scholarships tracker (`data/scholarships.md`): only if you've added scholarship rows.
- Recommenders tracker (`data/recommenders.md`): per-referee, per-program state.

Statistics: count by status, average fit score, programs flagged funding-blocked, deadlines in next 30/60/90 days.

To **update an existing row** (status, decision, notes), just tell the CLI:

```
> Mark TU Munich as Submitted and add the note "submitted today, confirmation email received."
```

The CLI edits the table directly. (Adding new rows requires the TSV merge — but the CLI handles that automatically when you evaluate a new program.)

---

## 11. Follow-ups

```
> /uni-ops followup
```

Reports three cadence types:

- **application-deadline** — what's due in the next 30 / 14 / 7 / 2 days.
- **recommender-chase** — referees overdue per their `cadence_days`.
- **post-submit** — applications in `Submitted` / `Awaiting Decision` for more than 6 weeks; drafts polite check-ins.
- **interview-thanks** — within 24 hours after an `Interview` status, drafts a thank-you note.

All outreach drafts go to `output/`. You review and send.

---

## 12. Interview prep

When an application flips to `Interview`:

```
> /uni-ops interview-prep TU Munich MSc Informatics
```

uni-ops:

1. Searches reddit / thegradcafe / lab pages for actual interview accounts.
2. Reads the PI's 2–3 most recent papers and summarizes them.
3. Generates 15–25 likely questions across 6 categories (fit, research direction, technical depth, weakness, plans, logistics).
4. Pulls reusable STAR+R stories from `interview-prep/story-bank.md` and appends new ones.
5. Drafts a red-flag rehearsal for your weakest Block B gap.

Output lands in `interview-prep/{NNN}-{university-slug}-{program-slug}.md`.

---

## 13. Soft preferences vs hard filters

uni-ops separates the two cleanly. It matters because beginners often try to use filters for things that are really preferences.

| Concept | YAML location | Behavior |
|---------|---------------|----------|
| **Hard filter** | `profile.yml.target.*` + `*_strict: true` | scan drops out-of-range programs; eval recommends SKIP |
| **Hard filter (soft mode)** | `profile.yml.target.*` + `*_strict: false` | scan keeps them; eval flags Block A and penalizes Block C/F |
| **Soft preference** | `profile.yml.preferences.*` | AI uses as context, never drops or penalizes — only narrative, tiebreaks, framing |

Examples:

- *"I want only English-taught"* → hard filter (`languages_of_instruction: ["English"], language_strict: true`).
- *"I prefer public universities but private is OK if cheap"* → hard filter, non-strict (`institution_type: "public", institution_type_strict: false`).
- *"My budget for application fees is $200"* → soft preference (`preferences.application_fee.target_amount: 200`) because a fee can be worth paying if the program is funded.
- *"I want a thesis"* → hard filter, non-strict by default (`thesis: "required", thesis_strict: false`).
- *"I want to do PhD afterwards"* → soft preference (`preferences.post_degree_path.primary: "phd"`) because this shapes how the AI writes your SoP closing, not which programs it scans.

When in doubt, start as a soft preference. Tighten to a strict filter only if you find the AI repeatedly suggesting programs that miss the mark.

---

## 14. All commands

```
/uni-ops                          → discovery menu
/uni-ops {program URL or text}    → auto-pipeline (eval + SoP + PDFs + recommender + tracker)
/uni-ops pipeline                 → process the URL inbox
/uni-ops program {url}            → single A-G eval only (no auto SoP/PDF)
/uni-ops programs                 → compare and rank multiple programs
/uni-ops sop {program}            → SoP draft for one program
/uni-ops recommenders             → recommender overview
/uni-ops recommenders ask {referee} {program}
/uni-ops recommenders chase {referee}
/uni-ops recommenders submitted {referee} {program}
/uni-ops contacto {program}       → PI / lab / admissions outreach
/uni-ops deep {university}        → deep research brief
/uni-ops interview-prep {program} → admission interview prep
/uni-ops pdf                      → CV / SoP PDF (auto-pipeline runs this for you)
/uni-ops tracker                  → applications + scholarships + recommenders overview
/uni-ops apply {url}              → live form assistant
/uni-ops scan                     → discover new programs
/uni-ops batch                    → parallel eval of 5+ URLs
/uni-ops patterns                 → rejection/admission pattern mining (after ≥10 decisions)
/uni-ops followup                 → deadline + recommender + post-submit cadence
/uni-ops project                  → evaluate a research / portfolio project idea
/uni-ops training                 → evaluate a prep course / GRE / IELTS / MOOC
```

Plus npm scripts:

```
npm run doctor       — setup checklist
npm run verify       — tracker integrity check
npm run sync-check   — CV / profile / academic-record consistency
npm run merge        — merge TSV tracker additions into the trackers
npm run dedup        — find duplicate rows
npm run normalize    — canonicalize status values
npm run pdf          — direct PDF generation (the modes call this for you)
npm run scan         — programs.yml is a no-op stub (run /uni-ops scan instead)
npm run followup     — JSON output of cadence data
npm run liveness     — check a URL is still active
```

---

## 15. Troubleshooting

### `npm run doctor` reports `✗ config/profile.yml not found`
You haven't copied the example yet. Run:
```bash
cp config/profile.example.yml config/profile.yml
```

### `/uni-ops scan` returns 0 new programs
- Check `programs.yml` has entries with `enabled: true`.
- Check the title_filter positive keywords aren't too narrow.
- Try `npm run scan` — it prints a no-op message (universities don't have ATS APIs). The real scan happens in the agent flow `/uni-ops scan`.

### Evaluation report keeps saying "extraction-failed"
The program page may require login, JavaScript-heavy rendering, or has CAPTCHA. Save the page text manually:
```bash
# Save the program description to jds/, then:
> /uni-ops local:jds/tum-msc-informatics.md
```

### PDF generation fails
Run `npx playwright install chromium`. If still failing, check that `fonts/` contains the Space Grotesk and DM Sans woff2 files.

### "Status contains markdown bold"
Don't write `**Submitted**` in `data/applications.md`. Use plain text: `Submitted`. Run `npm run normalize` to auto-fix.

### The CLI doesn't recognize `/uni-ops`
You're running outside the project directory. `cd C:\2026\git-folder\uni-ops` first. The slash command lives at `.claude/skills/uni-ops/SKILL.md` and only resolves inside the project.

### "Funding-blocked" appears in every report
Your `total_annual_cap` is too low for the programs you're targeting. Either:
1. Increase the cap in `profile.yml.funding.total_annual_cap`.
2. Add scholarships you're eligible for to `scholarships.yml` so Block D coverage subtracts.
3. Set `target.institution_type: "public"` + `institution_type_strict: true` to skip private programs.

### Recommender email sounds robotic
Edit your `modes/_profile.md` `## Writing Style` section, or drop a sample of your writing into `writing-samples/`. Then say: *"Recalibrate writing style from writing-samples/."* uni-ops re-scans and updates.

---

## 16. What is NOT in v0.1.0

These are planned for v0.2.0 (Phase 2):

- **Scholarship discovery** (`/uni-ops scholarship-scan`) — a dedicated scanner for DAAD, Fulbright, Erasmus Mundus, MEXT, country-specific scholarships.
- **Motivation letter mode** (`/uni-ops motivation`) — separate from SoP; used by some European programs.
- **Multilingual modes** — DE / FR / JA / TR variants of the modes for native-language application materials.
- **Hosted dashboard** — there is currently no SaaS version; everything is local.

You can still manually add rows to `data/scholarships.md` and `scholarships.yml` and the trackers will display them; only the discovery scanner is deferred.

---

## Where files live (cheat sheet)

| What | Where | Yours / System |
|------|-------|----------------|
| Your CV | `cv.md` | yours |
| Your transcript | `academic-record.md` | yours |
| Your activities | `extracurriculars.md` | yours |
| Your identity + filters + preferences | `config/profile.yml` | yours |
| Your universities | `programs.yml` | yours |
| Your scholarships | `scholarships.yml` | yours (optional) |
| Your recommenders | `recommenders.yml` | yours |
| Your customizations | `modes/_profile.md` | yours |
| Tracker | `data/applications.md` | yours |
| URL inbox | `data/pipeline.md` | yours |
| Reports per program | `reports/` | yours |
| Generated PDFs + drafted emails | `output/` | yours |
| Mode prompts | `modes/*.md` (except `_profile.md`) | system, auto-updates |
| Scripts | `*.mjs` | system, auto-updates |
| Templates | `templates/*` | system, auto-updates |
| Slash command router | `.claude/skills/uni-ops/SKILL.md` and siblings | system |

**Rule:** when the AI asks to customize anything, it should write to `modes/_profile.md` or `config/profile.yml` — never to a system file. If you see edits to `modes/_shared.md`, push back: those edits would be wiped by the next update.

---

## Quick reference — your first session in 10 minutes

```bash
# 1. setup
cd C:\2026\git-folder\uni-ops
npm install
npm run doctor                  # see what's missing

# 2. copy templates
cp config/profile.example.yml config/profile.yml
cp templates/programs.example.yml programs.yml
cp templates/recommenders.example.yml recommenders.yml
cp modes/_profile.template.md modes/_profile.md

# 3. start the CLI
claude

# 4. let it interview you
> Walk me through onboarding. Ask one section at a time and fill the
> answers into the right files. Start with cv.md, then academic-record,
> then config/profile.yml, then programs.yml, then recommenders.yml.

# 5. once green
> npm run doctor              # all checks pass
> /uni-ops scan               # discover programs
> /uni-ops pipeline           # evaluate them
> /uni-ops tracker            # see where you stand
```

That's it. Iterate. The system gets sharper every time you correct it.
