# Mode: scan — Program Scanner

Scan configured university program pages + program-aggregator portals (DAAD, MastersPortal, FindAMasters, Erasmus Mundus catalogue) for newly-listed programs that match the student's `target.degree_level` + `target.fields` + `target.countries`. New URLs are appended to `data/pipeline.md` for downstream evaluation.

> The Node helper `scan.mjs` (`npm run scan`) does **WebFetch-only** scans against aggregator endpoints with simple HTML/JSON parsing. The agent flow (this mode) extends it with Playwright on tracked program pages and WebSearch fallbacks. Unlike job boards, university programs rarely expose stable JSON APIs, so Playwright is the primary path.

## Recommended execution

Run as a subagent to keep main context clean:

```
Agent(
    subagent_type="general-purpose",
    prompt="[contents of this file + programs.yml + scan-history.tsv]",
    run_in_background=True
)
```

## Configuration

Read `programs.yml`:
- `search_queries` — WebSearch queries with `site:` filters per aggregator
- `tracked_programs` — concrete program pages to revisit on every scan
- `title_filter` — positive/negative/level_filter keywords

Read `config/profile.yml`:
- `target.degree_level`, `target.fields`, `target.countries`, `target.start_term` — drive filtering downstream

## Discovery strategy (3 levels)

### Level 1 — Playwright direct (PRIMARY)

For each entry in `tracked_programs` with `enabled: true` and a `program_url`:
- `browser_navigate` to `program_url`
- `browser_snapshot` to read the page
- Verify: deadline ≥ today, language of instruction matches preference, the program still exists
- Extract any sibling program links the page surfaces (e.g., "Related Programs")
- If the page is stale (last-updated > 24 months) → flag in `notes` for the user to review

Playwright steps run **serial** — never 2+ Playwright sessions in parallel.

### Level 2 — Aggregator HTML / JSON (COMPLEMENT)

Some aggregators expose listing endpoints suitable for WebFetch:
- **DAAD** (`daad.de`) — search results page renders server-side; parse HTML cards
- **MastersPortal** (`mastersportal.com`) — listing page returns JSON-LD blocks
- **FindAMasters** (`findamasters.com`) — server-rendered HTML cards
- **Erasmus Mundus catalogue** (`erasmus-plus.ec.europa.eu/emjm-catalogue`) — paginated HTML

For each aggregator URL in `programs.yml`, WebFetch and parse the listing, extract `{title, university, url, country}`.

### Level 3 — WebSearch (BROAD DISCOVERY)

Run each `search_queries` entry where `enabled: true`. Use the query verbatim. For each hit extract `{title, university, url, country}`.

WebSearch results can be stale by months — every Level-3 URL must be verified live with Playwright before being added to pipeline.

## Workflow

1. **Read configuration**: `programs.yml`, `config/profile.yml`.
2. **Read history**: `data/scan-history.tsv` (already-seen URLs).
3. **Read dedup sources**: `data/applications.md`, `data/pipeline.md`.
4. **Level 1 — Playwright sweep** through `tracked_programs`.
5. **Level 2 — Aggregator WebFetch** (in parallel batches of 3).
6. **Level 3 — WebSearch queries** (in parallel where possible).
7. **Filter by `title_filter`**:
   - ≥ 1 `positive` keyword present (case-insensitive)
   - 0 `negative` keywords present
   - `level_filter` keyword present (e.g., "Master", "M.Sc.", "MSc") if defined
8. **Filter by `target.countries`** — drop hits outside the student's country list (unless explicitly cross-country / joint program).
9. **Dedup** against 3 sources:
   - `scan-history.tsv` (exact URL seen)
   - `applications.md` (university + program already evaluated)
   - `pipeline.md` (already in inbox or processed)
10. **Liveness check on Level 3 results (serial Playwright):**
    - `browser_navigate` + `browser_snapshot`
    - Classify as **Active** (deadline ≥ today + apply portal links visible) or **Expired** (deadline passed, "applications closed", "program discontinued", 404, redirect to generic landing)
    - On Expired → record in `scan-history.tsv` with `status=skipped_expired` and drop
    - On error → record `skipped_error` and continue
11. **For each Active new program** that passes filters:
    a. Append to `data/pipeline.md` "## Pending": `- [ ] {url} | {university} | {program}`
    b. Record in `scan-history.tsv`: `{url}\t{date}\t{level}\t{title}\t{university}\t{country}\tadded`
12. Records for filtered/duplicated/expired entries land in `scan-history.tsv` with the appropriate `status`.

## Scan History format

`data/scan-history.tsv` columns: `url`, `first_seen`, `source`, `title`, `university`, `country`, `status`.

Status values: `added`, `skipped_title`, `skipped_country`, `skipped_dup`, `skipped_expired`, `skipped_error`.

## Output summary

```
Program Scan — {YYYY-MM-DD}
━━━━━━━━━━━━━━━━━━━━━━━━━━
tracked_programs revisited: N
aggregator queries:         N
WebSearch queries:          N
Listings found:             N total
Filtered by title:          N relevant
Filtered by country:        N
Duplicates:                 N
Expired (Level 3):          N
NEW programs added:         N

  + {university} | {program} | {country} | deadline {YYYY-MM-DD}
  ...

→ Run /uni-ops pipeline to evaluate the new programs.
```

## URL hygiene for tracked_programs

`program_url` MUST point to the official university program page (not an aggregator entry). Aggregator pages are unstable and drop programs. If a `program_url` 404s, fall back to `scan_query` and log for manual update.

Known patterns:
- Direct university page (preferred): `https://www.cit.tum.de/.../msc-informatics`
- DAAD catalogue: `https://www2.daad.de/deutschland/studienangebote/international-programmes/...`
- Erasmus Mundus: `https://erasmus-plus.ec.europa.eu/emjm-catalogue/...`

## Maintenance of programs.yml

- Always save `program_url` when adding a new program.
- Save `tuition_per_year` + `est_living_cost_per_year` (drives Block D math). Use latest published rates; cite source in `notes` if non-obvious.
- Disable noisy queries with `enabled: false`.
- Tune `title_filter` and `level_filter` as preferences evolve.
- Revisit `tracked_programs` periodically — universities change page URLs after redesigns.
