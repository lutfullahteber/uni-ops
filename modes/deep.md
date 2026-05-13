# Mode: deep — Deep University / Program / Lab Research

Generate a focused brief on a university, program, or lab the user is considering. Used to make a final apply/skip call on borderline programs (score 3.5–4.0) or to prepare for an interview / SoP.

## Inputs

- University / program / lab name (required).
- The program report (if it exists in `reports/`).
- `config/profile.yml` — student priorities.

## Research areas (run 4–6 WebSearch queries)

| Query type | Why |
|-----------|-----|
| `"{university}" "{program}" curriculum` | Course catalog, credit structure, electives. |
| `"{university}" graduate handbook OR student handbook` | Funding policy, advisor matching, qualifying exams, dropout rate. |
| `"{PI name}" Google Scholar` | Faculty research output, citations, recent papers, recent students placed. |
| `"{university}" "{department}" alumni` | Where graduates end up — industry, PhD, postdoc. |
| `"cost of living" {city} student` | Reality-check `est_living_cost_per_year` in `programs.yml`. |
| `"{university}" reddit reviews` (r/gradadmissions, r/{university}) | First-hand student experience — workload, support, advising quality. |

If looking at a scholarship: search for past awardees' profiles, average GPA of winners, interview format.

## Deliverable

Single Markdown brief, saved to `reports/deep-{slug}-{YYYY-MM-DD}.md`:

```markdown
# Deep Research — {University / Program / Lab}

## 1. At-a-glance
- Founded / size / public-vs-private / global rank in relevant field.

## 2. Program structure
- Course load, electives, thesis / capstone, exchange tracks, internship support.
- Average time-to-degree.

## 3. Faculty / lab
- 3–5 most relevant faculty with one-line research focus + Google Scholar link.
- Recent PhD / postdoc placements.

## 4. Funding climate
- Tuition trend (last 3 years).
- Internal scholarships / TA / RA / GSI availability.
- External scholarships frequently awarded to this program.

## 5. Student experience
- Recent reviews (cited).
- Workload signal.
- Community (international student %, languages, social fabric).

## 6. Cost of living (cross-check programs.yml estimate)
- Rent range (city + neighbourhood).
- Total monthly burn for a frugal student.

## 7. Career outcomes
- Industry placements (companies, roles, salaries if available).
- PhD placements (universities, advisors).
- Median time-to-first-offer.

## 8. Risk factors
- Funding shocks, faculty turnover, program restructuring rumors.

## 9. Final recommendation
- Apply / skip / waitlist-only. One sentence.

## Sources
- Numbered list with URLs.
```

## Rules

- Every numeric or qualitative claim must cite a source. If a number can't be sourced, write "no public data" rather than guessing.
- Note publication dates of cited sources — anything older than 24 months gets flagged.
- The brief is read-only — do NOT modify `programs.yml` or `scholarships.yml` from this mode.
