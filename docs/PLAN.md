# Learn delivery plan

## Product direction

One instructor-managed platform for multiple subjects. Initial subjects:

- ITE 303 - Web Systems & Technologies 2 (current priority).
- ITM 402 - System Administration and Maintenance (preserve existing materials).

Future hierarchy: subject -> chapters -> lessons, with subject enrollment and per-student lesson progress.

## Immediate milestone: ITE 303 Chapter 2

The instructor needs Chapter 2 for the next class. Finish the teaching material and usable lesson navigation before expanding into the full learning management system.

- [x] Establish project agent instructions, UI/UX criteria, and per-update commit policy.
- [ ] Review and verify the existing local Next.js/Nextra baseline before committing it separately.
- [x] Establish instructor-authorized new drafts aligned to the supplied syllabus (pages 3 and 6).
- [ ] Inventory/import original Foundation handouts and images without rewriting them.
- [x] Prepare 2.1 Server Orchestration & Request/Response Lifecycle (instructor-review draft).
- [x] Prepare 2.2 REST Constraints & Architectural Concerns (instructor-review draft).
- [ ] Verify explanations, runnable examples, activities, and knowledge checks against learning objectives and primary technical sources.
- [ ] Add course/chapter navigation without removing existing subject material.
- [ ] Verify reading, code blocks, images, links, mobile/keyboard usability, and production build.
- [ ] Obtain content review for newly authored educational drafts before publishing; deploy only within authorized scope.

Keep existing full Foundation handouts intact. The application may use PostgreSQL later while the original teaching material retains its existing MySQL examples.

## Known baseline and content sources

- Local app: Next.js 15.3.9, Nextra 4.6.x, React 19.2.8, Tailwind 4, TypeScript strict, pnpm 11.25.0 in package.json at inspection.
- Local `app/web-systems` and `app/sys-admin` contain existing uncommitted work and sample course structure. They have not been accepted as the authoritative ITE 303/ITM 402 syllabus.
- No Git remote was listed during inspection. Do not guess a push destination.
- The installed `node_modules/next/dist/docs/` path was absent during initial inspection. Follow the documented fallback before framework changes.
- ITE 303 source: https://github.com/AldenDerf/ITE303-Docs at main commit `14374975ad2f1560fce5855ba5bd3102a5d7e642`.
- Confirmed original lessons: `docs/runnig-first-program/index.md` and `docs/http_requests/index.md`, plus two HTTP instructional images.
- Chapter 2.1 and 2.2 were absent from that inspected tree; their originals remain unresolved.
- The instructor subsequently authorized new drafts and provided the syllabus. Draft pack: `docs/ite303/chapter-2/README.md`. Sample projects compiled and 23 local HTTP cases passed; student exercise solutions, platform integration, and publication remain pending. See the pack's verification notes.
- Existing public site: https://ite-303-docs.aldenderf.com (availability was not verified in the initial review).

## Later milestones

1. Establish authentication, instructor/student roles, subject enrollment, PostgreSQL, and Prisma migrations.
2. Build subject/chapter/lesson management, revision history, Markdown editing, draft/publish, and real server-enforced locks.
3. Build student dashboards, persistent completion, and instructor progress views.
4. Add CI, end-to-end coverage, monitoring, and a verified production migration/rollback path.

Avoid hard-coding the platform to ITE 303, but defer infrastructure that does not help the next class.
