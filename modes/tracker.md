# Mode: tracker — Application Tracker Overview

Read and display the trackers: `data/applications.md` (programs) and `data/scholarships.md` (scholarships, optional). Surface `data/recommenders.md` if populated.

## Programs tracker format

```markdown
| # | Date | University | Program | Country | Deadline | Tuition/yr | Net Cost/yr | Fit Score | Status | SoP | CV | Rec Letters (n/m) | Decision | Notes |
```

Status (canonical, from `templates/states.yml`):
- `Drafting` → SoP / materials in progress, not submitted
- `Submitted` → application sent
- `Awaiting Decision` → school acknowledged; reviewing
- `Interview` → admission interview scheduled
- `Admitted` → offer received
- `Waitlisted` → on waitlist
- `Rejected` → declined
- `Withdrawn` → withdrew
- `SKIP` → identified but decided not to apply

Cells `Tuition/yr`, `Net Cost/yr` carry numeric values (program currency or normalized to `funding.currency`).

## Scholarships tracker format

```markdown
| # | Date | Scholarship | Body | Coverage | Deadline | Fit Score | Status | Result | Notes |
```

Status canonical (scholarships): `Identified, Drafting, Submitted, Awaiting Decision, Interview, Awarded, Rejected, Withdrawn, SKIP`.

## Recommenders tracker format

```markdown
| # | Referee | Email | Relationship | Programs Requested | Asked On | Confirmed | Submitted (n/m) | Last Contacted | Notes |
```

## When the user asks to update a status

- New rows → instruct the user to use TSV + `npm run merge`. NEVER edit the table to add rows directly.
- Existing rows → editing `Status`, `Decision`, `Notes`, `Rec Letters (n/m)`, `SoP`, `CV` columns IS allowed; canonicalize status against `templates/states.yml`.

## Statistics to surface

For programs tracker:
- Total applications by status (count + %)
- Average fit score
- Deadlines in next 30 / 60 / 90 days (with university + program)
- Programs flagged funding-blocked
- Net Cost/yr distribution (min, median, max)
- Materials readiness: % with SoP draft, % with CV PDF, % with rec letters at required count

For scholarships tracker:
- Total tracked + by status
- Aggregate coverage across `Awarded`
- Upcoming deadlines

For recommenders:
- Confirmation status (asked vs confirmed)
- Outstanding submissions per referee
- Overdue chasers (last_contacted + cadence_days < today and `Submitted (n/m)` < m)

Output: clean Markdown tables and a short prose summary highlighting the top 3 next actions.
