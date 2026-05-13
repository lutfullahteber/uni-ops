# Mode: training — Prep-Course / Certificate / MOOC Evaluation

When the user is considering a prep course (GRE / IELTS / TOEFL prep), a certification (Coursera / DeepLearning.AI / fast.ai), or an external bootcamp, this mode evaluates whether the spend (time + money) is worth it for the user's target applications.

## Inputs

- Course name + URL + provider.
- Price + duration + time commitment per week.
- `config/profile.yml` — `target.degree_level`, `target.fields`, `academic.test_scores`, `funding.total_annual_cap`.
- `cv.md` + `academic-record.md` — current skills / scores.

## Evaluation (A–E)

| Block | Question |
|-------|----------|
| A | Does the course close a Block B gap that recurs across the user's target programs? (1–5) |
| B | Score-uplift potential — for test-prep, what is the realistic delta? (1–5) |
| C | Time cost vs the user's calendar to deadlines (1–5; 1 = will miss deadlines, 5 = comfortable) |
| D | Money cost vs `funding.total_annual_cap` proportion (1–5) |
| E | Signaling value — does the certificate appear on CVs that admits to target programs? |

Output a global 1–5 + recommendation: **TAKE** / **DEFER** / **SKIP**.

## Output structure

```markdown
# Training Evaluation: {Course}

**Date:** {YYYY-MM-DD}
**Provider:** {…}
**Price / Time:** {…} / {N weeks × M hours/wk}
**Recommendation:** {TAKE | DEFER | SKIP}
**Global score:** {X/5}

## A) Gap closure
- Gap addressed: {…}
- Programs that flag this gap (from reports/): {…}

## B) Score uplift (test-prep only)
- Current score: {…}
- Target score for the user's target programs: {…}
- Realistic delta from this course: {…}

## C) Time cost
- Weeks: {N}
- Deadlines impacted: {programs the user would have to push or accelerate}
- Net effect on application schedule: {…}

## D) Money cost
- Price: {amount + currency}
- % of `funding.total_annual_cap`: {…}

## E) Signaling
- Appears on CVs that admit to target programs: {yes/no + evidence}
- Equivalent free / cheaper substitute: {…}

## Verdict
{1 paragraph}
```

Save to `reports/training-{slug}-{YYYY-MM-DD}.md`.

## Rules

- Skip courses whose signaling is low AND whose content is freely available — point the user at the free path.
- For test-prep, recommend the course only if the user's current score is meaningfully below the median for their target programs.
- For research-track applicants, weight signaling lower than skill uplift — a top conference paper beats any certificate.
