# Mode: auto-pipeline — Full automatic pipeline

When the user pastes a program listing (URL or text) without an explicit sub-command, run the whole pipeline in sequence.

## Step 0 — Extract the listing

If the input is a **URL** (not pasted text), follow this strategy:

**Priority order:**
1. **Playwright (preferred):** university program pages are often JavaScript-rendered. Use `browser_navigate` + `browser_snapshot`.
2. **WebFetch (fallback):** for static pages (DAAD, mastersportal.com, findamasters.com).
3. **WebSearch (last resort):** search "site:university.edu/program" + degree + field.

**If no method works:** ask the user to paste the program description manually or share a screenshot.

**If the input is text:** use directly.

## Step 1 — Evaluate A–G

Execute exactly like the `program` mode (read `modes/program.md` for blocks A–F + G). The report MUST include the Block D math line and any funding-blocked flag.

## Step 2 — Save the report

Save to `reports/{NNN}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md` (format in `modes/program.md`). Header includes `**URL:**`, `**Legitimacy:**`, and the Block D math line.

## Step 3 — Draft SoP (if score ≥ 4.0)

If the global score is ≥ 4.0, execute `modes/sop.md` to draft a Statement of Purpose. Save to `output/sop-{NNN}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md` (markdown source for the SoP PDF). The header of the SoP cites: program archetype, named faculty/lab, top 2 proof points.

## Step 4 — Generate PDF

Read `config/profile.yml` → `documents.generate` list. By default, generate **cv** + **sop** in `output/`:

```
node generate-pdf.mjs --template cv --report reports/{NNN}-{slug}.md
node generate-pdf.mjs --template sop --source output/sop-{NNN}-{slug}.md
```

If `cv.output_format` is not `html`, fall back to no-PDF and surface a notice (LaTeX is not supported in v0.1.0).

## Step 5 — Recommender prep (if score ≥ 4.0)

Read `recommenders.yml`. From Block E pairing, pick the 2–3 referees most relevant for this program's archetype. For each:
- If `confirmed: false` → add a row to `data/recommenders.md` with status `Identified` and a draft request email in `output/email-recommender-{referee-slug}-{program-slug}.md`.
- If `confirmed: true` → add a row tying this program to that referee and draft a "submit by {deadline−14d}" reminder email.

Never auto-send. Tell the user the drafts are ready to review.

## Step 6 — Update the tracker

Add a TSV row in `batch/tracker-additions/` (target=applications) with all columns: date, university, program, country, deadline, tuition_per_year, net_cost_per_year, fit_score, status (`Drafting` if score ≥ 4.0 else `SKIP` recommendation), sop=pending/`output/...md`, cv=pending/`output/...pdf`, rec_letters=`0/{required}`, decision=blank, notes=short rationale.

Then run `npm run merge` (or instruct the user to).

If any step fails, continue with the rest and mark the failed step as `pending` in the tracker notes column.
