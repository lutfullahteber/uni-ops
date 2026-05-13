# Mode: programs — Compare and Rank Multiple Programs

When the user wants to compare 2+ programs side-by-side (typically after several `program` evaluations), this mode pulls the reports together and ranks them.

## Inputs

- A list of program report files (`reports/NNN-...md`) or a list of universities/programs to look up by name.
- `config/profile.yml` — priorities (countries, funding cap, start term).
- `programs.yml`, `scholarships.yml`.

## Workflow

1. **Resolve inputs** to a list of report paths. If the user gives plain names, glob `reports/` for the latest matching file.
2. **Read each report** — extract: global score, archetype, deadline, Net Cost/yr, named faculty fit, legitimacy tier.
3. **Apply user priorities** — read `profile.yml`:
   - Weight by `target.countries` rank (#1 country > #2 > …).
   - Penalize programs flagged funding-blocked unless paired with a viable scholarship.
   - Penalize deadlines already passed (block from ranking).
4. **Compute a comparison table** sorted by composite rank:

```markdown
| Rank | University | Program | Country | Deadline | Score | Net Cost/yr | Archetype | Funding status | Key advantage |
|------|------------|---------|---------|----------|-------|-------------|-----------|----------------|---------------|
```

5. **Narrative section** — for each program in the top 5:
   - 1 sentence on what makes it the best (or notable) fit.
   - 1 sentence on the strongest risk / blocker.
6. **Recommendation block** — top 3 apply, top 2 reach (high score, low odds), 1 safety (good fit + high admit-likelihood + sustainable cost), and explicit drop list.

## Output

Save to `reports/comparison-{YYYY-MM-DD}.md`. Include the source-report citations.

## Rules

- Use real numbers from the reports — never re-compute on the fly.
- Show the funding picture for each top-5 explicitly (Net Cost/yr + matching scholarship if any).
- Flag if two programs have overlapping deadlines and similar effort cost — the user may have to choose which one gets the polished SoP first.
- Do NOT recommend dropping a program purely on country rank — only on fit score, deadline, or funding viability.
