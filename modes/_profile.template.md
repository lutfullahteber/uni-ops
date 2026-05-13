# User Profile Context -- uni-ops

<!-- ============================================================
     THIS FILE IS YOURS. It will NEVER be auto-updated.

     Customize everything here: degree-level archetypes, SoP angle,
     recommender talking points, location/funding policy.

     The system reads _shared.md (updatable) first, then this file
     (your overrides). Your customizations always win.
     ============================================================ -->

## Your Target Programs

<!-- Replace with YOUR target tracks. Examples:
     - Research-track MSc (thesis-heavy, lab rotation)
     - Coursework MSc (industry-oriented)
     - PhD direct-entry (stipend-funded)
     - Erasmus Mundus joint master
     - Professional Master (MEng, MS, MBA) -->

| Archetype | Thematic axes | What admissions buys |
|-----------|---------------|----------------------|
| **MSc Research-Track** | Thesis, lab rotation, advisor matching, publications | Student who can join a lab and ship research |
| **MSc Coursework (Europe/US)** | ECTS coursework, GPA cutoff, optional thesis | Student who can carry advanced coursework load |
| **PhD Direct-Entry** | Stipend, 4-5 years, named advisor, research statement | Future researcher with clear research agenda |
| **Professional Master (MEng/MBA)** | Industry partnership, capstone with company | Working professional or industry-bound graduate |
| **Joint / Erasmus Mundus** | Consortium, 2+ countries, mobility | Mobile candidate with multilingual / cross-cultural profile |

## Your Adaptive Framing

<!-- Map YOUR proof points to each archetype. Read from cv.md + extracurriculars.md + research-record. -->

| If the program is... | Emphasize about you... | Proof point sources |
|----------------------|------------------------|---------------------|
| MSc Research-Track | Capstone publications, lab-style ownership, reproduction of SOTA | cv.md Research Experience + Publications |
| MSc Coursework | GPA, top-class rank, mathematical maturity | cv.md Education + transcript |
| PhD Direct-Entry | Specific advisor fit, research agenda, prior research output | cv.md Publications + narrative.research_interest |
| Professional Master | Industry impact, deployed systems, scale | cv.md Projects + extracurriculars |
| Joint / Erasmus Mundus | Multilingual / cross-cultural profile, mobility | cv.md Languages + extracurriculars |

## Your Research Narrative

<!-- Replace with YOUR story. Anchors every SoP. -->

Use `narrative.research_interest` and `narrative.headline` from `config/profile.yml` to frame ALL content:
- **In SoP first paragraph:** the "why this field" hook
- **In SoP fit paragraph:** named-advisor / lab fit
- **In Motivation letters:** the bridge from past coursework/projects to future research

## Your Cross-cutting Advantage

<!-- What's your "signature move"? -->

Frame profile as **"X with proof"** — e.g. "Builder with public artefacts" or "Math-strong with deployed CV systems". Adapt per archetype.

## Your Portfolio / Demo

<!-- If you have a live demo or public project, list URL here. The PDF will surface it in the Summary. -->

If you have a portfolio (check `profile.yml.student.portfolio_url`), surface it in CV header and SoP closing.

## Your Language Policy

<!-- Most students need English-taught programs. Some want or need additional languages.
     Examples:
     - "Only English. Don't show me German-only Master's even at strong unis."
     - "English OR German — I have C1 Goethe-Zertifikat."
     - "Japanese-taught OK only if program has English thesis option."
     Edit your stance below. -->

**Default (from `config/profile.yml.target.languages_of_instruction`):** accept any program whose page lists one of the user's listed languages as a teaching language (case-insensitive substring).

**Edge cases:**
- "English-taught" programs that have 1–2 German courses: still pass (majority-English).
- "Mostly English, thesis in German": flag — depends on user's proficiency. Default to accept; SoP can address language plan.
- "Bilingual program (EN/DE 50/50)": accept if either language is in user list.
- Page says "language of instruction may vary": Playwright scrape the course catalogue to verify before scoring.

## Your Institution-Type Policy

