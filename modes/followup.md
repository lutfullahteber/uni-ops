# Mode: followup — Deadline & Outreach Cadence

## Purpose

Track three cadence types for university applications and surface overdue / upcoming actions with drafted follow-up text:

1. **application-deadline** — count down to each program's deadline; warn at T−30, T−14, T−7, T−2, T−0.
2. **recommender-chase** — referees who haven't confirmed or haven't submitted yet, based on `cadence_days` in `recommenders.yml`.
3. **post-submit** — applications in `Submitted` / `Awaiting Decision` longer than the program's typical turnaround (configurable; default 6 weeks). Surfaces polite check-in drafts.
4. **interview-thanks** — after an `Interview` status, draft a 24-hour thank-you note.

## Inputs

- `data/applications.md` — programs tracker
- `data/scholarships.md` — scholarships tracker
- `data/recommenders.md` — recommender state
- `recommenders.yml` — referee cadence + talking points
- `data/follow-ups.md` — history (one row per outreach action sent)
- `reports/` — context for tailored drafts
- `config/profile.yml`, `cv.md`, `modes/_profile.md` — identity + writing style

## Step 1 — Run cadence helper

```bash
node followup-cadence.mjs
```

Parse the JSON output. It groups entries by cadence type and urgency:

| Key | Contents |
|-----|----------|
| `metadata` | Run date; total programs / scholarships / recommenders tracked; overdue/urgent/upcoming counts |
| `application_deadlines` | Each program's deadline + days remaining + state of materials |
| `recommender_chasers` | Per referee × program: confirmed flag, last_contacted, cadence_days, days overdue |
| `post_submit_followups` | Applications past expected turnaround |
| `interview_thanks` | Interviews in last 24h needing thank-you |

## Step 2 — Triage

Sort actions by urgency:
- **Today** — deadline = today, interview yesterday, recommender chase 7+ days overdue
- **This week** — deadline ≤ 7 days, recommender chase 1–6 days overdue, post-submit nudges
- **This month** — deadline ≤ 30 days

## Step 3 — Draft per type

### application-deadline
Generate a personal todo list, NOT outreach. For each program with T−14 or less:
- Materials still missing (SoP, transcripts, rec letters, financial documents).
- 1-line action: "Order official transcript by Tuesday — vendor takes 5 business days."

### recommender-chase
Read the referee's `talking_points` from `recommenders.yml`. Draft a 4–6 sentence email:
1. Warm opener (no over-thanking).
2. Specific deadline reminder ("submission link expires {date} for the {program}").
3. Reference the talking points the user wants reflected — concrete and concise.
4. Offer to send the SoP draft if the referee wants context.
5. Sign-off.

Save to `output/email-recommender-{referee-slug}-{program-slug}.md`.

### post-submit
Polite check-in template (50–80 words) directed at the program's admissions office:
1. State applicant ID + program + intake.
2. Politely note time since acknowledgement.
3. Ask whether anything additional is needed from the applicant.
4. Sign-off.

Save to `output/email-followup-{program-slug}-{YYYY-MM-DD}.md`.

### interview-thanks
Within 24 hours of an interview, draft a 60–100 word thank-you. Personalize to ONE thing discussed in the interview (the user must supply the detail — ask).

Save to `output/email-thanks-{program-slug}-{YYYY-MM-DD}.md`.

## Step 4 — Update follow-ups log

Append a row per drafted action to `data/follow-ups.md`:

```markdown
| 2026-05-13 | recommender-chase | Prof. A. Yilmaz × TU Munich MSc | drafted email | output/email-recommender-yilmaz-tum-msc.md |
```

Do NOT mark as sent — that's the user's job after they review and send.

## Rules

- NEVER send anything. All drafts are reviewed by the user before going out.
- Drafts respect `modes/_profile.md` `## Writing Style` if present.
- Recommender chasers tone: warm, brief, deferential. Never instructive.
- Never reveal the user's phone number.
- Do not over-personalize — one specific anchor per email is enough.
