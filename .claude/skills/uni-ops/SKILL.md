---
name: uni-ops
description: AI university & scholarship application command center -- evaluate programs, draft SoPs, generate CVs, manage recommenders, scan aggregators, track applications
arguments: mode # Claude Code specific
user-invocable: true
argument-hint: "[scan | deep | pdf | program | programs | sop | recommenders | apply | batch | tracker | pipeline | contacto | training | project | interview-prep | patterns | followup]"
license: MIT
---

# uni-ops -- Router

## Mode Routing

Determine the mode from `$mode`:

| Input | Mode |
|-------|------|
| (empty / no args) | `discovery` -- Show command menu |
| Program listing text or URL (no sub-command) | **`auto-pipeline`** |
| `program` | `program` |
| `programs` | `programs` |
| `sop` | `sop` |
| `recommenders` | `recommenders` |
| `contacto` | `contacto` |
| `deep` | `deep` |
| `interview-prep` | `interview-prep` |
| `pdf` | `pdf` |
| `training` | `training` |
| `project` | `project` |
| `tracker` | `tracker` |
| `pipeline` | `pipeline` |
| `apply` | `apply` |
| `scan` | `scan` |
| `batch` | `batch` |
| `patterns` | `patterns` |
| `followup` | `followup` |

**Auto-pipeline detection:** If `$mode` is not a known sub-command AND contains program-listing text (keywords: "curriculum", "admissions", "thesis", "research interests", "ECTS", "credit hours", "advisor", "deadline", university name + "Master" or "PhD" or "BSc") or a URL to a program page, execute `auto-pipeline`.

If `$mode` is not a sub-command AND doesn't look like a program listing, show discovery.

---

## Discovery Mode (no arguments)

Show this menu:

```
uni-ops -- Command Center

Available commands:
  /uni-ops {program URL or text}  → AUTO-PIPELINE: evaluate + SoP draft + PDFs + recommender prep + tracker
  /uni-ops pipeline               → Process pending URLs from inbox (data/pipeline.md)
  /uni-ops program                → Single-program evaluation A–G (no auto SoP/PDF)
  /uni-ops programs               → Compare and rank multiple programs
  /uni-ops sop {program}          → Statement of Purpose draft for one program
  /uni-ops recommenders           → Manage referee outreach + cadence (ask / chase / submitted)
  /uni-ops contacto {program}     → Find PI / admissions / lab / current students + draft outreach
  /uni-ops deep                   → Deep research on a university / program / lab
  /uni-ops interview-prep         → Admission / scholarship interview prep doc
  /uni-ops pdf                    → Generate CV / SoP PDFs
  /uni-ops training               → Evaluate prep course / GRE / IELTS / MOOC
  /uni-ops project                → Evaluate research / portfolio project idea
  /uni-ops tracker                → Application + scholarship + recommender overview
  /uni-ops apply                  → Live application form assistant
  /uni-ops scan                   → Scan program aggregators and tracked university pages
  /uni-ops batch                  → Parallel evaluation of many program URLs
  /uni-ops patterns               → Analyze rejection / admission patterns after 10+ decisions
  /uni-ops followup               → Deadline + recommender + post-submit cadence

Inbox: add URLs to data/pipeline.md, then /uni-ops pipeline.
Or paste a program listing directly to run the full auto-pipeline.

Scholarship search + motivation letter modes are scheduled for v0.2.0.
```

---

## Context Loading by Mode

After determining the mode, load the necessary files before executing:

### Modes that require `_shared.md` + their mode file:
Read `modes/_shared.md` + `modes/{mode}.md`

Applies to: `auto-pipeline`, `program`, `programs`, `pdf`, `contacto`, `apply`, `pipeline`, `scan`, `batch`, `sop`, `recommenders`

### Standalone modes (only their mode file):
Read `modes/{mode}.md`

Applies to: `tracker`, `deep`, `interview-prep`, `training`, `project`, `patterns`, `followup`

### Modes delegated to subagent:
For `scan`, `apply` (with Playwright), and `pipeline` (3+ URLs): launch as Agent with the content of `_shared.md` + `modes/{mode}.md` injected into the subagent prompt.

```
Agent(
  subagent_type="general-purpose",
  prompt="[content of modes/_shared.md]\n\n[content of modes/{mode}.md]\n\n[invocation-specific data]",
  description="uni-ops {mode}"
)
```

Execute the instructions from the loaded mode file.
