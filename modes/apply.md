# Mode: apply — Live Application Form Assistant

When the user is at a program's online application portal, this mode helps fill the form by reading the rendered page, generating answers from the user's materials, and stopping BEFORE final submission.

## Inputs

- The application URL (or the user is already on the page in a Playwright session).
- `cv.md`, `academic-record.md`, `extracurriculars.md`, `config/profile.yml`, `modes/_profile.md`.
- The program's evaluation report in `reports/` (for archetype + named faculty + Block E framing).
- Any SoP/motivation drafts in `output/`.

## Workflow

1. **Open / refresh the page** with Playwright (`browser_navigate` + `browser_snapshot`).
2. **Read the form**: enumerate every field, label, character/word limit, file-upload slot, and free-text question.
3. **Map fields to source data:**
   - Identity (name, email, phone, address, citizenship) → `profile.yml.student`
   - Education (universities attended, GPA, dates) → `academic-record.md` + `cv.md`
   - Test scores → `academic-record.md` Standardized Tests
   - Recommenders (name, email, institution, relationship) → `recommenders.yml`
   - Essays (SoP, motivation, optional essays, "why us") → drafts in `output/` or generated on-the-fly
   - Document uploads (CV PDF, SoP PDF, transcripts, language certificates) → `output/` paths
4. **Generate free-text answers** for any unanswered prompts using the same A–F framing as the program report:
   - Anchor in `narrative.research_interest`.
   - Reference 1–2 specific lab / faculty / course.
   - Use 1–2 quantified proof points.
   - Respect the word/character limit. If the form imposes a limit not in the report, recompute and trim.
5. **Pre-fill** the form via Playwright — type values, attach uploaded files where the API allows.
6. **Generate a review summary** for the user — every field, the value to be submitted, and a "looks good?" prompt.

## STOP rule

ALWAYS stop before clicking `Submit` / `Apply` / `Send`. The user MUST review and click submission themselves. Surface the final form state with one sentence: "Review the page above and click Submit when ready."

## Output

A pre-submission summary `output/apply-summary-{NNN}-{university-slug}-{YYYY-MM-DD}.md`:

```markdown
# Pre-submission Summary — {University} / {Program}

**Deadline:** {YYYY-MM-DD} — submitting today T−{N} days
**Application URL:** {url}

## Fields ready
| Field | Value | Source |
|-------|-------|--------|

## Free-text answers
### {Prompt 1} (word limit: {N})
{answer}

### {Prompt 2}
{answer}

## Uploaded documents
- CV: output/cv-NNN-...-YYYY-MM-DD.pdf
- SoP: output/sop-NNN-...-YYYY-MM-DD.pdf
- Transcript: {path or "to upload manually"}

## To verify before submit
- [ ] Recommender emails match `recommenders.yml`
- [ ] SoP word count under {N}
- [ ] Names spelled as on passport
- [ ] Application fee paid / waiver applied
```

## Failure handling

- If Playwright can't render the form (login wall, CAPTCHA, embedded iframe) → write the field-by-field answers to the summary file and tell the user "I can't auto-fill from here; here are your answers ready to paste."
- If a required field has no source data → flag explicitly: "MISSING: {field} — please provide before submission."

## Rules

- NEVER submit on the user's behalf.
- NEVER fabricate fields. Empty optional fields are fine; missing required fields get flagged.
- NEVER share the user's phone number in publicly-visible fields if a less-sensitive alternative exists.
