# Mode: batch — Parallel Program Evaluation

For evaluating 5+ program listings in parallel (e.g., a fresh portal scan dumped 10 new URLs into `data/pipeline.md`). Splits the work across subagents, each running a self-contained evaluation prompt; results are merged via TSV at the end.

## When to use

- 3+ pending URLs in `data/pipeline.md` AND none requires Playwright on the same domain in parallel.
- A user explicitly asks "batch evaluate these".

Otherwise prefer `pipeline` mode (sequential), which lets you reuse Playwright sessions safely.

## Workflow

1. Read `data/pipeline.md` — list `- [ ]` URLs under "## Pending".
2. Read `batch/batch-prompt.md` — the self-contained evaluator (a copy of `program.md` + `_shared.md` essentials).
3. Compute `start_num` = max `reports/` index + 1.
4. Split the URL list into groups of up to 3 (Playwright limit).
5. For each group, spawn an Agent (`subagent_type=general-purpose`, `run_in_background=true`) with:
   - The contents of `batch/batch-prompt.md`
   - The URL list for that group
   - The sequential numbers for this group
   - `cv.md`, `academic-record.md`, `_profile.md`, `programs.yml`, `scholarships.yml` (relative-path references; subagent reads them)
6. Each subagent must:
   - Run A–G evaluation per URL.
   - Write reports to `reports/{NNN}-...-{YYYY-MM-DD}.md`.
   - Write its TSV chunk to `batch/tracker-additions/{timestamp}-{group}.tsv`.
   - Append "## Processed" entries to `data/pipeline.md` (atomic line-append; tolerate concurrent writers).
7. After all subagents finish, run `npm run merge` to consolidate TSVs into `data/applications.md`.
8. Print a summary table:

```
| # | University | Program | Country | Score | Net Cost/yr | Status | Recommended next |
```

## Subagent prompt skeleton

`batch/batch-prompt.md` already contains the evaluator. Update it whenever `_shared.md` or `program.md` change materially. The skeleton:

```
[contents of _shared.md scoring + Block D budget math + global rules]

[contents of program.md evaluation flow]

You will receive:
- A list of N program URLs
- Starting report number {start_num}
- File paths for cv.md, academic-record.md, _profile.md, programs.yml, scholarships.yml

For each URL:
1. Extract with Playwright → WebFetch → WebSearch.
2. Run A–G evaluation.
3. Save report to reports/{NNN+i}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md.
4. Append a TSV line to batch/tracker-additions/{timestamp}-{group}.tsv.
5. Append a Processed line to data/pipeline.md.
```

## Failure handling

- If a URL fails extraction → write a stub report with `Status: extraction-failed`, TSV with `notes=extraction-failed`, leave the pipeline entry as `- [!]`.
- If a subagent crashes → re-spawn for the remaining URLs in its group; the others already finished are committed via TSV.
- Recommender drafts (Step 5 of `auto-pipeline`) are NOT produced in batch mode by default — only in single-URL pipeline. Keeps batch fast; user runs `/uni-ops recommenders` afterwards on the high-fit subset.

## Rules

- NEVER more than 3 Playwright sessions in flight at once.
- NEVER write to `data/applications.md` from the subagents. All writes go through `batch/tracker-additions/` + `npm run merge`.
- Each subagent gets the SAME `cv.md` / `_profile.md`. They must NEVER edit those files.
