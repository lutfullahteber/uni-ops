# Mode: contacto — LinkedIn / Email Outreach

University admissions outreach is fundamentally different from job-search outreach: you are usually contacting **professors** or **lab members** to express genuine research fit, not "recruiters". This mode generates short, research-anchored outreach for the four contact types that matter in academic applications.

1. **Identify targets** via WebSearch + the program page:
   - **Principal Investigator (PI)** — the named faculty whose research you cite in Block C of the program report.
   - **Lab / group members** (PhD students, postdocs) — current students of the PI; they answer questions about the lab environment.
   - **Admissions officer / program coordinator** — administrative contact for clarifying eligibility, application logistics.
   - **Current student in the program** — someone currently enrolled; ideal for the "what's it really like" question.

2. **Classify the contact type** — ask the user or infer from context.

3. **Pick the primary target.** Default = PI for research-track / PhD programs; admissions officer for coursework MSc; current student if the user just wants ground-truth.

4. **Generate the message** with the appropriate 3-sentence framework. Channel: LinkedIn DM or institutional email (the user picks; default to email for faculty).

### PI / Faculty (research fit)
- **Sentence 1 (Hook):** specific reference to ONE recent paper or project from their group. Cite the title or a key result, not the topic generically.
- **Sentence 2 (Bridge):** the student's own work that connects to that paper — one quantified outcome.
- **Sentence 3 (Ask):** narrow, low-friction. "Would you be open to a brief reply on whether you'll be accepting students for {start_term}?" (PhD) or "I'm preparing my MSc application and would value 1–2 lines on whether your lab takes Master's students." (MSc research-track).

### Lab / group member (PhD student / postdoc)
- **Sentence 1 (Interest):** genuine reference to their work — a blog post, GitHub project, recent publication.
- **Sentence 2 (Bridge):** what the student is working on in the same space.
- **Sentence 3 (Ask):** "Would you have 15 minutes to share what working in {PI}'s group is actually like? Happy to keep it short."

### Admissions officer / program coordinator
- **Sentence 1 (Identity):** "I'm a {citizenship} applicant for the {YEAR} intake of {program}."
- **Sentence 2 (Question):** ONE specific question that isn't on the page (e.g., "Does the program require a notarized translation of the transcript, or is an unofficial English copy acceptable for initial review?").
- **Sentence 3 (Close):** "Thank you for your time."

### Current student in the program
- **Sentence 1 (Identity):** "I'm applying to {program} for {start_term} and saw you on LinkedIn."
- **Sentence 2 (Specific):** ONE concrete question — workload, social life in {city}, exchange-track quality, internship support.
- **Sentence 3 (Ask):** "If you're open to a 10-minute reply by message, I'd really appreciate your take."

5. **Alternate targets** — list 2–3 with rationale for why each is a good second choice.

## Output

```markdown
# Outreach for {University} — {Program}

**Primary target:** {Name, role, LinkedIn URL / email}
**Channel:** {email | LinkedIn}
**Subject (email only):** {≤ 60 chars}

## Message
{3-sentence message}

## Alternate targets
1. {Name} ({role}) — why
2. {Name} ({role}) — why
```

Save to `output/contacto-{NNN}-{university-slug}-{program-slug}.md` and link it in the report Block E.

## Rules

- ≤ 300 characters for LinkedIn DMs; up to 150 words for email.
- No corporate-speak, no "I am writing to express my interest in..."
- No "I am passionate about..."
- NEVER share the student's phone number.
- NEVER ask the recipient to forward the application.
- For faculty: address as "Dear Prof. {Surname}" (use full title once you've verified rank; default "Prof." if unsure for tenured staff, "Dr." for postdocs).
- For PhD students: address by first name unless their public profile uses a title.
- Sign with: full name → one line CV anchor → portfolio URL (if set) → "Sincerely". No phone, no full address.