<!-- Public vs private matters for cost (public ~free in DE/FR, private $$$ in US/UK)
     and for prestige signaling (private US elites vs public top-ranked Europe).
     Examples:
     - "Public only — I can't afford US private tuition."
     - "Private OK if scholarship covers 70%+."
     - "Either, no preference."
     Edit your stance below. -->

**Default (from `config/profile.yml.target.institution_type`):** values are `public`, `private`, or `any`.

**Edge cases:**
- "Semi-private" / "foundation universities" (e.g., German Stiftungsuniversitäten, Turkish vakif universities): treat as public for fee purposes if subsidies apply, else private.
- US state schools out-of-state tuition: treated as public for institution type but Block D budget math still uses the high out-of-state tuition figure.
- Always cross-check `funding_bundled` in `programs.yml` — a private school with a full assistantship beats a public school with no funding for affordability.

## Your Ranking Policy

<!-- Rankings are noisy but admissions committees and future employers use them.
     Examples:
     - "QS Subject top 50 only."
     - "QS Subject top 200; willing to go lower if the lab is world-class for my niche."
     - "Don't filter by ranking at all — fit > brand."
     Edit your stance below. -->

**Default (from `config/profile.yml.target.ranking_source` + `ranking_max`):** filter by the specified ranking source + threshold.

**Recommended `ranking_source` values:**
- `QS Subject` → best for finding "top CS program at otherwise mid-ranked university"
- `QS World` → for overall prestige
- `THE` → Times Higher Education subject ranking
- `ARWU` → Shanghai (research-output-weighted; favors PhD applicants)

