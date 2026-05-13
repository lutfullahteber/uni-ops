# Mode: program — Single-Program Evaluation A–G

When the user pastes a program listing (URL or text), produce all 7 blocks (A–F + G).

## Step 0 — Archetype detection

Classify the program into one of the 5 archetypes (see `_shared.md`). If hybrid, name the 2 closest. The archetype determines:
- Which proof points get priority in Block B
- Which recommender to pair (research-track → research advisor; coursework → high-grade course professor)
- SoP angle in Block E

## Block A — Program summary

Table with:
- University + program name
- Degree level (Bachelor / Master / PhD)
- Country + city
- Language of instruction
- **Duration (years / months)** — flag `[OUT OF RANGE]` if outside `target.duration_years_min`–`target.duration_years_max` from `profile.yml`
- Deadline (and rolling-vs-fixed)
- Apply portal URL
- Archetype detected
- TL;DR in 1 sentence

If duration is outside the user's target range AND `target.duration_strict: true` → recommend SKIP in the final score regardless of other blocks. If `duration_strict: false` → keep evaluating but cap Block F at 3.

## Block B — Academic match

Read `cv.md` + `academic-record.md`. Build a table mapping each stated requirement (GPA cutoff, prerequisite courses, test minimums, language requirement) to the student's actual record with exact citation lines.

**Adapt to archetype:**
- Research-Track → emphasize courses with research output, capstone publications, faculty interactions
- Coursework → emphasize cumulative GPA, top-of-class courses, breadth across core CS/math
- PhD → emphasize publications, prior research roles, named-advisor pre-contact
- Professional Master → emphasize industry experience, deployed systems, scale metrics
- Joint / Erasmus Mundus → emphasize multilingual capacity, prior international exposure

**Gaps section** — for each unmet requirement:
1. Is this a hard blocker or soft?
2. Can the student show adjacent evidence?
3. Mitigation plan: SoP framing, supplementary document, retake test, online certificate.

## Block C — Research / interest alignment

1. Pull `target.fields` and `narrative.research_interest` from `profile.yml`.
2. Read the program page for: faculty list, research groups, lab websites, current PhD/postdoc projects.
3. WebSearch 1–2 named faculty: recent publications, lab funding, accepting students?
4. Score the match: which specific faculty/lab/course track aligns? Cite by name.
5. If the program archetype is research-track or PhD, recommend 1–3 faculty for advisor pre-contact (this becomes the input for `/uni-ops contacto`).

## Block D — Funding fit (deterministic budget math)

Run the Block D math from `_shared.md`:

```
Tuition (program currency)        : X
Living estimate                   : Y
[Convert to funding.currency at rate R]
Scholarship coverage (best match) : Z  (from scholarships.yml; 0 if none)
Net annual cost                   : N
Cap (funding.total_annual_cap)    : C  (apply by_country override if present)
Block D score                     : S  (per table in _shared.md)
```

Always print this math line in the report.

Add:
- **Funding-blocked flag** if `funding_required && coverage_tuition < program_tuition * 0.5`.
- **Top 2 scholarship matches** for this program (from `scholarships.yml`, filtered by `citizenship_open`, `degree_level`, deadline ≥ today). If `scholarships.yml` is empty or missing, note: "No scholarships tracked yet — consider running scholarship discovery in Phase 2."
- WebSearch 1 query for "external scholarships for [program country] [field] [citizenship]" if no internal matches.

## Block E — Personalization plan

| # | Asset | Current | Proposed change | Why |
|---|-------|---------|-----------------|-----|
| 1 | CV summary | … | … | Highlight archetype-relevant proof points |
| 2 | SoP opening | … | … | Anchor in `narrative.research_interest`, then bridge to this lab |
| 3 | SoP fit paragraph | — | Name specific faculty + paper | Required for research-track |
| 4 | Recommender pairing | — | Pick 2 of 3 referees from `recommenders.yml` | Match referee strength to archetype |
| 5 | LinkedIn headline | … | … | Optional outreach prep |

Output:
- Top 5 changes to CV (specific bullets to rewrite, cited by line).
- SoP outline: 4–5 paragraphs with one-line topic each.
- Recommender pairing recommendation with rationale.

## Block F — Application strategy

- Documents required (CV, SoP, motivation letter, transcript, test scores, rec letters × N, portfolio, financial documents).
- Number of recommenders required → cross-check `recommenders.yml`. If `recommenders.confirmed < required`, surface as a blocker.
- Supplementary materials (writing sample, research statement, video, portfolio link).
- Deadline pacing — back-plan from deadline:
  - T−45d: ask recommenders (if not already)
  - T−30d: SoP draft 1
  - T−14d: SoP polished, transcripts ordered
  - T−7d: final review, submit buffer
- Flags: late application risk, missing documents, fee waiver opportunity.

## Block G — Posting legitimacy

Analyze the listing for signals (see `_shared.md` table). Output:
- Tier: **High Confidence** / **Proceed with Caution** / **Suspicious**
- Signals table: each signal with finding and weight (Positive / Neutral / Concerning)
- Context notes (sabbatical, redesign, etc.) explaining any concerns

---

## Post-evaluation

ALWAYS, after producing A–G:

### 1. Save the report

Save to `reports/{NNN}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md`.

- `{NNN}` = next sequential number, 3-digit zero-padded
- `{university-slug}` = lowercase, dashes (e.g., `tu-munich`)
- `{program-slug}` = short slug (e.g., `msc-informatics`)
- `{YYYY-MM-DD}` = today

**Report header:**

```markdown
# Evaluation: {University} — {Program}

**Date:** {YYYY-MM-DD}
**URL:** {program_url}
**Archetype:** {detected}
**Score:** {X/5}
**Legitimacy:** {High Confidence | Proceed with Caution | Suspicious}
**Block D math:** Tuition X + Living Y − Coverage Z = Net N (cap C) → score S
**SoP draft:** {output/sop-NNN-...-YYYY-MM-DD.pdf or pending}

---

## A) Program Summary
…

## B) Academic Match
…

## C) Research / Interest Alignment
…

## D) Funding Fit
…

## E) Personalization Plan
…

## F) Application Strategy
…

## G) Posting Legitimacy
…

## Keywords extracted
(15–20 keywords from the page for SoP/ATS tuning)
```

### 2. Register in tracker (TSV)

Write a TSV file to `batch/tracker-additions/{timestamp}-{university-slug}.tsv`:

```
target	date	university	program	country	deadline	tuition_per_year	net_cost_per_year	fit_score	status	sop	cv	rec_letters	decision	notes
applications	2026-05-13	TU Munich	MSc Informatics	Germany	2026-01-15	150	2150	4.3	Drafting	pending	pending	0/3		Top fit; funding manageable
```

The `target` column tells `merge-tracker.mjs` which tracker to append to (`applications` or `scholarships`).

NEVER edit `data/applications.md` directly to add new rows. Use the TSV + `npm run merge`.
