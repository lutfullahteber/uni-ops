# Mode: patterns — Rejection / Outcome Pattern Analysis

Once the user has 10+ tracked applications with decisions (Admitted / Rejected / Waitlisted), this mode mines `data/applications.md` + the reports in `reports/` to surface what's working and what isn't.

## When to use

- After at least 10 decisions are recorded.
- When the user feels their hit-rate is off and wants data.
- After each major batch of rejections / admits.

## Workflow

1. Run `node analyze-patterns.mjs` — emits a JSON summary.
2. Parse the JSON:

| Section | Contents |
|---------|----------|
| `metadata` | Run date, totals by status, decision conversion rates |
| `funnel` | Applied → Interview → Admitted by archetype / country / fit-score band |
| `archetypeBreakdown` | Research-Track vs Coursework vs PhD vs Professional success rate |
| `countryBreakdown` | Per-country admit rate, average fit score |
| `gpaBand` | Outcomes by GPA proximity to program cutoff |
| `recommenderBreakdown` | Outcomes by recommender pairing (which referee combo correlates with admits) |
| `fundingBreakdown` | Funded vs self-funded vs funding-blocked outcomes |
| `blockerAnalysis` | Common rejection reasons extracted from report Block B "gaps" + interview notes |
| `recommendations` | 3–5 concrete next-actions to improve hit rate |

3. Write a narrative report to `reports/pattern-analysis-{YYYY-MM-DD}.md` with:
   - The headline finding (1 paragraph).
   - The strongest signal in the data (with the number behind it).
   - The 3 concrete actions.

## Example signals the analyzer surfaces

- "Research-Track applications convert at 60% when paired with Prof. X; 0% when paired with Prof. Y."
- "GPA-proximity to cutoff is decisive: 5/5 admits above cutoff, 0/8 admits below."
- "Programs in Switzerland have rejected 4/4 — re-examine fit or accept that this cluster is out of reach this cycle."
- "Funding-blocked applications convert to Admitted but the user can't accept — wasted SoP effort."

## Rules

- Surface SIGNAL, not noise. Anything below 5 data points in a cell is flagged as low-confidence.
- Cite the underlying applications.md row numbers for every claim.
- Do NOT recommend changing the user's `narrative` or `target.fields` based on a single rejection. Patterns must come from ≥ 3 data points.
