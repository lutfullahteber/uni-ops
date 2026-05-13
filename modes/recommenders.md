# Mode: recommenders — Recommender Outreach & Cadence

Manages the lifecycle of letter-of-recommendation requests: who to ask, when, what to send them, and how to keep the cadence without becoming a nuisance.

## When invoked

- Explicitly: `/uni-ops recommenders` (overview), `/uni-ops recommenders ask <referee> <program>`, `/uni-ops recommenders chase <referee>`.
- Automatically by `auto-pipeline` after a program scores ≥ 4.0 — drafts initial request emails for the paired referees.

## Inputs

- `recommenders.yml` — referee list, strengths, talking points, cadence.
- `data/recommenders.md` — outreach state (asked / confirmed / submitted).
- The program report — for archetype + named faculty + talking-points pairing.
- `config/profile.yml` — student identity.
- `cv.md`, `academic-record.md`, `extracurriculars.md` — context for what referees will be asked to vouch for.
- `modes/_profile.md` — recommender pairing rules + tone calibration.

## Subcommands

### `recommenders` (default — overview)

Read `recommenders.yml` + `data/recommenders.md`. Print a Markdown table:

```markdown
| Referee | Confirmed | Asked-on | Programs (n/m) | Days since last contact | Next action |
|---------|-----------|----------|----------------|-------------------------|-------------|
```

Surface top-3 next actions:
1. Referees not yet asked but needed for ≥ 1 active program with deadline ≤ T−45.
2. Referees confirmed but ≥ `cadence_days` since last contact with letters outstanding.
3. Referees with 0 submitted / m requested where deadline is ≤ T−14 (escalate).

### `recommenders ask <referee> <program>`

Draft an initial request email. Sections:

```markdown
Subject: Recommendation letter request — {program} application ({deadline})

Dear Prof./Dr. {Surname},

(1) Warm but brief opener — 1 sentence referencing how you know them
    (capstone advisor, course, internship — pull from `recommenders.yml`.relationship).

(2) Direct ask — 1 sentence:
    "I am applying to {program} at {University} for the {start_term} intake
    (deadline {YYYY-MM-DD}), and would be grateful if you could write a letter of
    recommendation on my behalf."

(3) Why-you paragraph — 2–3 sentences:
    "Your perspective on my {talking_point_1} and {talking_point_2} would be
    particularly valuable for this program because {program-specific reason —
    e.g., research-fit with {named faculty} or coursework rigor}."

(4) Logistics — 2–3 lines:
    - Submission method: {portal link, email upload, dossier service}
    - Deadline: {YYYY-MM-DD}
    - Materials I can send if helpful: my draft SoP, CV, transcript, the program page
    - Word count / format guidance from the program if specified

(5) Close — 1 line:
    "I understand this is a meaningful ask of your time. Please let me know
    by {deadline−5d} if you are able to support this application."

Sincerely,
{full_name}
{portfolio_url (if any)}
```

Save to `output/email-recommender-{referee-slug}-{program-slug}-ask.md`.

Add a row to `data/recommenders.md`:
```
| {n} | {Referee} | {email} | {relationship} | {Program} | {today} | (no) | 0/1 | {today} | drafted ask email |
```

Update `recommenders.yml` for this referee:
- Append the program to the in-memory list of requested programs.
- Set `last_contacted: today` once the user confirms they sent.

### `recommenders chase <referee>`

Draft a polite chaser if the referee hasn't confirmed within their `cadence_days`. Tone: warm, deferential. No guilt trips.

```markdown
Subject: Quick check-in — {program} reference

Dear Prof./Dr. {Surname},

I wanted to circle back gently about my application to {program} at {University},
which is due {YYYY-MM-DD}.

I'm conscious of how busy this time of year is and entirely understand if it
ends up not being possible. If you do plan to write, would you be able to let
me know by {chase-deadline}? I can also prepare a one-page summary of the
relevant capstone outcomes (Karate AI: {hero_metric}) if it would save you time.

Thank you so much for considering it.

Sincerely,
{full_name}
```

Update `data/recommenders.md` with the chase action + today's date.

### `recommenders submitted <referee> <program>`

User-driven update — the user tells uni-ops the referee submitted. Update `data/recommenders.md`:
- Increment `Submitted (n/m)`.
- Set `Last Contacted: today`.
- Note in the application's tracker row: `Rec Letters n/m` update.

## Recommender pairing rules

Block E of every program report includes a recommended referee pairing. This mode applies those rules consistently:

| Program archetype | Best pairing |
|-------------------|--------------|
| Research-Track MSc | Research advisor + theoretical-strength professor |
| Coursework MSc | High-grade course professor + research advisor |
| PhD Direct-Entry | Research advisor + research collaborator (named in a publication) + theory professor |
| Professional Master | Industry supervisor + advisor of capstone/internship |
| Joint / Erasmus Mundus | Research advisor + course professor; one ideally from a partner-country university if applicable |

## Rules

- NEVER send any email. Only draft and save.
- NEVER fabricate talking points — only use what's in `recommenders.yml` + `cv.md` + `academic-record.md`.
- NEVER hint that the user will "follow up if no response" — that subtext is implicit in the cadence; don't put it in writing.
- ALWAYS attach a logistics line (deadline + submission method) so the referee doesn't have to ask.
- Cadence: default 14 days between contacts; configurable per referee in `recommenders.yml`.
- Never include the student's phone number in recommender outreach.
- After T−14 to deadline, if a referee still hasn't submitted, surface in `/uni-ops followup` as **urgent**.

## Output index

All drafted emails land in `output/`:
- `email-recommender-{referee-slug}-{program-slug}-ask.md`
- `email-recommender-{referee-slug}-{program-slug}-chase.md`
- `email-recommender-{referee-slug}-{program-slug}-thanks.md` (after submission)

`data/recommenders.md` is the single source of truth for outreach state.
