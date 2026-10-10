# Chapter 3 instructor notes — first Saturday tutorial

**Draft for instructor review.** Allow approximately 90–120 minutes of self-paced student work while checking previous submissions.

Prerequisites: Chapter 2 Student Information API with `server.ts`, `studentRoutes.ts`, and `studentController.ts`; Node.js, pnpm, Postman, a Supabase account, and prior database concepts. This is students' **first backend-to-database connection**. Check privately that they know their database password; do not collect it.

Expected end state: a Supabase `students` table with at least five fictional rows; `src/db.ts` using `pg`; `GET /students` returning rows; `GET /students/:id` returning one row or 404. Existing POST/PUT/DELETE handlers remain acknowledgement-only.

Quick checkpoints: SQL Editor shows five rows; terminal prints the safe connection-success line; Postman collection GET returns an array; existing ID returns one object; unused ID returns 404. Ask students to explain how the request travels through server, router, controller, database, and back.

Likely blockers: project still provisioning, wrong database password, copied URL from the wrong project, special characters in the URL password, IPv4-only network using a direct IPv6 address, missing dotenv import, wrong `.env` location, or server not restarted. The tutorial uses Supabase's Session pooler and `sslmode=require`; review the current dashboard wording and classroom network before class. Inspect screenshots for accidentally exposed credentials.

Next sequence: database-backed POST, then PUT/PATCH, then DELETE, leading to a complete CRUD API. Backend deployment to Render comes later, before React; React will consume the deployed Express API. The broader course target is a basic deployed full-stack application by December. None of these future steps are taught as completed in this lesson.

## Lesson 3.2 — Creating Student Records with POST and PostgreSQL

**Instructor-review draft for October 10, 2026.** Allow 90–120 minutes of self-paced work. Use the working Chapter 3.1 Student Information API and its existing `public.students` table; students should not recreate the table or expose `.env`.

Expected end state: `POST /students` reads JSON through `express.json()`, validates required text and `year_level`, inserts with `$1`–`$5` through the existing `pg` pool, and returns the generated row with 201. A duplicate `student_number` returns 409; malformed input returns 400; unexpected database failure returns a safe 500. Both Chapter 3.1 GET handlers still work. PUT/PATCH and DELETE remain outside this lesson.

Quick checkpoints: GET works before editing; Postman shows 201 with a generated ID; GET finds the new fictional row after Express restarts; missing field and invalid year return 400; repeating the same student number returns 409. Lab 3.2 has a 100-point rubric and asks for source, Postman evidence, persistence evidence, and written explanations. Check screenshots and repositories for credentials before reviewing submissions.

Before class, confirm students have the Chapter 3.1 project and database access, and rehearse the POST flow in an isolated practice project. Chapter 3.1's table does not define a maximum `year_level`, so the guided handler checks for a positive whole number. Lab 3.2 independently asks students to restrict values to 1–4 and test both boundaries; this is an application validation rule, not a database constraint. Check the exact router/controller names against the classroom project. Only fictional student data should be used. Instructor review is required before publication.

Next sequence after review: database-backed PUT/PATCH, then DELETE. Original Chapter 2 handout sources remain unresolved.
