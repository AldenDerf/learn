# Chapter 2 teaching pack

**ITE 303: Web Systems and Technologies 2**

**Chapter: Scalable REST API Architecture with Express.js**

**Status: The approved Chapter 2.1 sequence is finalized for classroom use in the local application.**

## Read in order

1. [P.1 First Node.js & TypeScript](00a-first-nodejs-typescript.mdx)
2. [P.2 HTTP Requests & Responses](00b-http-requests-responses.mdx)
3. [2.1.1 Your First Express Server](01a-first-express-server.mdx)
4. [2.1.2 Understanding the Request/Response Lifecycle](01b-request-response-lifecycle.mdx)
5. [2.1.3 Middleware & Building a Complete Express Server](01c-middleware-complete-server.mdx)
6. [Lab 2.1 Basic Typed Express Server with Dynamic Routing](lab-2-1.mdx)

These six canonical `.mdx` files are imported by thin `page.mdx` wrappers under `app/web-systems/chapter-2`. Edit the canonical file, not a duplicate in the route. The existing Nextra configuration and public URLs are unchanged.

## Educational callouts

Canonical MDX uses Nextra 4.6.1's `Callout`, registered globally in `mdx-components.tsx`; no per-lesson import is needed.

```mdx
<Callout type="important">

Keep the instructional text and Markdown formatting here.

</Callout>
```

Use `important` for important instructions, `warning` for warnings/cautions, `info` for notes, and `default` for tips. Keep ordinary quotations as Markdown blockquotes. Use explicit callouts instead of `> [!IMPORTANT]`-style markers in canonical lessons.

## Supporting references

- [Legacy combined 2.1 handout](01-server-lifecycle.md): preserved for reference and hidden from normal student navigation.
- [Existing 2.2 handout](02-rest-constraints.md): outside this finalization; only prerequisite link targets were maintained after the migration.
- [Instructor guide and alignment](instructor-guide.md)
- [Verification notes](verification.md)

These are newly authored lessons, not recovered original handouts. The existing Foundation handouts remain unchanged. Examples use a separate Express laboratory project, not the Next.js learning platform.

## Syllabus source

[Instructor-provided syllabus](https://drive.google.com/file/d/1-jFsGFdF_bAU4AfNKdQhPCUv6xyErar8/view), revision notation dated August 4, 2026.

- Page 3: lifecycle and REST knowledge outcome; Express router/controller skill outcome.
- Page 6: Chapter 2 topics, intended outcomes, and Labs 2.1/2.2. The table was checked visually as well as extracted as text.
- Page 2: two lecture hours and three laboratory hours per week.

The overview on page 4 places Chapter 2 in Weeks 4-6; the detailed learning plan on page 6 places it alongside Chapter 3 in Weeks 7-8. This pack follows the Chapter 2 objectives without resolving that scheduling discrepancy on the instructor's behalf.

## Scope

The required practical work is a typed dynamic Express route and separation of routes from handlers/controllers. Services and repositories are explained as a growth path. PostgreSQL provisioning belongs to Chapter 3; Prisma belongs to Chapter 4; full authentication belongs to Chapter 5.

The materials support reading before/after class. The instructor guide's broader Chapter 2 timing and rubric remain proposals, not additional syllabus requirements. Use the approved Lab 2.1 handout for its specific submission requirements and rubric.
