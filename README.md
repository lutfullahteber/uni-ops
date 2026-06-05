# Uni-Ops

**AI University & Scholarship Application Pipeline.** Turns any AI coding CLI into a command center for graduate/undergraduate admissions — evaluate programs, draft Statements of Purpose, manage recommenders, track funding, and keep every deadline in one source of truth.

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-000?style=flat&logo=anthropic&logoColor=white" alt="Claude Code">
  <img src="https://img.shields.io/badge/Gemini_CLI-4285F4?style=flat&logo=google&logoColor=white" alt="Gemini CLI">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="v0.1.0">
</p>

---

## What Is This

Applying to universities and scholarships is a tracking nightmare: dozens of programs, each with its own deadline, tuition, language requirement, and document checklist — plus recommenders to chase and a Statement of Purpose to tailor for every one.

Uni-ops is an AI-powered pipeline that:

- **Evaluates programs** with a structured A–F + G scoring rubric (fit, funding, research match, admission odds, logistics)
- **Computes real net cost** — tuition + living − scholarship coverage vs your budget cap (Block D math)
- **Drafts Statements of Purpose** tailored to each program from your academic record and research story
- **Manages recommenders** — outreach drafts, talking points, and follow-up cadence
- **Tracks everything** — programs, scholarships, and referees in a single source of truth with integrity checks
- **Generates PDFs** — academic CV and SoP from HTML templates

> **This is a filter, not a spray-and-pray tool.** It helps you find the few programs worth a real application out of many. The system recommends *against* applying when the fit score drops below 3.5/5. Every SoP an admissions officer reads costs attention — only submit what's worth reading.

> **Human-in-the-loop, always.** Uni-ops drafts, evaluates, and pre-fills — but it **never submits an application or sends an email**. You review and click the final button.

> **The first evaluations won't be great.** The system doesn't know you yet. Feed it context — your CV, transcript, research interest, proof points, deal-breakers. The more you nurture it, the sharper the filtering gets.

## Features

| Feature | What it does |
|---------|-------------|
| **Auto-Pipeline** | Paste a program URL → evaluation + SoP draft + tracker entry + recommender prep |
| **A–F + G Scoring** | Structured rubric across fit, research match, funding, admission odds, logistics |
| **Budget Math (Block D)** | `Tuition + Living − Coverage = Net (vs cap) → score` for every program |
| **SoP Drafter** | Statement of Purpose tailored per program from your record and narrative |
| **Recommender Management** | Outreach drafts, per-referee talking points, follow-up cadence |
| **Program Scanner** | Discover programs matching your fields, countries, and filters |
| **Scholarship Tracking** | Coverage amounts, eligibility, deadlines feed the budget math |
| **Interview Prep** | Accumulating STAR+R story bank for admission/scholarship interviews |
| **Live Verification** | Playwright confirms a program is actually accepting applications (not a stale page) |
| **Pipeline Integrity** | Automated merge, dedup, status normalization, health checks |

## Quick Start

```bash
# 1. Clone and install
git clone <your-repo-url> uni-ops
cd uni-ops && npm install
npx playwright install chromium      # for PDF generation + program verification

# 2. Check setup
npm run doctor                       # validates prerequisites

# 3. Configure your profile
cp config/profile.example.yml config/profile.yml      # identity, targets, funding budget
cp templates/programs.example.yml programs.yml        # programs to track
cp templates/recommenders.example.yml recommenders.yml

# 4. Add your academic data (these are gitignored — your data stays local)
#    cv.md                 — academic CV in markdown
#    academic-record.md    — per-semester GPA, grades, test scores
#    extracurriculars.md   — leadership, awards, languages

# 5. Open your CLI in this directory and let it onboard you
claude        # or: gemini
```

On first run the agent checks whether your core files are filled in and walks you through onboarding (CV → academic record → profile → programs → recommenders) before running any evaluation.

> **Built to be made yours.** Archetypes, scoring weights, SoP defaults, funding strategy — just ask the agent to change them. It reads the same files it edits, so it knows exactly what to touch. Customizations go in `config/profile.yml` and `modes/_profile.md`, which system updates never overwrite.

## Usage

Single slash command, multiple modes:

