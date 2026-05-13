# Mode: sop — Statement of Purpose Drafter

Generates a Statement of Purpose tailored to one specific program. SoP is the highest-leverage application document for research-track / PhD programs and a strong differentiator for coursework MSc applications.

## When invoked

- Explicitly by the user: `/uni-ops sop <program-name>` or `/uni-ops sop <report-number>`.
- Automatically by `auto-pipeline` when the program score is ≥ 4.0.

## Inputs

- The program's evaluation report in `reports/` (REQUIRED — drives archetype, named faculty, top proof points, Block E plan).
- `cv.md`, `academic-record.md`, `extracurriculars.md`.
- `config/profile.yml` — especially `narrative.research_interest`, `narrative.headline`, `target.fields`, `student.full_name`.
- `modes/_profile.md` — SoP defaults (opening hook, fit template, closing commitment), archetype framing.
- `writing-samples/` — for style calibration. Use the cached `## Writing Style` in `_profile.md` if present.

## Pre-flight

If `modes/_profile.md` has no `## Writing Style` block, scan `writing-samples/` once and write the cached style block. This avoids re-scanning on every SoP draft.

If the program report doesn't exist yet, instruct the user to run `/uni-ops program <url>` first. SoP drafts from scratch (no report) are not supported — they produce generic essays the user will rewrite anyway.

## Length & format target

| Program type | Default length | Override if |
|--------------|----------------|-------------|
| Coursework MSc | 500–700 words | Program prompt specifies (e.g., 800-word essay) |
| Research-track MSc | 700–1000 words | Program asks for "research statement" of fixed length |
| PhD direct-entry | 900–1200 words | Program splits into multiple essays |
| Erasmus Mundus | 600–800 words | Joint consortium has different word limits per partner |

Always check the program page for explicit word/character limit and overshoot detection. Print the limit + actual count in the output header.

## Structure (5 paragraphs default)

### Paragraph 1 — Hook + Research interest (≈ 100–130 words)
A concrete moment, project, or observation that crystallized the user's interest in the target field. NOT "ever since I was young". Anchored in something specific the user did or saw. Bridges into the user's current `narrative.research_interest`.

### Paragraph 2 — Academic foundation (≈ 100–130 words)
Tight summary of the user's undergrad arc and the 2–3 academic experiences (courses, capstone, research projects) that prepared them for this program. Cite specific course titles, grades only if exceptional, and quantitative outcomes from research.

### Paragraph 3 — Bridge experience / professional context (≈ 100–150 words)
If the user has industry experience, deployed work, OSS contributions, or extracurricular leadership relevant to the field, place it here as the "what I've done since" arc. For straight-from-undergrad applicants, this paragraph can fold into Paragraph 2 — instead surface broader research output (publications, talks, OSS).

### Paragraph 4 — Fit with THIS program (≈ 150–200 words; THE HIGHEST-LEVERAGE PARAGRAPH)
1. Name 2–3 specific faculty + lab + one of their recent papers.
2. State how the user's research interest intersects with their work.
3. Mention 1–2 specific course tracks / electives / departmental resources that map to the user's plan.
4. (If research-track / PhD) state preferred advisor and lab — with rationale.

The Block E entry in the program report already lists named faculty and the Block C alignment notes. Reuse them here.

### Paragraph 5 — Forward-looking commitment (≈ 80–120 words)
What the user will pursue at this program (research direction, capstone topic, internship targets), and the 5-year arc afterwards.

**Anchor the post-degree arc in `profile.yml.preferences.post_degree_path.primary`:**
- `phd` → close with "Following the Master's, I plan to apply for a PhD in [area], building on the thesis work."
- `industry_research` → close with named target industries / company types ("…to join an industry research lab working on [area]").
- `industry_product` → close with applied-engineering ambition ("…ship CV-powered features to production at scale").
- `startup` → close with venture / problem-finding stance.
- `academia` → close with named long-term academic commitment (postdoc → tenure-track).

One sentence on what they bring back / contribute. Avoid "I will make the world a better place".

## Style rules

- Active voice. First-person.
- Short → medium sentence cadence. No 4-clause monsters.
- Each paragraph opens with a different word.
- Apply cached `## Writing Style` markers from `_profile.md`.
- Hard ban on the cliché list in `_shared.md` (passionate / lifelong dream / prestigious / world-class / synergy / etc.).
- Citations of papers / faculty / courses use exact names, not paraphrase.
- No hedging filler ("I believe I would be a good fit"). State the fit; the reader decides.

## Output

Save the SoP markdown source to `output/sop-{NNN}-{university-slug}-{program-slug}-{YYYY-MM-DD}.md`:

```markdown
# Statement of Purpose — {University} / {Program}

**Applicant:** {full_name}
**Date:** {YYYY-MM-DD}
**Word limit (from program):** {N or "not specified"}
**Word count:** {actual}

---

{Paragraph 1}

{Paragraph 2}

{Paragraph 3}

{Paragraph 4}

{Paragraph 5}

---

## Notes for the writer
- Strongest claim in this draft: {…}
- Weakest claim that needs verification: {…}
- Suggested factual check: {e.g., "verify that Prof. X's lab is accepting Master's students this cycle"}
```

## Next step

After writing the markdown, run `node generate-pdf.mjs --template sop --source output/sop-{...}.md` to produce the PDF. Update `data/applications.md` SoP column with the markdown path (pre-PDF) or PDF path (post-PDF).

## Rules

- NEVER invent a publication, course, or grade not in `cv.md` / `academic-record.md`.
- NEVER claim a specific advisor connection that isn't confirmed (no "Prof. X agreed to advise me" unless `recommenders.yml` confirms it).
- Always print the program's word limit + the actual word count. If over, surface that in the writer notes.
- Do not produce a SoP without a corresponding program report — the named-faculty paragraph requires Block C research.
