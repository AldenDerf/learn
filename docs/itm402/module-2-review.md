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

## Beginner-reading revision — current uncommitted review

### Outcome

Reviewed and reorganized the existing Module 2 content; no educational routes were deleted or added. Students now encounter the problem and a simple explanation before commands. The Windows/Ubuntu address example, two-adapter topology, DHCP scope, and DNS records remain consistent across the module.

- **2.1:** begins with network, host/guest, house-address and neighborhood examples. Interface inspection explains `ip`, `addr`, `inet`, why the command is needed, and how to read the result. Netplan explains YAML/indentation before the two-interface configuration. `/24` calculations, `/25`, bit counts, network/broadcast addresses, and protocol notes follow the main path.
- **Lab 2.1:** the goal is immediate, followed by a linked nine-step outline. Each step has what/why/action/expected-result/failure guidance. Backup and validation remain mandatory at the point of editing; route diagnostics, focused firewall advice, recovery, optional `netplan try`, and generated-file notes are separate sections. The example existing filename is now `00-installer-config.yaml`, explicitly to be replaced by the discovered filename; the `50-cloud-init.yaml` caveat remains in instructor notes.
- **2.2:** begins with many computers needing addresses, a registration-desk analogy, client/server roles, and one-sentence DORA steps. Guided client practice precedes deeper renewal/port details. The complete existing ISC DHCP setup is retained in an expandable instructor walkthrough, including its legacy status, reservations, validation, logs, and cleanup.
- **2.3:** begins with people remembering names and computers using addresses. Forward/reverse examples precede zones and records. Small `nslookup`/`dig` exercises use an explicitly instructor-prepared server. The complete existing BIND9 configuration is retained in an expandable walkthrough; cache lifetimes, server roles, reverse naming, logs, and recovery remain explained.

No detailed future-module lessons, new components, dependencies, shared styling changes, or Web Systems modifications were introduced. All lesson draft notices remain because the instructor requested review before continuing.

### Navigation correction

Installed Nextra's `dist/server/page-map/find-meta-and-page-file-paths.js` discovers `_meta.{js,jsx,ts,tsx}`; JSON metadata was not being read. Converted only the two System Admin metadata files to TypeScript, following the existing Web Systems convention. Root metadata and the availability flag remain unchanged and enabled.

Final hierarchy:

```text
System Admin Home
Module 2: Networking & Services
  Module 2 Overview
  2.1 Local Networking
  Lab 2.1: Static IP
  2.2 DHCP
  2.3 DNS
```

The module group is collapsible through the existing theme. The overview is its normal index page, not a duplicate lesson. Full syllabus-aligned titles remain in page H1s. Previous/Next follows Home → Overview → 2.1 → Lab 2.1 → 2.2 → 2.3.

System Admin's project, feedback, and source links now use `AldenDerf/learn`. Source links point at `tree/system-admin-module-02` so they refer to this branch. This does not publish the uncommitted revision.

### File inventory for this revision only

Modified:

- `app/sys-admin/layout.tsx`
- `app/sys-admin/page.mdx`
- `app/sys-admin/module-2/page.mdx`
- `app/sys-admin/module-2/local-networking/page.mdx`
- `app/sys-admin/module-2/lab-2-1/page.mdx`
- `app/sys-admin/module-2/dynamic-ip-addressing/page.mdx`
- `app/sys-admin/module-2/name-resolution/page.mdx`
- `scripts/verify-course-availability.mjs`
- `docs/PLAN.md`
- `docs/itm402/module-2-review.md`

Created:

- `app/sys-admin/_meta.ts`
- `app/sys-admin/module-2/_meta.ts`

Deleted (replaced by the TypeScript metadata above):

- `app/sys-admin/_meta.json`
- `app/sys-admin/module-2/_meta.json`

### Verification and limits

- Started with a clean working tree on `system-admin-module-02`; all revision changes are intentionally unstaged and uncommitted.
- `pnpm lint`, `pnpm exec tsc --noEmit`, and `pnpm build`: passed. Used a clean generated `.next` directory and worker permissions, with no dependency or configuration workaround. Next.js 15 documentation was consulted because the installed documentation directory is absent.
- Extended the existing `scripts/verify-course-availability.mjs` regression check to assert actual rendered order, labels, one active-page style, Previous/Next destinations, repository owner, and local fragment targets. It checks both `nextra-sidebar` and `nextra-mobile-nav` markup; it is not an interactive browser test.
- Production check at `http://127.0.0.1:3108`: 20 route checks passed (15 available pages and five removed sample routes returning 404). Lesson 2.1 and Lab 2.1 had draft notices removed for classroom use today; the homepage and eight Web Systems routes remained available. All 118 distinct internal route/fragment targets linked from System Admin resolved (including refined Lab 2.1 step anchors). No duplicate, old, or empty lesson entry appeared in the asserted course navigation.
- Web Systems has no diff from the start of this revision. The availability flag stays `true`, root metadata has no `sys-admin` hidden setting, and the layout's conditional `notFound()` mechanism is preserved.
- Browser discovery again returned no available apps/browsers. Desktop/mobile click behavior, focus, menu toggling, code overflow, responsive layout, zoom, theme appearance, and browser console errors are **not verified**. Rendered active CSS and mobile navigation markup are not substitutes for those checks.
- Classroom Windows/VirtualBox/Ubuntu exercises were not executed. Commands remain lesson data; the instructor must confirm versions, filename/interface mapping, addresses, and the legacy ISC DHCP image before classroom use.

Next: instructor content review, followed by browser/mobile and VM rehearsal. No commit, push, deployment, or merge is permitted for this revision until the instructor gives further instructions.