```
/uni-ops                  → show all commands
/uni-ops {program URL}    → full auto-pipeline (evaluate + SoP + tracker + recommender prep)
/uni-ops scan             → discover new programs
/uni-ops sop              → draft a Statement of Purpose
/uni-ops recommenders     → recommender outreach + cadence
/uni-ops programs         → compare tracked programs
/uni-ops contacto         → outreach to PIs, admissions, current students
/uni-ops deep             → deep university / lab research
/uni-ops apply            → application-form assistant
/uni-ops interview-prep   → admission / scholarship interview prep
/uni-ops tracker          → application status overview
/uni-ops pdf              → generate CV / SoP PDF
```

Or paste a program URL directly — uni-ops auto-detects and runs the full pipeline.

### Gemini CLI

Same modes work under [Gemini CLI](https://github.com/google-gemini/gemini-cli). Or use the standalone API script:

```bash
cp .env.example .env                 # set GEMINI_API_KEY
node gemini-eval.mjs --file ./jds/program.txt
```

## How It Works

```
You paste a program URL or description
        │
        ▼
┌──────────────────┐
│  Verification    │  Playwright confirms program is live & accepting
└────────┬─────────┘
         │
┌────────▼─────────┐
│  A–F + G Eval    │  Fit, research match, admission odds, logistics
│  (reads cv.md +  │  + Block D budget: Tuition+Living−Coverage=Net vs cap
│  academic-record)│
└────────┬─────────┘
         │
    ┌────┼────────┬──────────┐
    ▼    ▼        ▼          ▼
 Report  SoP   Tracker   Recommender
  .md    draft   row        prep
```

## Project Structure

```
uni-ops/
├── AGENTS.md / CLAUDE.md       # agent instructions (all CLIs)
├── DATA_CONTRACT.md            # user-layer vs system-layer file rules
├── cv.md                       # your academic CV            (gitignored)
├── academic-record.md          # GPA / grades / test scores  (gitignored)
├── extracurriculars.md         # leadership / awards         (gitignored)
├── programs.yml                # tracked programs            (gitignored)
├── scholarships.yml            # tracked scholarships        (gitignored)
├── recommenders.yml            # referee list                (gitignored)
├── config/
│   └── profile.example.yml     # identity, targets, budget (copy → profile.yml)
├── modes/                      # evaluation logic per command
│   ├── _shared.md              # scoring rubric (A–F+G), budget math, archetypes
│   ├── _profile.md             # your customizations (gitignored)
│   ├── program.md / sop.md / recommenders.md / scan.md / ...
├── templates/                  # CV + SoP HTML, example YAML, canonical states
├── data/                       # trackers (gitignored)
├── reports/                    # evaluation reports (gitignored)
├── output/                     # generated PDFs (gitignored)
├── fonts/                      # self-hosted fonts for PDF
└── *.mjs                       # scan, doctor, merge, generate-pdf, verify...
```

## Data Privacy

Your personal data **never leaves your machine** except to the AI provider you choose. The `.gitignore` excludes every user-layer file — CV, academic record, transcripts, programs, scholarships, recommenders, generated reports and PDFs, and image scans (`*.jpg`, etc.). See [DATA_CONTRACT.md](DATA_CONTRACT.md) for the full user-layer vs system-layer split.

## Tech Stack

- **Agent**: any AI coding CLI following the open agent-skill standard (Claude Code, Gemini CLI, Codex, OpenCode, Qwen)
- **Verification & PDF**: Playwright (Chromium)
- **Data**: Markdown tables + YAML config + TSV batch files
- **Scripts**: Node.js (ESM `.mjs`)

## Credits

Uni-ops is an architectural derivative of [career-ops](https://github.com/santifer/career-ops) by Santiago Fernández de Valderrama (MIT-licensed), retargeted from job search to university and scholarship applications. The mode-router pattern, TSV-tracker merge contract, and PDF pipeline come from career-ops; the academic domain logic (program scoring, SoP drafting, recommender management, funding math) is uni-ops-specific. See [NOTICE.md](NOTICE.md).

## Ethical Use

- Never submit an application or send an email without reviewing it first.
- This system optimizes for quality, not quantity. Don't spam admissions offices.
- Recommenders are real people — outreach is draft-only; you send it.
- Never fabricate GPA, test scores, grades, or publications. The agent reads them from your files at evaluation time.

## License

[MIT](LICENSE). See [LEGAL_DISCLAIMER.md](LEGAL_DISCLAIMER.md) for the full disclaimer — this software is provided "as is", without warranty of any kind.
