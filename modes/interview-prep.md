# Mode: interview-prep — Admission / Scholarship Interview Prep

When the user asks to prepare for an admission interview, video submission, or scholarship panel — or when an application status flips to `Interview` — run this mode.

## Inputs

1. **University + program** (required).
2. **Interview type:** admission interview / scholarship panel / video question / written follow-up / departmental Skype. (Ask the user if unclear.)
3. **Evaluation report** in `reports/` (if exists) — read for archetype, named faculty, Block B gaps, Block E proof points.
4. **Story bank** at `interview-prep/story-bank.md` — reuse and append.
5. **CV + academic-record + extracurriculars + `_profile.md`** for context.
6. **Recommenders** at `recommenders.yml` — sometimes referenced in interviews ("How do you know Prof. X?").

## Step 1 — Research

Run these WebSearch queries. Extract structured findings; cite sources.

| Query | What to extract |
|-------|-----------------|
| `"{university} {program} admission interview" reddit OR forum OR student blog` | Actual question themes, format (Skype/Zoom, panel of N), length |
| `"{university} {program}" interview tips site:reddit.com/r/gradadmissions OR site:thegradcafe.com` | Recent applicant write-ups, decision turnaround |
| `"{program} interview" prep` (general) | YouTube / blog prep guides, sample question banks |
| `"{scholarship} interview" panel` (if scholarship interview) | DAAD / Fulbright / MEXT panel structure, types of questions |
| `"{PI name}" lab interview` (if research-track / PhD) | First-hand accounts of how the named PI runs interviews |

If a `PI / advisor pre-contact` happened (mode `contacto`), include their style cues — turn the user's reply into prep notes.

**Do NOT fabricate questions.** If a source describes a theme, report the theme; do not invent a specific question. Inferred questions are clearly labelled `[inferred from program page]`.

## Step 2 — Process overview

```markdown
## Process Overview
- **Format:** {e.g., 30-min Zoom with PI; or panel of 3 faculty; or 15-min Skype with admissions committee}
- **Duration:** {X} minutes
- **Conducted by:** {PI / committee / external panel}
- **Language:** {English / German / Japanese / mixed}
- **Decision turnaround:** {e.g., "2–4 weeks"}
- **Known quirks:** {e.g., "Always asks the candidate to read a paper in advance"}
- **Sources:** {links}
```

## Step 3 — Question categories

Admission interviews tend to cluster into 6 categories. Prepare 2–3 STAR+R stories per category, drawn from `cv.md` + `academic-record.md` + `extracurriculars.md`.

| Category | Typical asks |
|----------|--------------|
| **Why this program / fit** | "Why our program?" / "Why this lab?" / "Why not {Competitor U}?" — Anchor in `_profile.md` SoP angle. Cite specific faculty / course / track. |
| **Research direction** | "What problem do you want to work on?" / "Have you read Prof. X's recent paper?" — Need 2–3 reading citations + opinion. |
| **Technical depth** | "Walk me through your capstone" / "Explain the math of {method}" — Need to defend `cv.md` Research Experience to a faculty member. |
| **Failure / weakness** | "Tell me about a mistake" / "What's a gap in your CV?" — Map to Block B gaps with mitigation. |
| **Long-term plans** | "PhD after MSc?" / "Industry vs academia?" / "Where in 5 years?" — Anchored in `narrative.research_interest` + `funding.eligible_programs`. |
| **Logistics / commitment** | "When can you start?" / "Funding sorted?" / "Family constraints?" — Reference `funding`, `target.start_term`, citizenship/visa status. |

## Step 4 — Reading prep (research-track / PhD interviews)

Pull 2–3 papers from the named PI's group (use Google Scholar via WebSearch). For each:
- 1-paragraph summary in plain English.
- The single methodological / experimental result that the user should reference if asked.
- A 1-line "next question" the user can pose to the interviewer (signals research curiosity).

## Step 5 — Story bank

For each STAR+R drafted in Step 3, append to `interview-prep/story-bank.md` if not already present:

| # | Category | Story | S | T | A | R | Reflection |

The **Reflection** column (the +R) captures what the user learned. Admissions committees probe for it.

## Step 6 — Mock-question list

Produce a final list of 15–25 likely questions tagged by category, ordered by likelihood. Add one suggested STAR+R / one-line answer pointer per question (not a full scripted answer — the user must internalize).

## Step 7 — Red-flag rehearsal

For any Block B gap (low GPA semester, no publication, late start in field, gap year, transfer), prepare a calm 30-second answer:
1. Acknowledge briefly.
2. Reframe with what changed afterwards.
3. Point to the concrete proof that the gap is behind the user.

## Output

Save to `interview-prep/{NNN}-{university-slug}-{program-slug}.md`. Link from the program's report in Block F.

## Rules

- Cite sources for any quoted question or claim about process.
- Never invent statistics.
- Keep prep one read-through; do not over-coach the user into a scripted answer style.
- Flag if the interview is in a language the user's CV is not in — recommend rehearsal in that language.
