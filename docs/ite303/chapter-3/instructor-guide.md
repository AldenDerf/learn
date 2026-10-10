# Chapter 3 instructor notes — first Saturday tutorial

Allow approximately 90–120 minutes of self-paced student work while checking previous submissions. Each lesson is a guided tutorial with its activity and evidence integrated into the same workflow.

Prerequisites: Chapter 2 Student Information API with `server.ts`, `studentRoutes.ts`, and `studentController.ts`; Node.js, pnpm, Postman, a Supabase account, and prior database concepts. This is students' **first backend-to-database connection**. Check privately that they know their database password; do not collect it.

Expected end state: a Supabase `students` table with at least five fictional rows; `src/db.ts` using `pg`; `GET /students` returning rows; `GET /students/:id` returning one row or 404. Existing POST/PUT/DELETE handlers remain acknowledgement-only.

Quick checkpoints: SQL Editor shows five rows; terminal prints the safe connection-success line; Postman collection GET returns an array; existing ID returns one object; unused ID returns 404. Ask students to explain how the request travels through server, router, controller, database, and back.

### 3.1 grading guide (100 points)

| Criterion | Points |
| --- | ---: |
| Table and at least five fictional rows | 15 |
| Database connection | 20 |
| `GET /students` reads real rows | 20 |
| `GET /students/:id` and 404 | 20 |
| Supabase and Postman evidence | 10 |
| Request-flow explanation | 10 |
| Reflection and complete safe submission | 5 |
| **Total** | **100** |

Likely blockers: project still provisioning, wrong database password, copied URL from the wrong project, special characters in the URL password, IPv4-only network using a direct IPv6 address, missing dotenv import, wrong `.env` location, or server not restarted. The tutorial uses Supabase's Session pooler and `sslmode=require`; review the current dashboard wording and classroom network before class. Inspect screenshots for accidentally exposed credentials.

Next sequence: database-backed POST, then PUT/PATCH, then DELETE, leading to a complete CRUD API. Backend deployment to Render comes later, before React; React will consume the deployed Express API. The broader course target is a basic deployed full-stack application by December. None of these future steps are taught as completed in this lesson.

## Lesson 3.2 — Creating Student Records with POST and PostgreSQL

**October 10, 2026.** Allow 90–120 minutes of self-paced work. Use the working Chapter 3.1 Student Information API and its existing `public.students` table; students should not recreate the table or expose `.env`.

Expected end state: `POST /students` reads JSON through `express.json()`, validates required text and `year_level`, inserts with `$1`–`$5` through the existing `pg` pool, and returns the generated row with 201. A duplicate `student_number` returns 409; malformed input returns 400; unexpected database failure returns a safe 500. Both Chapter 3.1 GET handlers still work. PUT/PATCH and DELETE remain outside this lesson.

Quick checkpoints: GET works before editing; Postman shows 201 with a generated ID; GET finds the new fictional row after Express restarts; missing field and invalid year return 400; repeating the same student number returns 409. The tutorial asks for source, Postman evidence, Supabase persistence evidence, and written explanations. Check screenshots and repositories for credentials before reviewing submissions.

### 3.2 grading guide (100 points)

| Criterion | Points |
| --- | ---: |
| Existing GET endpoints remain working | 15 |
| Parameterized POST INSERT and generated ID | 25 |
| Required-field validation and year-level range (1–4) | 15 |
| Duplicate handling (409) and safe server error (500) | 15 |
| Postman and Supabase persistence evidence | 20 |
| Request-flow explanation, reflection, and challenge reasoning | 10 |
| **Total** | **100** |

Before class, confirm students have the Chapter 3.1 project and database access, and rehearse the POST flow in an isolated practice project. Chapter 3.1's table does not define a maximum `year_level`, so the guided handler checks for a positive whole number. The integrated challenge asks students to restrict values to 1–4 and test both boundaries; this is an application validation rule, not a database constraint. Check the exact router/controller names against the classroom project. Only fictional student data should be used.

Next sequence after review: database-backed PUT/PATCH, then DELETE. Original Chapter 2 handout sources remain unresolved.
