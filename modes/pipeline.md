# Mode: pipeline — URL inbox processor

Process program-listing URLs accumulated in `data/pipeline.md`. The user drops URLs throughout the week and runs `/uni-ops pipeline` to evaluate them all.

## Workflow

1. **Read** `data/pipeline.md` → find `- [ ]` items under "## Pending".
2. **For each pending URL:**
   a. Compute the next sequential `REPORT_NUM` (read `reports/`, max number + 1).
   b. Extract the listing using Playwright (`browser_navigate` + `browser_snapshot`) → WebFetch → WebSearch.
   c. If the URL is unreachable → mark `- [!]` with a note and continue.
   d. Run the full **auto-pipeline**: A–G evaluation → report `.md` → SoP draft (if score ≥ 4.0) → PDFs → tracker TSV.
   e. Move from "## Pending" to "## Processed": `- [x] #NNN | URL | University | Program | Score/5 | SoP | CV`
3. **If 3+ URLs pending**, launch parallel agents (`Agent` with `run_in_background`) to maximize throughput. Never run 2+ Playwright sessions concurrently — serialize Playwright steps.
4. **At the end**, show a summary table:

```
| # | University | Program | Country | Score | Net Cost/yr | Status | Next action |
```

## Pipeline.md format

```markdown
## Pending
- [ ] https://www.cit.tum.de/.../msc-informatics
- [ ] https://ethz.ch/.../computer-science | ETH Zurich | MSc CS
- [!] https://protected.url/program — Error: login required

## Processed
- [x] #001 | https://www.cit.tum.de/.../msc-informatics | TU Munich | MSc Informatics | 4.3/5 | SoP ✓ | CV ✓
- [x] #002 | https://ethz.ch/.../computer-science | ETH Zurich | MSc CS | 3.6/5 | SoP ✓ | CV ✓
```

## Smart extraction from URL

1. **Playwright (preferred):** `browser_navigate` + `browser_snapshot`. Works for SPAs.
2. **WebFetch (fallback):** for static pages.
3. **WebSearch (last resort):** `site:university.edu` + program keywords.

**Special cases:**
- **LinkedIn / Notion / protected page:** likely requires login → mark `[!]` and ask the user to paste text.
- **PDF brochure URL:** read it directly with the Read tool.
- **`local:` prefix:** read the local file. Example: `local:jds/tum-msc-informatics.md` → read `jds/tum-msc-informatics.md`.

## Auto-numbering

1. List `reports/` files.
2. Parse the prefix number (e.g., `001-tu-munich-msc-informatics-2026-05-13.md` → 1).
3. New number = max + 1.

## Pre-flight sync check

Before processing any URL, verify source sync:
```bash
node cv-sync-check.mjs
```
If mismatched, warn the user before continuing.
