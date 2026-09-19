# ITM 402 Module 2 implementation review

## Outcome and provenance

Replaced instructor-rejected System Administration samples with the approved Module 2 structure. The course overview lists all five approved syllabus titles, with Modules 1 and 3–5 clearly unavailable and no fabricated lessons. The active teaching sequence is 2.1, Lab 2.1, 2.2, and 2.3.

Every new teaching page is labeled **Draft for instructor review**. The instructor supplied the syllabus titles, topics, and lab requirements; original ITM 402 handouts were not supplied. Explanations, exercises, diagrams, and configurations are newly authored. Primary technical references are linked in each lesson.

Shared layouts, components, styles, dependencies, and all Web Systems source files are unchanged. Course visibility was reopened for local draft review through the existing flag and root metadata. This also restores the existing homepage card and Web Systems course-switch link. This is a visibility setting, not access control or a production publication.

## Assumptions and review decisions

- Windows host, VirtualBox 7.x, Ubuntu Server 24.04 LTS with a local VM console and sudo access.
- Separate NAT adapter for downloads and Host-Only adapter for lab traffic. No Host-Only gateway is advertised.
- Example subnet `192.168.56.0/24`, host `.1`, server `.10`, DHCP pool `.100`–`.150`, and reservation `.20`. Students must check overlap, uniqueness, and actual interface names.
- ISC DHCP is retained as a legacy syllabus demonstration. It is end-of-life and unsupported on Ubuntu 24.04; the instructor must approve the isolated image/package or use the configuration-reading exercise. Kea migration is not silently substituted into the syllabus.
- DNS uses private `lab.test` forward and reverse zones, explicit-server queries, and authoritative-only BIND. General recursive DNS and operating-system resolver integration are outside this introductory demonstration.
- Existing Netplan file ownership and cloud-init generation require inspection before editing. Backup, validation, local-console recovery, and reboot verification are included.

## Verification performed

- `pnpm lint`: passed.
- `pnpm exec tsc --noEmit`: passed; the production build also completed type validation.
- `pnpm build`: passed after rerunning with worker permissions. The sandboxed attempt compiled successfully but failed spawning a worker (`EPERM`). No dependency or build configuration workaround was added.
- `pnpm exec eslint scripts/verify-course-availability.mjs`: passed after adapting the existing check to the reopened course.
- `node scripts/verify-course-availability.mjs http://127.0.0.1:3100`: passed against the production server. Five removed routes returned 404; 15 available routes returned 200, including all six System Admin pages, the homepage, and eight Web Systems pages. Checks assert course links, no links to removed pages, draft notices, and all four System Admin lesson links in the rendered sidebar.
- `git diff --check`: passed (Git emitted only CRLF normalization notices).
- `git diff --exit-code -- app/web-systems`: passed with no changes.
- The installed `node_modules/next/dist/docs/` guide was absent. Consulted the official Next.js 15 layouts/pages documentation; no new framework APIs or upgrades were introduced.

## Unverified acceptance criteria

Browser verification is blocked in this environment: `agent-browser` is not installed, and browser-control discovery and browser selection reported no browser available. HTTP/server-rendered checks do **not** establish mobile menu behavior, keyboard focus, 320 px reflow, zoom, light/dark appearance, or absence of browser console errors. These remain required before classroom publication.

Networking commands are lesson data and were not run on the development computer. No Windows/VirtualBox/Ubuntu classroom topology was available for an end-to-end VM rehearsal. Configuration syntax and procedures were reviewed against primary documentation, but runtime DHCP/DNS and host firewall behavior still require instructor verification.

## Complete file inventory

Created:

- `app/sys-admin/module-2/_meta.json`
- `app/sys-admin/module-2/page.mdx`
- `app/sys-admin/module-2/local-networking/page.mdx`
- `app/sys-admin/module-2/lab-2-1/page.mdx`
- `app/sys-admin/module-2/dynamic-ip-addressing/page.mdx`
- `app/sys-admin/module-2/name-resolution/page.mdx`
- `docs/itm402/module-2-review.md`

Modified:

- `app/sys-admin/_meta.json`
- `app/sys-admin/page.mdx`
- `app/_meta.json`
- `lib/course-availability.ts`
- `scripts/verify-course-availability.mjs`
- `docs/PLAN.md`

Deleted:

- `app/sys-admin/module-1-intro/page.mdx`
- `app/sys-admin/module-2-linux-basics/page.mdx`
- `app/sys-admin/module-3-users-permissions/page.mdx`
- `app/sys-admin/module-4-networking-services/page.mdx`
- `app/sys-admin/lab-1/page.mdx`

## Next step

Instructor reviews the drafts and confirms classroom versions, then rehearses Lab 2.1 and the DHCP/DNS demonstrations. Complete browser/mobile/keyboard checks before removing draft labels. No push, deployment, or merge is included in this task.

## Student-access activation follow-up

The instructor subsequently explicitly authorized student access. The existing enabled flag and visible root metadata already satisfy activation; the layout's conditional `notFound()` guard is preserved for future disabling. Updated the availability comment and plan to record this authorization. Draft labels remain a separate content-review status.

A production link crawl found an existing relative Chapter 2 URL on the Web Systems overview resolving to `/chapter-2` (404). Corrected only that URL in `app/web-systems/page.mdx` to `/web-systems/chapter-2`, preserving all teaching text. This is the only Web Systems change in the follow-up; the original Module 2 commit did not change that directory.

Rebuilt production output and checked the homepage card, course navigation, all direct Module 2 pages, and Web Systems routes. The Home → System Administration → Module 2 → lessons/lab chain and internal link destinations are checked through rendered HTML and HTTP responses. No browser is connected, so interactive browser/mobile verification remains pending. Nothing was pushed, deployed, or merged.

Results: production build (including lint/type validation) passed; all 20 route checks passed, and all 15 unique internal URL targets found across the homepage, six System Admin pages, and Web Systems overview responded successfully. An intermediate incremental build produced a runtime bundle error on removed routes; after stopping the test servers, clearing only generated `.next` output, and rebuilding, those routes correctly returned 404. No source workaround was needed.
