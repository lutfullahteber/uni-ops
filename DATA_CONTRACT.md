# Data Contract

This document defines which files belong to the **system** (auto-updatable) and which belong to the **user** (never touched by updates).

## User Layer (NEVER auto-updated)

These files contain your personal data, customizations, and work product. Updates will NEVER modify them.

| File | Purpose |
|------|---------|
| `cv.md` | Your academic CV in markdown |
| `academic-record.md` | Per-semester GPA, course grades, test-score history |
| `extracurriculars.md` | Leadership, volunteering, awards, languages, social profile |
| `article-digest.md` | (Optional) Detailed proof points from research projects |
| `config/profile.yml` | Your identity, targets, funding budget |
| `modes/_profile.md` | Your archetypes, SoP angle, recommender story, funding strategy |
| `programs.yml` | Your tracked programs (universities + per-program tuition, living, deadlines) |
| `scholarships.yml` | Your tracked scholarships (coverage amounts, eligibility, deadlines) |
| `recommenders.yml` | Your referee list with talking points + cadence |
| `interview-prep/story-bank.md` | Your accumulated STAR+R stories |
| `data/applications.md` | Your program application tracker |
| `data/scholarships.md` | Your scholarship application tracker |
| `data/recommenders.md` | Recommender outreach state |
| `data/pipeline.md` | Your URL inbox |
| `data/scan-history.tsv` | Your scan dedup history |
| `data/follow-ups.md` | Your follow-up history (deadlines, recommender chasers, post-submit nudges) |
| `writing-samples/*` | Your personal writing samples for style calibration |
| `reports/*` | Your evaluation reports |
| `output/*` | Your generated PDFs (CV, SoP) |
| `jds/*` | Your saved program description archive |

## System Layer (safe to auto-update)

These files contain system logic, scripts, templates, and instructions that improve with each release.

| File | Purpose |
|------|---------|
| `modes/_shared.md` | Scoring system (A-F + G), global rules, tools |
| `modes/_profile.template.md` | Template for user `_profile.md` |
| `modes/program.md` | Single-program evaluation instructions |
| `modes/programs.md` | Multi-program comparison instructions |
| `modes/auto-pipeline.md` | Auto-pipeline (eval + SoP draft + tracker) instructions |
| `modes/pipeline.md` | Pipeline (process inbox) instructions |
| `modes/scan.md` | Program scanner instructions |
| `modes/sop.md` | Statement of Purpose drafter |
| `modes/recommenders.md` | Recommender outreach + cadence |
| `modes/contacto.md` | LinkedIn outreach (professors, admissions, current students) |
| `modes/deep.md` | Deep university / lab research instructions |
| `modes/interview-prep.md` | Admission/scholarship interview prep |
| `modes/pdf.md` | PDF generation (CV / SoP) |
| `modes/tracker.md` | Tracker overview |
| `modes/apply.md` | Live application form assistant |
| `modes/patterns.md` | Rejection pattern analysis |
| `modes/followup.md` | Follow-up cadence (deadlines, recommenders, post-submit) |
| `modes/batch.md` | Parallel batch evaluation |
| `modes/project.md` | Research/project idea evaluation |
| `modes/training.md` | Prep-course / certification evaluation (GRE/IELTS/MOOC) |
| `CLAUDE.md`, `AGENTS.md` | Agent instructions |
| `*.mjs` | Utility scripts (scan, doctor, generate-pdf, etc.) |
| `batch/batch-prompt.md`, `batch/batch-runner.sh` | Batch worker |
| `templates/*` | Base templates (cv-template.html, sop-template.html, programs.example.yml, recommenders.example.yml, scholarships.example.yml, states.yml) |
| `fonts/*` | Self-hosted fonts for PDF generation |
| `.claude/skills/*`, `.agents/skills/*` | Slash-command router definitions |
| `VERSION` | Current version |
| `DATA_CONTRACT.md` | This file |

## Phase 2 additions (not yet implemented in v0.1.0)

Tracked in plan but not active in MVP:
- `modes/scholarship.md` — single-scholarship evaluation
- `modes/scholarship-scan.md` — scholarship discovery
- `modes/motivation.md` — motivation letter drafter
- `scholarship-scan.mjs` — scholarship aggregator scraper
- `templates/scholarships.example.yml`, `templates/motivation-template.html`

## The Rule

**If a file is in the User Layer, no update process may read, modify, or delete it.**

**If a file is in the System Layer, it can be safely replaced with the latest version from the upstream repo.**