**Edge cases:**
- Lab > rank: if a niche lab (e.g., a specific PI's group) is world-leading, Block C can override low ranking. Note this in `_profile.md`.
- Unranked but known-good (smaller universities, regional specialists): treat as `rank = 9999`; do NOT drop with `ranking_strict: true` unless the user is firm.
- US universities not in QS Subject: fall back to `QS World` or US News Best Graduate Schools — note the source switch in Block A.

## Your Thesis Policy

<!-- Thesis-required programs deliver depth + publication potential.
     Coursework-only programs are faster + safer for industry-bound students.
     Examples:
     - "Thesis required — I want PhD afterwards and need a publication."
     - "Optional thesis is fine — I'll do it if the topic is right."
     - "No thesis, I want industry placement support instead."
     Edit your stance below. -->

**Default (from `config/profile.yml.target.thesis`):** values are `required`, `optional`, `no_thesis`, `either`.

**Match rules (mirror `_shared.md` + scan.md):**
- User `required` → program must have `required` or `optional`. Drop pure-coursework.
- User `optional` → program must have `optional` or `required`. Drop `no_thesis`.
- User `no_thesis` → drop `required`.
- User `either` → no filter.

**Edge cases:**
- "Capstone project" can substitute for thesis in some MEng programs — treat as thesis-optional.
- "Industry thesis with company" (German Studienarbeit): treat as `required`.
- PhD programs are implicitly thesis-required — skip filter for PhD targets unless user explicitly wants research-by-coursework variants.

## Your Intake Season Policy

<!-- Most programs admit only Fall. Some have Spring intake.
     Examples:
     - "Only Fall — I want to start September 2027."
     - "Fall or Spring — I'm flexible on start term."
     - "Spring only — I need 6 more months to retake GRE."
     Edit your stance below. -->

**Default (from `config/profile.yml.target.intake_seasons`):** empty list = accept any intake. Non-empty list = filter to those seasons.

**Edge cases:**
- "Rolling admissions": treat as accepting all intakes; do not filter out.
- Programs with separate Fall + Spring deadlines (e.g., ETH MSc): list both seasons; the scanner will accept either.
- Intake season is rarely a hard blocker — keep `intake_strict: false` unless start-term is non-negotiable for visa/funding reasons.

## Your Duration Preference

<!-- Most candidates have strong opinions on program length. Examples:
     - "Only 1-year MSc — I need to start working fast."
     - "Want 2-year research-track for thesis depth."
     - "4-year PhD only, not 5+."
     Edit your stance below. -->

**Default rule (from `config/profile.yml`):** accept programs between `duration_years_min` and `duration_years_max`. `duration_strict: true` means scan drops out-of-range; `false` keeps them but Block A flags.

**Edge cases to handle:**
- Programs that span 1.5 years (3 semesters) — round up to 2 for filter purposes.
- Programs with optional extension (e.g., "1 year + 6 month thesis") — count the base + any default extension.
- PhD with "fast track" option (3 years vs default 5) — note both, score against the user's stated preference.

## Your Soft Preferences (AI awareness, not filters)

<!-- These live in `config/profile.yml.preferences`. Unlike `target.*` filters,
     these are NEVER used to auto-drop programs. They shape AI reasoning,
     comparison tiebreaks, SoP framing, and outreach. -->

| Preference | How AI uses it |
|------------|----------------|
| `application_fee.target_amount` | Mentioned in Block F notes when fee exceeds target. Never drops the program. |
| `scholarship.importance` | Tiebreaks in `/uni-ops programs`; shapes Block D narrative; recommends external-scholarship matches more aggressively for high-importance settings. |
| `standardized_tests.take_gre` / `take_gmat` | Flags effort cost of test-required programs; flags GRE-waived programs as time-savers. |
| `cohort.diversity_priority`, `international_student_share_min` | Used in `/uni-ops deep` to surface intl-student %. Flag in Block C if cohort thin. |
| `application_volume.target_count` | When >N high-fit programs exist, recommends top N + "tier 2 if time". |
| `post_degree_path.primary` | Anchors SoP closing paragraph + interview-prep emphasis + project-mode evaluation. |
| `free_notes` | Parsed as personal constraints. Referenced in Block E whenever relevant. |

**Rule:** if you want a hard cap on a soft preference, MOVE the field from `preferences` to `target` and define a `*_strict` companion. Otherwise, the AI uses it as context only.

**Edge cases:**
- High fee + full funding: AI should explicitly do the math ("$400 fee + €1500/mo stipend × 24 months = net positive €35,600 vs your fee preference"). Do NOT suggest skipping.
- "scholarship.importance: strong" + program with no funding: AI should aggressively search `scholarships.yml` AND WebSearch for external matches before scoring Block D. If no realistic external funding → recommend SKIP via reasoning (Block D), not by filter.
- GRE-avoidance: when AI sees 3+ high-fit programs require GRE, raise this in `/uni-ops patterns` or in a /uni-ops programs tiebreak narrative ("worth taking GRE if you want any of these 3").

## Your Funding Strategy

<!-- Adapt to YOUR situation. -->

**General guidance:**
- Score Block D using the budget math in `_shared.md` (tuition + living − coverage vs `funding.total_annual_cap`)
- Flag any program with `net_annual_cost > total_annual_cap` as funding-blocked → require external scholarship match
- Cross-reference `scholarships.yml` for matches before declining a high-fit program on funding grounds

## Your SoP Defaults

<!-- Reusable building blocks for SoP drafts. -->

**Opening hook (default):**
> "The first time I [moment-of-curiosity], I understood that [domain] would shape my career. Since then, [bridge to concrete proof point]."

**Why-this-program template:**
> "Program X aligns with my interests through [specific lab / course / faculty]. In particular, Prof. Y's work on [paper / topic] connects directly to my own work on [your project]."

**Closing commitment:**
> "I am applying with the goal of [specific research output / career outcome]. I bring [signature strength] and am ready to [contribute concretely]."

## Your Location Policy

<!-- Adapt to YOUR situation. -->

**Hard constraints:**
- Visa: state citizenship + sponsorship needs from `profile.yml.funding.citizenship`
- Climate / family / partner: list any hard constraints

**Scoring impact:**
- Country in `target.countries` top 3: full Block C score
- Country not listed: cap Block C at 3.0 unless program is uniquely top-fit on research

## Writing Style

_Populated by uni-ops after scanning `writing-samples/`. Do not edit by hand unless you want to override._
