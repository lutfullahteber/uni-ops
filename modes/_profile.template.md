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
