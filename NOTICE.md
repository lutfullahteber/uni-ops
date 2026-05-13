# NOTICE

## Attribution

uni-ops is an architectural derivative of [career-ops](https://github.com/santifer/career-ops) by Santiago Fernández de Valderrama, used under the MIT License (see `LICENSE`).

The following originated in career-ops and are reused, modified, or extended by uni-ops:

- The mode-router pattern in `.agents/skills/*/SKILL.md`.
- The `_shared.md` + `_profile.md` separation-of-concerns split between system defaults and user overrides.
- The TSV-staging + `merge-tracker.mjs` merge contract for tracker additions.
- The Playwright HTML→PDF pipeline in `generate-pdf.mjs` (including Unicode ATS-normalization).
- The follow-up cadence pattern (`followup-cadence.mjs`).
- The pipeline / scan / batch / report-numbering conventions.
- The doctor / cv-sync-check / verify-pipeline validation scripts.
- Self-hosted fonts in `fonts/` (Space Grotesk and DM Sans, originally distributed by Google Fonts under SIL Open Font License 1.1).

The following are new in uni-ops:

- The student / academic-record / extracurriculars / programs / scholarships / recommenders data model.
- The Block D budget math (`net_annual_cost` vs `total_annual_cap`) and per-country override.
- `modes/sop.md` and `modes/recommenders.md`.
- The university-archetype taxonomy (MSc Research-Track, MSc Coursework, PhD Direct-Entry, Professional Master, Erasmus Mundus).
- The academic CV section ordering and SoP PDF template.

## Trademark

`career-ops` is a trademark of Santiago Fernández de Valderrama; it is NOT used as the product name, domain, social handle, or app-store listing for uni-ops. The relationship is descriptive only ("architecture based on career-ops" / "inspired by career-ops" / "fork of career-ops"). No endorsement, sponsorship, or affiliation is claimed.

## Fonts

`fonts/space-grotesk-*.woff2` and `fonts/dm-sans-*.woff2` are distributed under the SIL Open Font License 1.1. See https://fonts.google.com/specimen/Space+Grotesk and https://fonts.google.com/specimen/DM+Sans for the upstream licenses.

## Third-party dependencies

See `package.json` for the runtime dependency list. All listed npm packages are MIT, Apache-2.0, or ISC licensed at the versions pinned.
