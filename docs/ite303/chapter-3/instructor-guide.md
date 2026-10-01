# Chapter 3 instructor notes — first Saturday tutorial

**Draft for instructor review.** Allow approximately 90–120 minutes of self-paced student work while checking previous submissions.

Prerequisites: Chapter 2 Student Information API with `server.ts`, `studentRoutes.ts`, and `studentController.ts`; Node.js, pnpm, Postman, a Supabase account, and prior database concepts. This is students' **first backend-to-database connection**. Check privately that they know their database password; do not collect it.

Expected end state: a Supabase `students` table with at least five fictional rows; `src/db.ts` using `pg`; `GET /students` returning rows; `GET /students/:id` returning one row or 404. Existing POST/PUT/DELETE handlers remain acknowledgement-only.

Quick checkpoints: SQL Editor shows five rows; terminal prints the safe connection-success line; Postman collection GET returns an array; existing ID returns one object; unused ID returns 404. Ask students to explain how the request travels through server, router, controller, database, and back.

Likely blockers: project still provisioning, wrong database password, copied URL from the wrong project, special characters in the URL password, IPv4-only network using a direct IPv6 address, missing dotenv import, wrong `.env` location, or server not restarted. The tutorial uses Supabase's Session pooler and `sslmode=require`; review the current dashboard wording and classroom network before class. Inspect screenshots for accidentally exposed credentials.

Next sequence: database-backed POST, then PUT/PATCH, then DELETE, leading to a complete CRUD API. Backend deployment to Render comes later, before React; React will consume the deployed Express API. The broader course target is a basic deployed full-stack application by December. None of these future steps are taught as completed in this lesson.
