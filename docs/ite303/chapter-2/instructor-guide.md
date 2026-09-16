# Instructor guide: Chapter 2

**Draft for Alden Derf's review.** Suggested teaching choices and rubrics below are proposals. They do not replace the approved syllabus or grading policy.

## 1. Objective alignment

The syllabus's relevant knowledge outcome concerns describing HTTP request/response processing and REST constraints. Its skills outcome concerns building services through Express routers and controllers (page 3).

The detailed learning plan (page 6) connects those outcomes to the following work:

| Syllabus intent, paraphrased | Teaching evidence | Student evidence |
|---|---|---|
| Operate a Node server and handle HTTP parameters | Lesson 2.1 startup/request diagrams and typed code-along | Run server; identify method, params, query, headers, body |
| Design REST pathways with separated responsibilities | Lesson 2.2 constraints, endpoint design, and modular example | Explain route design; split router/controller |
| Lab 2.1: typed Express server with dynamic routing | Lesson 2.1 activities endpoint task | Correct 200/400/404 responses and lifecycle trace |
| Lab 2.2: separate routes from handler business controllers | Lesson 2.2 refactoring exercise | Distinct route and controller modules with unchanged endpoint behavior |

The neighboring database outcome on page 6 belongs to Chapter 3. It is a future connection, not a requirement to provision a database before this Chapter 2 lab works.

## 1.1 Prerequisite instructional scaffolding

Students arrive with varied familiarity with CLI tools and web protocols. Two scaffold lessons precede Lesson 2.1:

- **[Prerequisite 1: Running Your First Node.js + TypeScript Program](00a-first-nodejs-typescript.mdx):** Covers Node vs TS runtime roles, Windows PowerShell CLI navigation, `pnpm init`, `devDependencies`, `tsconfig.json`, `tsx`, and process termination (`Ctrl+C`). Assign this as a diagnostic reading or pre-lab preparation.
- **[Prerequisite 2: Understanding HTTP Requests & Responses](00b-http-requests-responses.mdx):** Covers client-server exchanges, request anatomy (methods, path vs query params, headers, JSON body), response anatomy (status codes 200/201/400/404/500, headers, body), and `curl.exe` inspection.

If laboratory diagnostics show students struggling with basic terminal execution or the mental model of HTTP, spend the first 20 minutes of the laboratory period checking Prerequisite 1 outputs (`hello-ts`) before starting the Express server code-along.

## 2. Proposed two-hour lecture

| Minutes | Focus | Check for understanding |
|---|---|---|
| 0-10 | Foundation recap and tourism desk analogy | Student identifies client, server, request, response |
| 10-30 | Startup versus request lifecycle | Predict when callbacks execute |
| 30-50 | Typed Express demonstration | Trace `/destinations/1` and an invalid ID |
| 50-60 | Pair discussion and short pause | Explain params/query/body without reading definitions |
| 60-85 | REST constraints and endpoint contract | Explain statelessness and one architectural tradeoff |
| 85-105 | Route/controller separation | Place a responsibility in the correct module |
| 105-120 | Guided design exercise and exit ticket | Design one route, choose statuses, explain validation |

Teach the full constraint names, but use the concrete example first. Save detailed implementation of caching and distributed systems for subsequent discussion. The handouts contain more detail than should be read aloud in two hours.

## 3. Proposed three-hour laboratory

| Minutes | Work |
|---|---|
| 0-20 | Verify tools and establish the first `/health` response |
| 20-65 | Lesson 2.1 code-along and request tests |
| 65-95 | Independent activities route and lifecycle trace |
| 95-105 | Break/checkpoint |
| 105-145 | Lesson 2.2 route/controller refactoring |
| 145-170 | Pair testing: successful, invalid, missing, and filtered cases |
| 170-180 | Demonstration, submission, and exit reflection |

If students are still struggling with functions and objects, complete Lab 2.1 first and continue Lab 2.2 in the following session. Do not disguise rushed copying as demonstrated understanding.

## 4. Questions to ask while live coding

