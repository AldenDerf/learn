# Draft verification notes

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
