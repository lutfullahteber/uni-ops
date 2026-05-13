# Legal Disclaimer & Acceptable Use

## 1. Nature of the Project

`uni-ops` is a collection of Markdown prompts, Node.js scripts, and HTML templates for **university and scholarship application** workflows. It is strictly a local execution tool. The maintainers do not host, deploy, or operate an AI system, nor do we provide API access to Large Language Models (LLMs).

Users download the code, run it on their own machines, and connect it to their own AI provider (Anthropic, OpenAI, or any other). The maintainers have no visibility into, control over, or responsibility for how the tool is used after download.

## 2. Data Privacy (GDPR / FERPA)

The maintainers do not act as a Data Controller or Data Processor under GDPR or any other data protection regulation.

- All Personal Identifiable Information (PII) the user inputs — CV, transcripts, test scores, recommender details, citizenship, financial budget, university communications — is processed **locally** on the user's machine.
- When the user invokes an AI CLI tool (Claude Code, Codex, OpenCode, etc.), the data the user provides is sent directly to the AI provider they chose. Users must review that provider's privacy policy.
- We do not collect analytics, telemetry, or usage data of any kind.
- API keys, credentials, and personal files (especially `academic-record.md`, `recommenders.yml`, scanned transcripts in `output/`, drafts in `jds/`) should be kept in private repositories. The default `.gitignore` excludes `output/`, `tmp/`, `node_modules/`, and `*.env`; users must verify before pushing.
- **Recommender PII (names, emails, institutional addresses) belongs to the referees.** Treat it with the same care as any third-party PII.
- **Transcripts and grade records may fall under FERPA-equivalent laws in the user's jurisdiction.** If the user shares them with any cloud-based AI provider, they accept responsibility for that disclosure.

## 3. AI Model Behavior

This tool interfaces with AI models via third-party CLI tools. The maintainers do not control these models and cannot guarantee their behavior.

- **Hallucinations:** AI models may fabricate skills, courses, grades, publications, faculty affiliations, scholarship eligibility, or program details. **The user must manually verify all generated documents — especially CVs, Statements of Purpose, recommender outreach, and form answers — before submitting to any university or funding body.**
- **Safety guardrails:** The default prompts instruct the AI never to auto-submit applications and to stop before the final send/apply/submit action. AI compliance is not guaranteed. If the user modifies the prompts or overrides the safety rules, they accept full responsibility for the AI's actions.
- **Evaluation accuracy:** Program fit scores, budget calculations, and admission-odds inferences are AI-generated opinions based on pattern matching, not professional admissions counseling. They should inform the user's judgment, not replace it.
- **Recommender drafts:** Recommender request emails are **drafts only**. The user reviews, edits, and sends them. The tool MUST NEVER auto-send any email on behalf of the user.

## 4. Third-Party Platforms

uni-ops interacts with university websites, program aggregators (DAAD, MastersPortal, FindAMasters, Erasmus Mundus catalogue), scholarship databases, and LinkedIn.

- Users must comply with the Terms of Service of every platform they interact with.
- Do not use this tool to scrape platforms that prohibit automated access.
- Do not use this tool to spam universities, admissions offices, professors, or current students.
- Any consequences from ToS violations — including IP bans, account restrictions, or legal action — are solely the responsibility of the user.
- **Faculty outreach must respect the human time it costs.** Use the `contacto` mode sparingly. Send one careful, well-researched email rather than ten generic ones.

## 5. Acceptable Use

uni-ops is designed to help individuals make better admissions decisions, not to automate away human judgment. Acceptable use includes:

- Evaluating program and scholarship fit to prioritize the user's time.
- Generating tailored CVs and Statements of Purpose that the user reviews and edits before submitting.
- Scanning public program-aggregator pages and university websites for open admissions cycles.
- Tracking the user's application pipeline, recommender outreach, and deadlines.
- Drafting outreach emails for the user to review and send.

Unacceptable use includes:

- Auto-submitting applications without human review.
- Scraping platforms that prohibit automated access.
- Submitting AI-generated content (especially SoPs, motivation letters, scholarship essays) without the user verifying its accuracy and originality.
- Misrepresenting qualifications, academic results, language proficiency, or citizenship.
- Forging recommender letters or impersonating referees in any way.
- Generating scholarship applications when the user does not meet the stated eligibility (citizenship, degree level, GPA threshold).

## 6. Academic Integrity

Universities increasingly use plagiarism and AI-detection tools on submitted essays. uni-ops drafts SoPs and motivation letters as **starting drafts**; the user must rewrite, personalize, and validate every paragraph before submission. Submitting an unedited AI draft as one's own work may violate the academic-integrity policies of the receiving institution and is the user's sole responsibility.

## 7. EU AI Act

Because this tool runs locally, is free, and is open-source, the maintainers are not placing an AI system on the market or putting one into service under the EU AI Act. Users who deploy the tool in a commercial or organizational context (e.g., a consulting practice serving multiple applicants) should assess their own obligations under the AI Act.

## 8. Indemnification

By using uni-ops, the user agrees to indemnify, defend, and hold harmless the authors, contributors, and any affiliated parties from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising from the user's use of this software, the user's violation of these terms, or the user's violation of any third-party terms of service or institutional academic-integrity policy.

## 9. Cost Responsibility

If the user uses paid AI providers (Anthropic API, OpenAI API, etc.), the user is solely responsible for monitoring and managing their token usage and associated costs. The maintainers are not responsible for unexpected charges.

## 10. MIT License

As stated in the [LICENSE](LICENSE) file:

> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## 11. Derivation from career-ops

uni-ops is an architectural derivative of [career-ops](https://github.com/santifer/career-ops) by Santiago Fernández de Valderrama, used under the MIT License. The `career-ops` name and brand are trademarks of Santiago Fernández de Valderrama; uni-ops does not use them as product name, domain, social handle, or endorsement claim. See [NOTICE.md](NOTICE.md) for attribution detail.

## 12. Changes

This disclaimer may be updated as the project evolves. Users are encouraged to review it periodically.