- Before starting: which line starts listening, and which lines only register behavior?
- Before requesting an invalid ID: which part should reject it, and should lookup happen afterward?
- Before moving middleware: will TypeScript detect this ordering mistake?
- Before splitting files: what behavior must stay the same for the client?
- Before discussing REST: does returning JSON prove that all constraints are met?
- Before discussing scaling: can two processes safely share one process's mutable array?

Invite students to describe a request in Filipino or English first, then connect their explanation to the technical terms. Assess the reasoning as well as vocabulary.

## 5. Lesson 2.1 answer guide

1. A matching request triggers the callback; registration installs it for later use.
2. Node executes the program, Express organizes HTTP handling, and TypeScript checks source types.
3. `2` is the `id` path parameter; `language=en` is a query parameter.
4. Conversion can accept unsuitable forms or produce non-finite/unsafe values. Validate according to the endpoint's ID contract.
5. An empty filtered collection is a successful query; a missing detail resource cannot be represented as the requested individual item.
6. The request can hang because processing neither continues nor completes.
7. The parser must run before code that expects the parsed value.
8. It does not prove receipt, display, or reading by the client.
9. `async` does not move synchronous computation off the event loop.
10. The preview is processed but no destination is created or persisted.

## 6. Lesson 2.2 discussion checkpoints

Use these as concepts to listen for rather than a script students must memorize:

- Resource identity and its JSON representation are different concepts.
- The six REST constraints include optional code-on-demand; uniform interface has four parts, including hypermedia-driven transitions.
- Stateless communication does not prohibit stored resource data. The server must not depend on an implicit previous conversational request to understand the current one.
- Safe concerns requested read-only semantics. Idempotent concerns intended effect after repetition, not identical response bodies/statuses.
- A route selects a handler; a controller translates HTTP input/output; services hold domain decisions; repositories isolate data access. Folder names alone do not enforce this separation.
- A single-process array is convenient for teaching but does not provide durable or shared storage.
- Cache policy must consider user-specific data and staleness. A server-side cache is not permission to expose protected material.
- A noun-based JSON API is a useful starting point, but it is not automatically a full implementation of REST.

## 7. Proposed assessment rubric

Apply this only if adopted by the instructor. It does not change the syllabus's course-level assessment weights.

| Criterion | Points | Full-credit evidence |
|---|---:|---|
| Working typed server and dynamic routes | 25 | Starts; route parameters select the intended resource; typecheck succeeds |
| Correct validation and HTTP responses | 20 | Successful, invalid, and missing cases behave as documented |
| Request lifecycle explanation | 20 | Correct ordered flow; explains middleware and early return |
| Separation of responsibilities | 20 | Route/controller modules have clear jobs and maintain behavior |
| REST reasoning | 10 | Explains constraints and a meaningful design tradeoff |
| Reproducible submission | 5 | Source, lockfile, commands, and test evidence; no secrets/dependency folders |
| Total | 100 | |

Partial credit should reflect demonstrated understanding. A working screenshot without explainable code is insufficient for full marks.

## 8. Suggested exit ticket

Give students a scenario: a client requests `/activities/abc`, and the server returns 500. Ask them to identify the desired response, where to validate the input, and which file should choose the HTTP status after refactoring.

Expected reasoning: the ID is invalid under the chosen positive-integer contract, so return 400; validate at the request boundary; the controller maps the validation outcome to the response. This is a client-input case, not an unexpected server failure.

## 9. Review and publication checklist

- Confirm Chapter 2 timing because pages 4 and 6 of the syllabus differ.
- Review new explanations and proposed exercises for the actual class's readiness.
- Confirm the proposed assessment rubric before assigning it.
- Keep the original Foundation content intact; this pack does not correct or replace it.
- Publish student handouts only after instructor review. Keep this answer guide outside student-accessible routes.
- App rendering, navigation integration, and deployment remain separate tasks from drafting these Markdown files.

Source: [ITE 303 syllabus](https://drive.google.com/file/d/1-jFsGFdF_bAU4AfNKdQhPCUv6xyErar8/view), pages 2-6, revision notation dated August 4, 2026.
