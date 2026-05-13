# Uni-Ops -- AI University & Scholarship Application Pipeline

## Origin

uni-ops is an architectural derivative of the open-source [career-ops](https://github.com/santifer/career-ops) project by Santiago Fernández de Valderrama (MIT-licensed), retargeted from job-search to **university and scholarship application** workflows. Code structure, mode-router pattern, TSV-tracker merge contract, and PDF generation pipeline come from career-ops. Domain logic (academic record, programs, scholarships, recommenders, SoP drafting) is uni-ops-specific.

The user owns this repo; system files (modes, scripts, templates) are auto-updatable. User files (CV, profile, programs.yml, scholarships.yml, recommenders.yml, tracker, reports, PDFs) are never touched by updates.

**It works out of the box, but it's designed to be made yours.** If the archetypes don't match the user's degree level, the scoring weights need tweaking, or the SoP defaults don't fit their writing voice — just ask. You (AI Agent) can edit the user's files. The user says "change the archetypes to PhD direct-entry only" and you do it.

## Data Contract (CRITICAL)

There are two layers. Read `DATA_CONTRACT.md` for the full list.

**User Layer (NEVER auto-updated, personalization goes HERE):**
- `cv.md`, `academic-record.md`, `extracurriculars.md`, `article-digest.md` (optional)
- `config/profile.yml`, `modes/_profile.md`
- `programs.yml`, `scholarships.yml`, `recommenders.yml`
- `data/*`, `reports/*`, `output/*`, `interview-prep/*`, `jds/*`, `writing-samples/*`

**System Layer (auto-updatable, DON'T put user data here):**
- `modes/_shared.md`, `modes/_profile.template.md`, all other `modes/*.md`
- `AGENTS.md`, `CLAUDE.md`, `DATA_CONTRACT.md`, `*.mjs` scripts, `templates/*` (except active customizations), `batch/batch-prompt.md` and `batch-runner.sh`
- `fonts/*`, `VERSION`

**THE RULE: When the user asks to customize anything (archetypes, SoP defaults, recommender pairing, funding strategy, location policy), ALWAYS write to `modes/_profile.md` or `config/profile.yml`. NEVER edit `modes/_shared.md` for user-specific content.** This ensures system updates don't overwrite their customizations.

## What is uni-ops

CLI-agnostic university and scholarship application automation: program evaluation, SoP drafting, recommender outreach, deadline tracking, application form assistance, admission-interview prep. Runs on any AI coding CLI that follows the open agent skill standard (Claude Code, Codex, Gemini, OpenCode, Qwen, Copilot).

### Main user files

| File | Function |
|------|----------|
| `cv.md` | Canonical academic CV (markdown) |
| `academic-record.md` | Per-semester GPA, course grades, test scores |
| `extracurriculars.md` | Leadership, volunteering, awards, languages |
| `config/profile.yml` | Student identity, target (degree level / fields / countries), funding budget |
| `modes/_profile.md` | User customization: archetypes, SoP angle, recommender story, funding strategy |
| `programs.yml` | Tracked universities + programs (numeric tuition + living drive Block D math) |
| `scholarships.yml` | Tracked external scholarships (coverage amounts, eligibility, deadlines) |
| `recommenders.yml` | Referees with strengths, talking points, cadence |
| `data/applications.md` | Programs tracker |
| `data/scholarships.md` | Scholarships tracker |
| `data/recommenders.md` | Recommender outreach state |
| `data/pipeline.md` | URL inbox |
| `data/scan-history.tsv` | Scanner dedup history |
| `data/follow-ups.md` | Follow-up log |
| `reports/` | Evaluation reports (format: `{NNN}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md`, blocks A-F + G) |
| `output/` | Generated PDFs (CV, SoP) and drafted emails |
| `interview-prep/story-bank.md` | Accumulated STAR+R stories |

### Main system files

| File | Function |
|------|----------|
| `modes/_shared.md` | Scoring rubric (A-F + G), budget math, archetypes, global rules |
| `modes/program.md` | Single-program evaluation |
| `modes/sop.md` | Statement of Purpose drafter |
| `modes/recommenders.md` | Recommender outreach + cadence |
| `modes/auto-pipeline.md` | Full pipeline (eval + SoP + PDF + tracker + recommender prep) |
| `modes/scan.md` | Program discovery |
| `modes/contacto.md` | LinkedIn / email outreach (PIs, lab members, admissions, current students) |
| Other `modes/*.md` | pipeline, batch, apply, tracker, followup, interview-prep, deep, patterns, project, training, programs (comparison), pdf |
| `templates/cv-template.html` | Academic CV PDF template |
| `templates/sop-template.html` | SoP PDF template |
| `templates/programs.example.yml`, `recommenders.example.yml`, `states.yml` | Templates |
| `generate-pdf.mjs` | Playwright HTML → PDF (CV / SoP) |
| `scan.mjs` | Helper stub — universities don't have stable ATS APIs; real scan happens via the agent flow |
| `cv-sync-check.mjs`, `verify-pipeline.mjs`, `doctor.mjs`, `followup-cadence.mjs` | Validation & cadence helpers |

### First Run — Onboarding (IMPORTANT)

Run these checks silently every time a session starts:

1. Does `cv.md` exist and contain real content (not the stub)?
2. Does `academic-record.md` exist with real GPA / test scores (not "X.XX / 4.0" placeholders)?
3. Does `config/profile.yml` exist (not just profile.example.yml)?
4. Does `modes/_profile.md` exist (not just _profile.template.md)?
5. Does `programs.yml` exist (not just templates/programs.example.yml)?
6. Does `recommenders.yml` exist?

If `modes/_profile.md` is missing, copy from `modes/_profile.template.md` silently.

**If ANY of these is missing, enter onboarding mode.** Do NOT proceed with evaluations, scans, or any other mode until the basics are in place.

#### Step 1: CV
If `cv.md` is still the scaffolding stub, ask:
> "I see the CV stub is still in place. You can either:
> 1. Paste your CV here and I'll convert it to markdown.
> 2. Paste your LinkedIn URL and I'll extract the key info.
> 3. Tell me about your background and I'll draft a CV.
>
> Which do you prefer?"

#### Step 2: Academic record
If `academic-record.md` still has stub placeholders ("X.XX / 4.0", "XX hours"):
> "Let's fill in your academic record. I need per-semester GPA, your strongest courses with grades, your test scores (TOEFL/IELTS/GRE/etc), and any academic awards. Paste your transcript or summarize the key numbers."

#### Step 3: Profile
If `config/profile.yml` is missing, copy from `config/profile.example.yml` then ask:
> "I need a few details to personalize the system:
> - Full name, email, current city.
> - Target degree level (Bachelor / Master / PhD) and start term.
> - Target fields (e.g. Computer Vision, Machine Learning).
> - Target countries — ranked.
> - Funding budget: maximum tuition and living cost per year you can afford out-of-pocket, and the absolute net-cost ceiling (`total_annual_cap`).
> - Citizenship — drives scholarship eligibility."

#### Step 4: Programs
If `programs.yml` is missing:
> "I'll set up the program scanner with example MSc programs (TU Munich, ETH Zurich, TU Delft, etc.). Want me to customize the search keywords for your target fields and countries?"

Copy `templates/programs.example.yml` → `programs.yml`. Tune `title_filter` and `tracked_programs` to the user's targets.

#### Step 5: Recommenders
If `recommenders.yml` is missing:
> "Who would write your letters of recommendation? I need 2–4 referees. For each: name, email, institution, your relationship, what they can speak to (technical / theory / industry / leadership)."

Copy `templates/recommenders.example.yml` → `recommenders.yml` and fill in.

#### Step 6: Scholarships (optional in v0.1.0)
The scholarship scanner is a Phase 2 feature. For v0.1.0, the user can manually maintain `scholarships.yml` if they already track funding sources. Block D math will use scholarship coverage_* numbers from this file when present.

#### Step 7: Get to know the user
After the basics are set up, proactively ask for more context:
> "The basics are ready. To make every SoP and recommender request sharper, can you tell me more about:
> - Your research interest in one sentence — the core problem you want to work on.
> - Your single strongest proof point — capstone, paper, deployed project — with the metric.
> - Any deal-breakers (program type, country, supervisor style).
> - The 5-year arc you imagine after this degree (PhD / industry / specific role).
>
> The more context you give me, the better I filter."

Store insights in `config/profile.yml` (under `narrative`) or in `modes/_profile.md` if they're framing rules.

**After every evaluation, learn.** If the user says "you missed that this program has a thesis-optional track" or "I wouldn't apply to programs ranked outside the top 30", update `modes/_profile.md` or `config/profile.yml`. The system should get smarter with every interaction.

#### Step 8: Ready
Once all files exist:
> "You're set. You can now:
> - Paste a program URL to evaluate it (auto-pipeline).
> - Run `/uni-ops scan` to discover new programs.
> - Run `/uni-ops` to see all commands.
>
> Everything is customizable — just ask me to change anything."

Suggest automation:
> "Want me to scan for new programs on a cadence? I can set up a recurring scan every 1–2 weeks so you don't miss anything."

## CV / Academic-record source of truth

- `cv.md` is the summary surface (Education first, then Research Experience, Publications, Projects, Skills, Awards).
- `academic-record.md` has the full per-semester transcript, test history, and academic awards.
- `extracurriculars.md` is the social / leadership profile.
- **NEVER fabricate GPA, test scores, course grades, or publications.** Always read from these files at evaluation time.

---

## Ethical Use -- CRITICAL

**This system is designed for quality, not quantity.** The goal is to help the user find programs where there is a genuine fit — not to spam admissions offices.

- **NEVER submit an application without the user reviewing it first.** Pre-fill forms, generate documents, draft emails — but always STOP before clicking Submit/Send.
- **Strongly discourage low-fit applications.** If a global score is below 3.5/5, recommend against applying.
- **Never fabricate recommender support.** Recommenders are real people; outreach is draft-only and the user sends.
- **Respect admissions officers' time.** Every SoP a human reads costs attention. Only submit what's worth reading.

---

## Program Verification -- MANDATORY

**NEVER trust WebSearch alone to confirm a program is accepting applications.** ALWAYS use Playwright to verify:
1. `browser_navigate` to the program URL.
2. `browser_snapshot` to read the rendered page.
3. Active = deadline + curriculum + apply portal visible. Stale = footer/nav only, "applications closed", "discontinued", or no current deadline.

**Exception for batch workers:** Playwright is not available in headless pipe mode. Use WebFetch as fallback and mark the report header with `**Verification:** unconfirmed (batch mode)`.

---

## Pipeline Integrity

1. **NEVER edit `data/applications.md` or `data/scholarships.md` to ADD new rows** — write a TSV in `batch/tracker-additions/` with a `target` column (`applications` or `scholarships`) and run `npm run merge`.
2. **YES, you may edit `applications.md` / `scholarships.md` to UPDATE Status, Decision, Notes, Rec Letters (n/m), SoP, CV columns of existing rows.**
3. All reports MUST include `**URL:**` in the header, plus `**Legitimacy:** {tier}` and the **Block D math line** (`Tuition X + Living Y − Coverage Z = Net N (cap C) → score S`).
4. All statuses MUST be canonical (see `templates/states.yml`).
5. Health check: `node verify-pipeline.mjs`
6. Source sync: `node cv-sync-check.mjs`

### Canonical States — applications (programs)

| State | When |
|-------|------|
| `Drafting` | SoP / materials in progress |
| `Submitted` | Application sent |
| `Awaiting Decision` | Acknowledged; reviewing |
| `Interview` | Admission interview scheduled / in progress |
| `Admitted` | Offer received |
| `Waitlisted` | On waitlist |
| `Rejected` | Declined |
| `Withdrawn` | Withdrew |
| `SKIP` | Identified but decided not to apply |

### Canonical States — scholarships

`Identified, Drafting, Submitted, Awaiting Decision, Interview, Awarded, Rejected, Withdrawn, SKIP`

---

## Stack and Conventions

- Node.js (mjs modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (templates), Markdown (data).
- Scripts in `.mjs`, configuration in YAML.
- Output in `output/` (gitignored), reports in `reports/`.
- Local-saved listings in `jds/` (referenced as `local:jds/{file}` in pipeline.md).
- Batch work in `batch/` (TSV staging area gitignored except scripts and prompt).
- Report numbering: sequential 3-digit zero-padded, max existing + 1.
- After each batch of evaluations, run `node merge-tracker.mjs` to consolidate TSVs.
- NEVER create new entries in `applications.md` if university+program already exists — update the existing entry.

### TSV format for tracker additions

Write one TSV per evaluation to `batch/tracker-additions/{NNN}-{university-slug}.tsv`. First line is header; second line is the data row. Tab-separated:

```
target	num	date	university	program	country	deadline	tuition_per_year	net_cost_per_year	fit_score	status	sop	cv	rec_letters	decision	notes
applications	001	2026-05-13	TU Munich	MSc Informatics	Germany	2026-01-15	150	2150	4.3	Drafting	pending	pending	0/3		Top fit; funding manageable
```

For scholarships, target = `scholarships` and columns match the scholarships tracker schema.

---

## Headless / Batch Mode

When spawning headless workers for batch processing, use the appropriate command for your CLI:

| CLI | Command |
|-----|---------|
| Claude Code | `claude -p "prompt"` |
| Gemini CLI | `gemini -p "prompt"` |
| Codex | `codex exec "prompt"` |
| OpenCode | `opencode run "prompt"` |
| Qwen | `qwen -p "prompt"` |

## Phase 2 (not in v0.1.0)

- Scholarship-scan mode (`modes/scholarship-scan.md`) + `scholarship-scan.mjs` aggregator scraper.
- Motivation letter mode (`modes/motivation.md`) + `templates/motivation-template.html`.
- Multilingual modes (DE / FR / JA / etc.).
- Dashboard TUI.

Tracking lives in `DATA_CONTRACT.md` under "Phase 2 additions".
