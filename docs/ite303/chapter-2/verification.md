# Draft verification notes

## 2.1.3 verification — September 16, 2026

### Scope and sources

- Inspected the project instructions, development plan, UI/UX guidance, approved 2.1.1 and 2.1.2, old `01-server-lifecycle.md`, HTTP prerequisite, Chapter 2 wrappers/metadata/overview, README, instructor guide, and existing verification notes. Initial working tree was clean.
- Used 2.1.1/2.1.2 as the teaching-pattern references. Used the old combined lesson's middleware order, JSON parsing, one-response rule, fallback, and error-flow concepts as source material; authored a new incremental student example instead of copying its advanced server. The old handout and route remain unchanged.
- Created `01c-middleware-complete-server.md` and its thin `middleware-complete-server/page.mdx` wrapper. Added sidebar and overview links, documented the teaching sequence in README/PLAN, and removed only the requested draft labels from 2.1.1/2.1.2.
- Consulted official [Express middleware](https://expressjs.com/en/guide/using-middleware/), [Express 5 API](https://expressjs.com/en/5x/api/), and [error-handling](https://expressjs.com/en/guide/error-handling/) documentation. The installed Next.js guide directory remains absent; consulted the [Next.js 15 page convention](https://nextjs.org/docs/15/app/api-reference/file-conventions/page). No framework or dependency changes.

### Checks actually run

- `pnpm lint`: passed.
- `pnpm exec tsc --noEmit`: passed.
- `pnpm build`: passed on a permitted retry outside the sandbox; all 25 pages generated, including the new lesson. The initial sandboxed build compiled successfully but failed spawning a worker with `EPERM`; it also reported a Git ownership warning from Nextra.
- Extracted the complete server directly from the new Markdown into an isolated temporary practice folder. Compiled with the site's TypeScript compiler, strict NodeNext settings, and existing temporary Express 5.2.1 / Express 5 type dependencies. No Express dependency was added to the website.
- Passed 14 HTTP cases: welcome/about, default/filtered collection, detail with/without query, unknown route, valid POST, missing name/course, empty object/string, absent body, and the documented minimal handler's malformed-JSON behavior.
- Executed the handout's PowerShell `Set-Content -Encoding ascii` plus `curl.exe --data-binary "@student.json"` commands: observed the expected 201 and 400 statuses and bodies.
- Passed five middleware experiment cases using extracted snippets: A/B/C order, A/C after moving B, A/B for a later matching route, thrown demo error reaching 500, and a request timing out when the logger omits `next()`.
- Checked internal route targets, 17 numbered sections, balanced fences/disclosures, and sidebar source ordering. Generated HTML for all three lessons contains the expected heading, code blocks, tables, and disclosure elements. The new lesson has six disclosures and its pipeline diagram; the overview links to it. Each lesson has one H1 and no removed draft label.
- `git diff --check`: passed. Reviewed the diff for scope and preservation.

### Limits and next step

- Browser verification was attempted, but the computer-use runtime reported no available browser and `agent-browser` was not installed. Visual layout, mobile reflow, keyboard interaction, and browser console checks were not performed; generated HTML inspection is not a substitute for those checks.
- The sample deliberately echoes data without saving it. The requested 201 is explicitly described as a classroom creation-response rehearsal. Presence-only validation and a minimal error handler are identified as teaching limits, including the need to classify malformed JSON as 400 in a later complete implementation.
- Student exercise solutions and the fresh installation/watch-mode workflow were not separately tested. No database, authentication, CRUD system, Router/controller structure, advanced validation, or advanced error handling was introduced.
- Next: instructor review of 2.1.3 and browser checks when a browser is available. Lab 2.1 and cleanup of the old combined source are separate work; no Lab 2.1 or new 2.2 material was created.

## Completed

- Read the supplied 11-page syllabus; visually inspected page 6 to confirm the relationship between objectives, Chapter 2 topics, and Labs 2.1/2.2.
- Reviewed both drafts for the requested beginner-level explanations and syllabus alignment.
- Extracted the complete Lesson 2.1 server and all seven Lesson 2.2 TypeScript files directly from Markdown into temporary projects.
- Compiled both projects successfully with strict TypeScript, NodeNext modules, and Express 5 types.
- Started the emitted JavaScript servers and passed 23 local HTTP cases covering collection/detail reads, missing records, invalid IDs, filters, repeated/blank filters, unknown routes, JSON preview, malformed JSON, unsupported content type, and body size limit.
- Checked JSON responses, empty collection results, case-insensitive matching, and preview normalization/no-save behavior.
- The initial HTTP test ran before server readiness; increasing startup wait and rerunning completed successfully. This was a test harness timing issue.
- Authored and verified two foundational prerequisite handouts: `00a-first-nodejs-typescript.md` (Node, TypeScript, pnpm, PowerShell workflow, process control) and `00b-http-requests-responses.md` (Client-server model, request/response anatomy, status codes, query vs path params, curl.exe testing).
- Integrated prerequisite lessons into Nextra routes (`/web-systems/chapter-2/first-program`, `/web-systems/chapter-2/http-requests-responses`) and verified navigation hierarchy and sidebar order.

## Limits

- Only complete worked examples were executed, not student-authored activity solutions or discussion-only write endpoints.
- Verification used isolated temporary npm-installed dependencies, Node 24.18.0, and the TypeScript CLI. The app's package/lock files were not changed. The pnpm setup sequence and tsx watch mode were not independently exercised.
- The two labs are separate projects, with different ports, prefixes, fixture data, and validation conventions. Lesson 2.2 is not a byte-for-byte drop-in refactor of Lesson 2.1; students should preserve their own API contract when performing a true refactor.
- The Markdown handouts are rendered through student routes under `/web-systems/chapter-2`. Browser and build verification for that integration is recorded with the implementation commit; deployment remains separate.
- The proposed timing and rubric require instructor judgment; the syllabus schedule discrepancy remains flagged.
