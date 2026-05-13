# Mode: pdf — ATS-Friendly PDF Generation

Generates PDFs for academic documents. Two kinds are supported in v0.1.0:
- `cv` — Academic CV based on `cv.md` + `academic-record.md`
- `sop` — Statement of Purpose based on a SoP markdown source

Invocation:
- `node generate-pdf.mjs --template cv --program {NNN}` → CV tailored to the program in `reports/{NNN}-*.md`
- `node generate-pdf.mjs --template sop --source output/sop-{NNN}-*.md` → SoP PDF from a drafted SoP markdown

## CV pipeline

1. Read `cv.md`, `academic-record.md`, `extracurriculars.md`, `config/profile.yml` as the sources of truth.
2. Read the program report `reports/{NNN}-*.md` to learn the archetype, named faculty, and key proof points to surface.
3. Detect language of instruction (English by default).
4. Detect country → paper format:
   - US / Canada → `letter`
   - Rest of the world → `a4`
5. **Adapt to archetype** (from the report):
   - Research-Track / PhD → emphasize Research Experience, Publications, capstone outputs. Section order: Education → Research Experience → Publications → Projects → Skills → Awards
   - Coursework MSc → emphasize GPA + course list. Section order: Education → Selected Courses → Projects → Skills → Awards → Research Experience
   - Professional Master → emphasize industry roles and metrics. Section order: Education → Work Experience → Projects → Skills → Awards
6. Rewrite the headline summary (2–3 lines) anchored in `narrative.research_interest` + the top program-specific proof point.
7. Pick top 3–4 most relevant proof points / projects for this program.
8. Reorder Research Experience and Projects bullets by relevance to program archetype + named research areas.
9. Inject keywords from the program page **only where truthful** — never fabricate.
10. Render HTML from `templates/cv-template.html` + personalized content.
11. Slug the student name: `student.full_name` from `profile.yml` → kebab-case lowercase (e.g., "Jane Smith" → `jane-smith`).
12. Write HTML to `tmp/cv-{candidate}-{university-slug}.html`.
13. Run: `node generate-pdf.mjs --template cv tmp/cv-{...}.html output/cv-{NNN}-{candidate}-{university-slug}-{YYYY-MM-DD}.pdf --format={letter|a4}`.
14. Report: PDF path, number of pages, coverage of program keywords.

## SoP pipeline

1. Read the SoP markdown source (drafted by `modes/sop.md`).
2. Read `student.full_name`, `student.email` from `profile.yml` for the header.
3. Read the program report header (university, program, archetype) — the SoP header echoes them.
4. Render HTML from `templates/sop-template.html`.
5. Write to `tmp/sop-{candidate}-{university-slug}.html`.
6. Run: `node generate-pdf.mjs --template sop tmp/sop-{...}.html output/sop-{NNN}-{candidate}-{university-slug}-{YYYY-MM-DD}.pdf --format={letter|a4}`.
7. Report: PDF path, word count (most SoP prompts have a word limit — flag if over).

## ATS / readability rules (apply to both kinds)

- Single-column layout (no sidebars, no parallel columns).
- Standard section headers ("Education", "Research Experience", "Publications", "Projects", "Skills", "Awards" for CV; SoP needs no internal headers unless prompt requires).
- No text inside images or SVGs.
- No critical info in PDF headers/footers (parsers ignore them).
- UTF-8, selectable text (not rasterized).
- No nested tables.
- Program keywords distributed: Summary + first bullet of each section.

## Visual design

- **Fonts:** Space Grotesk (headings, 600–700) + DM Sans (body, 400–500). Self-hosted in `fonts/`.
- **Header:** name in Space Grotesk 24px bold + thin accent line + single contact row.
- **Section headers:** Space Grotesk 13px, uppercase, letter-spacing 0.05em.
- **Body:** DM Sans 11px, line-height 1.5.
- **Margins:** 0.6in.
- **Background:** pure white.

## Ethical keyword integration

Legitimate rewrites (truthful, just rephrased):
- Program emphasizes "computer vision research" and CV says "deep learning project" → "deep learning project applying convolutional networks to computer vision".
- Program emphasizes "research-track thesis" and CV says "capstone" → "capstone research thesis".
- Program emphasizes "publications encouraged" and CV says "work in submission" → "submitted manuscript under review at [venue]".

NEVER add a publication that doesn't exist, a course not taken, a metric not measured.

## Output paths

- CV: `output/cv-{NNN}-{candidate}-{university-slug}-{YYYY-MM-DD}.pdf`
- SoP: `output/sop-{NNN}-{candidate}-{university-slug}-{YYYY-MM-DD}.pdf`

Update the CV / SoP column in `data/applications.md` after generation.

## Failures

If Playwright PDF generation fails (font load, layout overflow), retry with safe-mode CSS (system fonts, smaller margins). If still failing, surface the error and write `tmp/cv-{...}.html` for the user to render manually.
