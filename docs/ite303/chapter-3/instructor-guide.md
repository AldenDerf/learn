# Chapter 3 instructor notes

## Lesson 3.1 — First Saturday tutorial

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

Course sequence after 3.1: database-backed POST in 3.2, then PUT and DELETE in 3.3, leading to a complete CRUD API. GitHub publishing and backend deployment to Render follow in Activity 3.4, before React; React will consume the deployed Express API. The broader course target is a basic deployed full-stack application by December. None of these later steps are taught as completed in 3.1.

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

Next sequence after review: database-backed PUT and DELETE in Lesson 3.3. Original Chapter 2 handout sources remain unresolved.

## Lesson 3.3 — Updating and Deleting Student Records

**One instructor-review tutorial for October 14 and 17, 2026.** Use its CRUD recap, SQL examples, PUT/DELETE request flow, and quick questions for Wednesday's two-hour discussion: 20 minutes CRUD, 25 SQL `UPDATE`/`DELETE`/`WHERE`/`RETURNING`, 35 PUT, 20 DELETE, and 20 knowledge check. Use the same tutorial's guided coding and tests for Saturday's three-hour lab: 15 minutes project review, 70 PUT, 45 DELETE, 30 Postman and Supabase verification, and 20 reflection and Google Classroom submission. Both sessions use the same Chapter 3.2 practice API and Supabase `public.students` table. No schema change, new project, PATCH requirement, or deployment is involved.

The guided PUT handler replaces all five editable fields, checks a positive integer ID and complete JSON body, and uses `UPDATE ... WHERE id = $6 RETURNING ...` through the existing pool. It matches the guided 3.2 positive-whole-number year rule. If students completed the optional 1–4 challenge, ask them to mirror that upper bound in PUT. DELETE validates the URL ID, uses `DELETE ... WHERE id = $1 RETURNING ...`, and sends 200 confirmation. Both keep GET and POST intact. Rehearse exact router/controller names against the classroom project before class.

Checkpoints: working GET and POST before editing; 200 PUT with the same ID; GET and a read-only Supabase SELECT show new values after restart; 200 DELETE for a disposable fictional row; GET and SELECT confirm it is absent; 400 for malformed input; 404 for unused positive IDs; 409 for a number held by a *different* row. Review safe 500 branches in code; do not require disruption of a shared database. Five Postman screenshots are required, plus source and reflection through the assigned Google Classroom activity. Check all screenshots and submissions for credentials and real student data.

### 3.3 grading guide (100 points)

| Criterion | Points |
| --- | ---: |
| PUT implementation and PostgreSQL `UPDATE` | 25 |
| DELETE implementation and PostgreSQL `DELETE` | 20 |
| Input validation and error handling | 15 |
| Postman testing and five required screenshots | 25 |
| Reflection and code understanding | 10 |
| Complete and organized submission | 5 |
| **Total** | **100** |

Next sequence: Activity 3.4 verifies complete CRUD integration as a readiness checkpoint, guides students through Git, GitHub Desktop, `.gitignore`, and publishing their existing Student API to GitHub, and completes cloud deployment to Render with live Postman verification and AI-assisted troubleshooting; November React fundamentals and React/Express integration; December Vercel frontend deployment, integration testing, and final full-stack project. Open classroom question: confirm whether the optional 1–4 rule should be required across POST and PUT. Original Chapter 2 handout sources remain unresolved.

## Lesson 3.4 — Deploying Your Student REST API Using GitHub and Render

**Finalized tutorial-as-activity for a two-session week (Wednesday 2 hours + Saturday 3 hours) or self-paced lab.** Students continue directly from their Activity 3.3 **Student Management REST API** (Student Information API practice project) and must not rebuild CRUD from scratch or work inside the `learn` website repository. Step-by-step screenshots are intentionally omitted so students practice reading documentation, navigating GitHub Desktop and Render interfaces, inspecting logs, and asking sanitized technical questions.

### Suggested classroom schedule and time allocation

**Wednesday session — 2 hours (120 minutes): Parts A, B, and C (Local Prep, Git, & GitHub)**
- **20 min — Deployment architecture (`Part A`):** Explain why `localhost` is only reachable on the student's own machine and clarify the distinct roles of Git, GitHub, GitHub Desktop, Render, Supabase, and Postman.
- **40 min — Preparing the existing Student API (`Part B`):** Verify local CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) in Postman, update `src/server.ts` to support `process.env.PORT`, verify `package.json` build/start scripts locally (`pnpm build` and `pnpm start`), configure `.gitignore` and `.env.example`, and update `README.md`. Emphasize credential security: if `.env` was ever committed previously, stop before pushing and rotate the Supabase database password immediately.
- **60 min — Git and GitHub Desktop (`Part C`):** Review Git vs. GitHub vocabulary (`repository`, `commit`, `push`, `pull`, `branch`), add/initialize the project in GitHub Desktop, inspect diffs to verify `.env` and `node_modules/` are excluded, create descriptive commits, publish to GitHub, and verify the remote repository contents in the browser. Share the instructor's GitHub username if students use private repositories so they can grant collaborator access under **Settings → Collaborators**.

**Saturday session — 3 hours (180 minutes): Parts D, E, F, and G (Render Deployment, Live Postman Testing, AI Troubleshooting, & Submission)**
- **50 min — Deploying to Render (`Part D`):** Create a Render Web Service connected to the student's GitHub repository (`main` branch, Node runtime), match Build and Start commands to the student's actual `package.json` setup, configure `DATABASE_URL` in Render's Environment Variables using the Supabase Session pooler URL (IPv4 compatible, `sslmode=require`), and read build and runtime logs until the service is **Live** on its public `https://...onrender.com` URL.
- **50 min — Live API testing with Postman (`Part E`):** Test all seven required cases against the deployed Render HTTPS URL using disposable fictional records (`GET /students` → `200`, `POST /students` → `201`, `GET /students/:id` → `200`, `PUT /students/:id` → `200`, `DELETE /students/:id` → Activity 3.3 expected success status, `GET` deleted record → `404`, invalid input → `400`). Ensure students do not delete baseline rows. Practice distinguishing Postman, Render, Express, and PostgreSQL error layers.
- **45 min — Responsible AI-assisted troubleshooting (`Part F`):** Walk through the 7-step troubleshooting loop (read original error → identify component → ask sanitized question → evaluate explanation → apply change carefully → retest → explain root cause). Enforce the strict rule against pasting passwords or real `DATABASE_URL` strings into AI tools.
- **35 min — Submission preparation (`Part G`):** Export the Postman collection JSON, complete the HTTP status-code test summary table, write the four reflection answers, verify repository collaborator access if private, and submit the GitHub URL, Render URL, Postman collection, test summary, and reflection in Google Classroom. (No tutorial screenshots are required.)

### 3.4 grading guide (100 points)

| Criterion | Points |
| --- | ---: |
| Git and GitHub repository setup | 20 |
| Render deployment configuration | 20 |
| Working deployed REST API | 25 |
| Live CRUD testing | 20 |
| Troubleshooting reflection and technical understanding | 15 |
| **Total** | **100** |

Next sequence: React fundamentals and frontend-to-backend integration consuming the deployed Render Student API. Do not collect students' real database passwords or `.env` files.
