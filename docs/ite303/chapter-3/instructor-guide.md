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

Course sequence after 3.1: database-backed POST in 3.2, then PUT and DELETE in 3.3, leading to a complete CRUD API. Backend deployment to Render comes after Chapter 3.4 integration and testing, before React; React will consume the deployed Express API. The broader course target is a basic deployed full-stack application by December. None of these later steps are taught as completed in 3.1.

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

Next sequence: Chapter 3.4 verifies complete CRUD integration as a readiness checkpoint and guides students through Git, GitHub Desktop, `.gitignore`, and publishing their existing Student Information API to GitHub; October 31 Chapter 4 Render backend deployment; November React fundamentals and React/Express integration; December Vercel frontend deployment, integration testing, and final full-stack project. Open classroom question: confirm whether the optional 1–4 rule should be required across POST and PUT. Original Chapter 2 handout sources remain unresolved.

## Lesson 3.4 — Introduction to Git, GitHub, and Preparing Your Student API for Deployment

**One instructor-review tutorial for a two-session week (Wednesday 2 hours + Saturday 3 hours).** The student-facing tutorial avoids rigid weekday labels so students can also use it for self-paced or offline review. Students must continue with their existing Chapter 3.3 **Student Information API** practice project and must not create a new Express application or work inside the `learn` website repository.

### Suggested classroom schedule and time allocation

**Wednesday session — 2 hours (120 minutes):**
- **20 min — Review of existing CRUD functionality:** Run `pnpm dev` and verify `GET`, `POST`, `PUT`, and `DELETE` in Postman against Supabase (`Part 3, Steps 1–3`). Capture Screenshot 1 when ready.
- **30 min — Git and GitHub concepts (`Part 1`):** Discuss version control using the school-project analogy, compare Git vs. GitHub, and review core vocabulary (`repository`, `local repository`, `remote repository`, `commit`, `push`, `pull`, `branch`, `main`).
- **35 min — Git installation and GitHub account check (`Part 2, Steps 1–3`):** Install Git for Windows, verify `git --version`, and ensure every student can sign into GitHub with a verified email address.
- **25 min — GitHub Desktop setup (`Part 2, Steps 4–6`):** Install GitHub Desktop, authorize GitHub.com, check Git author Name/Email, and confirm the local Student API folder path.
- **10 min — Initial repository preparation / first commit (if time permits):** Add the existing local project in GitHub Desktop or preview the Saturday preparation checklist.

**Saturday session — 3 hours (180 minutes):**
- **35 min — Preparing the Student API and security checks (`Part 3, Steps 4–10`):** Inspect project structure and `package.json`, create/verify `.gitignore` (excluding `.env` and `node_modules/`), create `.env.example` with safe placeholders only, and write `README.md`. Emphasize that `.gitignore` does not erase secrets already committed to Git history; if a student already committed `.env` or a real password, stop before publishing, rotate the Supabase password immediately, and help them initialize a clean state without teaching history-rewriting workarounds.
- **45 min — GitHub Desktop practice and initial commit (`Part 4, Steps 1–6`):** Add/initialize the existing Student API folder in GitHub Desktop, inspect changed files, verify `.env` and `node_modules/` are absent, write a meaningful first commit message, and capture Screenshot 2. (All steps up to here work offline.)
- **30 min — Publishing the repository (`Part 4, Steps 7–9`):** Publish to GitHub (private by default unless public is explicitly authorized), open the repository in the browser, verify uploaded files, and capture Screenshot 3. Share the instructor's GitHub username in class so students with private repositories can grant collaborator access under **Settings → Collaborators**.
- **35 min — Making a second commit and pushing (`Part 5`):** Add the API Endpoints table to `README.md`, inspect the diff in GitHub Desktop, commit locally (capture Screenshot 4), push to GitHub, verify the online update (capture Screenshot 5), and review how GitHub connects to Chapter 4 Render deployment (`Part 6`).
- **35 min — Activity completion and Google Classroom submission (`Part 7`):** Answer the three reflection questions, verify collaborator access for private repositories, check all five screenshots for zero exposed credentials, and turn in the Google Classroom assignment.

### 3.4 grading guide (100 points)

| Criterion | Points |
| --- | ---: |
| Existing CRUD project prepared and checked | 20 |
| Git and GitHub setup | 15 |
| Repository published correctly | 20 |
| Two meaningful commits | 15 |
| Security and `.gitignore` | 15 |
| Evidence and reflection | 15 |
| **Total** | **100** |

Next sequence: Chapter 4 Render deployment of the Express Student API. Do not collect students' real database passwords or `.env` files.
