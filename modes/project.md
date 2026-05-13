# Mode: project — Research / Portfolio Project Evaluation

When the user pitches a project idea (research, side project, extended coursework, capstone follow-on) and asks whether it's worth pursuing for their applications, run this mode.

## Inputs

- A 1–3 paragraph description of the project (problem, approach, expected output, time budget).
- `config/profile.yml` — `target.fields`, `target.degree_level`, `narrative.research_interest`.
- `cv.md` + `academic-record.md` — existing proof points to avoid duplicating.

## Evaluation (A–E)

| Block | Question |
|-------|----------|
| A | Fit with `target.fields` and `narrative.research_interest` (1–5) |
| B | Realism vs the user's time budget — months to MVP, technical risk, dependency cost (1–5) |
| C | Differentiation — does this give the user something `cv.md` doesn't already cover? (1–5) |
| D | Visibility — will the output be publishable (paper, blog, OSS repo, dataset, talk)? (1–5) |
| E | Application leverage — which specific program archetypes does this help with? |

Output a global 1–5 + a single recommendation: **PURSUE** / **DEFER** / **DROP**.

## Output structure

```markdown
# Project Evaluation: {Title}

**Date:** {YYYY-MM-DD}
**Recommendation:** {PURSUE | DEFER | DROP}
**Global score:** {X/5}

## A) Fit
…

## B) Realism
- Time to MVP: {X weeks}
- Technical risk: {low/medium/high} — main risk: …
- Cost: {GPU hours, dataset cost, …}

## C) Differentiation
- Existing proof points it overlaps with (cite cv.md lines): …
- New ground covered: …

## D) Visibility
- Most likely output channel: {blog | OSS repo | workshop paper | conference paper | dataset release}
- Audience size estimate: …

## E) Application leverage
- Helps for: {archetype list, specific programs by name from programs.yml}
- Does NOT help: {…}

## Suggested scope
- v0 (4 weeks): …
- v1 (8 weeks): …
- Stretch: …
```

Save to `reports/project-{slug}-{YYYY-MM-DD}.md`.

## Rules

- Be honest about realism. A great-sounding project that won't ship by application season is worse than a small project that does.
- If the project replicates existing `cv.md` work, recommend pivot, not pursue.
- For PhD applicants: bias toward visibility (publication > blog > repo > dataset). For Coursework MSc applicants: bias toward speed (repo > blog > paper).
