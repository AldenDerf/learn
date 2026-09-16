# 2.1 Server Orchestration & Request/Response Lifecycle

**ITE 303 - Web Systems and Technologies 2**

**Chapter 2: Scalable REST API Architecture with Express.js**

**Student handout**

## Learning targets

This lesson develops the syllabus outcome about operating a Node.js web server and handling HTTP request/response parameters. It prepares you for Lab 2.1: a typed Express server with dynamic routes.

By the end, you should be able to:

1. Explain the different jobs of Node.js, TypeScript, and Express.
2. Start a server and explain how a request reaches a handler.
3. Read a method, path parameter, query parameter, header, and JSON body.
4. Choose a response status and return JSON.
5. Trace middleware order, validation, successful responses, and errors.
6. Test a dynamic route and explain the result in your own words.

**Prerequisites:** Complete **[Prerequisite 1: Running Your First Node.js + TypeScript Program](/web-systems/chapter-2/first-program)** and **[Prerequisite 2: Understanding HTTP Requests & Responses](/web-systems/chapter-2/http-requests-responses)**. You should already understand `pnpm`, functions, objects, arrays, TypeScript interfaces, and the anatomy of HTTP requests and responses. Keep those handouts as references; this lesson builds directly on them.

## 1. Start with a familiar situation

Imagine a Batanes tourism information desk. A visitor asks, "Can you show me destination number 1?"

Someone receives the question, identifies what information is needed, finds the record, and returns an answer. If the destination does not exist, the desk should explain that clearly instead of silently ignoring the visitor.

A web server performs a similar sequence:

```text
Visitor's browser                     Tourism API
      |                                    |
      | GET /destinations/1                |
      |----------------------------------->|
      |                    identify route  |
      |                    validate ID     |
      |                    find record     |
      | 200 OK + destination JSON          |
      |<-----------------------------------|
```

The browser does not open your TypeScript source file. It sends an HTTP message to a running program. That program decides which code should handle the message.

**Pause and explain:** If the server program is stopped, will changing the URL make it return a destination? Why?

## 2. What does server orchestration mean here?

In this lesson, orchestration means arranging the parts of the server so requests are handled in a deliberate order: configuration, middleware, routes, validation, responses, and error handling. It does not mean you must learn Kubernetes or manage a cluster today.

Three tools have different responsibilities:

| Tool | Job | Classroom picture |
|---|---|---|
| TypeScript | Checks the types in your source during development/build | A reviewer checking your instructions |
| Node.js | Runs the JavaScript program outside the browser | The workplace where the server operates |
| Express | Provides routing and middleware on top of Node's HTTP facilities | The desk's system for directing requests |

Express does not replace Node. TypeScript does not automatically validate information from the internet. A visitor can send a body that does not match your interface, so runtime validation remains necessary.

In the earlier handout, you used `http.createServer()` and manually inspected `request.url`. Express organizes that work with statements such as `app.get('/destinations/:id', handler)`. A route matches a method and a path, then calls a handler. The part beginning with `:` is a named variable in the path. [Express routing](https://expressjs.com/en/guide/routing/)

## 3. Two lifecycles that beginners often mix up

### 3.1 Application startup

Startup happens when you run the server program:

```text
Run program
  -> create Express app
  -> register middleware
  -> register routes
  -> register fallback and error handlers
  -> listen on a port
  -> wait for requests
```

Registering a route is like adding an entry to a directory. The route's callback does not run merely because you registered it. It runs when a matching request arrives.

### 3.2 One request's journey

For a normal request that reaches this application:

```text
Client constructs request
  -> network connection carries it to the server
  -> HTTP message is parsed
  -> matching middleware runs in registration order
  -> route handler validates inputs and performs work
  -> response status, headers, and body are sent
  -> client processes the response
```

For a public HTTPS site, DNS lookup, connection establishment, TLS, a reverse proxy, or a cache can participate before Express receives anything. These steps are not repeated identically for every request: connections and DNS results can be reused. Our localhost exercise deliberately removes those extra layers.

Each HTTP request has its own request and response objects. Two students requesting the same URL still produce two requests. Sending a response does not normally shut down the whole application or necessarily close the underlying connection. [Node HTTP](https://nodejs.org/api/http.html)

## 4. Read the message before writing the code

Consider this teaching example:

```http
GET /destinations/1?include=summary HTTP/1.1
Host: localhost:4000
Accept: application/json
```

| Part | Value | Meaning |
|---|---|---|
| Method | `GET` | Retrieve information |
| Path | `/destinations/1` | Address one destination |
| Path parameter | `id = "1"` | Value captured by `/destinations/:id` |
| Query parameter | `include = "summary"` | Additional instruction about the representation |
| Header | `Accept: application/json` | Client's preferred response format |

The fragment in a browser URL, such as `#overview`, is not sent as part of the HTTP request target. Do not expect Express to receive it as a query parameter.

Now consider a creation request:

```http
POST /destinations HTTP/1.1
Host: localhost:4000
Content-Type: application/json

{"name":"Sample destination","municipality":"Basco"}
```

The body carries the proposed data. `Content-Type` describes the body being sent; `Accept` describes what the client would like to receive. They answer different questions. JSON is a representation format, not a database and not a transport protocol.

These examples show message structure rather than every header an actual client supplies. [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html)

## 5. Create a separate laboratory project

Do this in a new practice folder, **not inside the learning platform's source folder**. Use the Node.js and pnpm tools from your Foundation setup.

```powershell
mkdir ite303-chapter2-lab
cd ite303-chapter2-lab
pnpm init
pnpm add express@5
pnpm add -D typescript tsx @types/node @types/express@5
mkdir src
```

Keep the dependency entries generated by installation. Edit `package.json` to add the following top-level property and scripts:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

This JSON block is a **merge guide**, not a replacement for the full generated file. Preserve `dependencies` and `devDependencies`. Make sure commas separate neighboring properties.

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

`rootDir` identifies your source; `outDir` receives compiled JavaScript. `strict` turns on important checking. `NodeNext` coordinates module behavior with Node. `tsx` runs the development program, but running it is not a substitute for `pnpm typecheck`.

## 6. First, make the smallest working server

Create `src/server.ts`:

```typescript
import express from 'express';

const app = express();

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(4000, '127.0.0.1', () => {
  console.log('API listening at http://127.0.0.1:4000');
});
```

Run `pnpm dev`. In a second terminal:

```powershell
curl.exe -i http://127.0.0.1:4000/health
```

Look for status `200` and body `{"status":"ok"}`. Additional automatically generated headers are normal. Use `curl.exe` explicitly in Windows PowerShell so that you invoke curl rather than an older PowerShell alias.

The `_req` name communicates that the request parameter is intentionally unused. `res.status()` selects the HTTP status. `res.json()` serializes the value and sends a JSON response. `listen()` starts accepting connections; port 4000 is chosen to avoid the learning platform's common port 3000. Binding to `127.0.0.1` keeps this unauthenticated exercise local to your computer.

## 7. Expand it into a typed, observable API

Replace **only the lab's** `src/server.ts` with this complete version. This is original classroom example code. The data is a small teaching fixture, not a verified travel directory.

```typescript
import express from 'express';
import type { ErrorRequestHandler } from 'express';
import { randomUUID } from 'node:crypto';

interface Destination {
  id: number;
  name: string;
  municipality: string;
}

const destinations: Destination[] = [
  { id: 1, name: 'Basco Lighthouse', municipality: 'Basco' },
  { id: 2, name: 'Sample coastal viewpoint', municipality: 'Mahatao' },
];

const app = express();

// Observe every request that reaches this middleware.
app.use((req, res, next) => {
  const requestId = randomUUID();
  const startedAt = Date.now();
  res.setHeader('X-Request-Id', requestId);
  console.log(`[${requestId}] incoming ${req.method} ${req.path}`);
  res.on('finish', () => {
    console.log(`[${requestId}] status=${res.statusCode} ms=${Date.now() - startedAt}`);
  });
  next();
});

// Parse JSON before handlers that need req.body.
app.use(express.json({ limit: '10kb' }));

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/destinations', (req, res) => {
  const municipality = req.query.municipality;
  if (municipality !== undefined && typeof municipality !== 'string') {
    res.status(400).json({ error: 'municipality must be one text value' });
    return;
  }
  const data = municipality === undefined
    ? destinations
    : destinations.filter((item) =>
        item.municipality.toLowerCase() === municipality.toLowerCase());
  res.status(200).json({ data });
});

app.get('/destinations/:id', (req, res) => {
  const rawId = req.params.id;
  const id = Number(rawId);
  if (!/^\d+$/.test(rawId) || !Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ error: 'id must be a positive integer' });
    return;
  }
  const destination = destinations.find((item) => item.id === id);
  if (!destination) {
    res.status(404).json({ error: 'Destination not found' });
    return;
  }
  res.status(200).json({ data: destination });
});

// Preview validation only: this route does not save anything.
app.post('/destination-previews', (req, res) => {
  if (!req.is('application/json')) {
    res.status(415).json({ error: 'Send application/json' });
    return;
  }
  const body: unknown = req.body;
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    res.status(400).json({ error: 'Send a JSON object' });
    return;
  }
  const candidate = body as Record<string, unknown>;
  if (typeof candidate.name !== 'string' || !candidate.name.trim()
      || typeof candidate.municipality !== 'string'
      || !candidate.municipality.trim()) {
    res.status(400).json({ error: 'name and municipality must be non-empty text' });
    return;
  }
  res.status(200).json({
    preview: {
      name: candidate.name.trim(),
      municipality: candidate.municipality.trim(),
    },
    saved: false,
  });
});

// No earlier route completed this request.
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const handleError: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  const details = typeof error === 'object' && error !== null
    ? error as Record<string, unknown>
    : {};
  if (details.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Malformed JSON body' });
    return;
  }
  if (details.type === 'entity.too.large') {
    res.status(413).json({ error: 'JSON body exceeds the lab limit' });
    return;
  }
  console.error('Unexpected request failure');
  res.status(500).json({ error: 'Internal server error' });
};

app.use(handleError);

app.listen(4000, '127.0.0.1', () => {
  console.log('API listening at http://127.0.0.1:4000');
});
```

## 8. Understand the new pieces one at a time

### Middleware is a checkpoint

The logger runs before the routes because it was registered first. It gives the request an identifier so its incoming and outgoing log entries can be paired. With many requests, terminal lines may interleave; the ID helps you avoid joining the beginning of one request to the end of another.

An ordinary middleware normally either passes control onward with `next()` or ends the response. If it does neither, a request can remain unanswered. Calling `next()` is not equivalent to returning from a JavaScript function: code after it can still execute. Avoid continuing into another response after sending one. [Express middleware](https://expressjs.com/en/guide/using-middleware/)

### A response finishing is not proof that the student read it

The `finish` event means the response has been handed off by the server for transmission; it does not prove that the client displayed or consumed it. A disconnected client may also prevent normal completion. Our logger is a learning tool, not a complete delivery-monitoring system. [Node HTTP](https://nodejs.org/api/http.html)

### JSON parsing is not input validation

`express.json()` interprets a JSON body for matching content types. A syntactically valid JSON object can still be unsuitable: `{"name":123}` is valid JSON but fails our requirement for text. Starting with `unknown` forces us to inspect the external value before using it. The object assertion follows an object check; individual fields still require their own checks.

The preview endpoint returns `saved: false`. It deliberately avoids pretending that an array or a database was updated. It returns 200 because it processed a preview, not 201 for a newly saved destination.

### Dynamic does not mean unvalidated

For `/destinations/1`, the route parameter initially contains the text `"1"`. We validate its syntax and numeric range before finding the record. A TypeScript annotation cannot prevent someone from requesting `/destinations/banana`.

There are two different failure questions:

- Is `banana` an acceptable ID? No: **400**.
- Is `999` an acceptable ID that currently has no record? Yes: **404**.

For the collection, no matching municipality produces **200 with an empty array**. The collection query worked; it simply found nothing.

### Error middleware goes last

Malformed JSON is rejected before the route reads the body. Express directs that failure into an error handler. The four-parameter signature distinguishes error middleware. The handler checks known parser error types, uses controlled messages, and avoids exposing stack traces. In Express 5, rejected promises from returned async handlers are forwarded to error handling; failures in detached callbacks still require deliberate handling. [Express errors](https://expressjs.com/en/guide/error-handling/)

The final normal middleware is a 404 fallback, not an exception handler. A route that was never found is different from code that unexpectedly failed.

## 9. Trace three requests

### Successful detail request

```text
GET /destinations/1
  -> logger assigns ID
  -> JSON parser has no body to parse
  -> dynamic GET route matches
  -> "1" passes validation
  -> record 1 exists
  -> 200 with destination
  -> completion log
```

### Invalid detail request

```text
GET /destinations/banana
  -> logger
  -> dynamic GET route matches
  -> ID validation fails
  -> 400 with explanation
  -> return prevents record lookup
```

### Unknown route

```text
GET /hotels
  -> logger
  -> no matching route
  -> final 404 fallback
```

Notice that an error status does not automatically mean the server crashed. Our 400 and 404 branches are expected responses to unsuitable requests.

## 10. Test like a developer

Run these commands in a second PowerShell terminal while the server runs:

```powershell
curl.exe -i http://127.0.0.1:4000/destinations
curl.exe -i "http://127.0.0.1:4000/destinations?municipality=Basco"
curl.exe -i http://127.0.0.1:4000/destinations/1
curl.exe -i http://127.0.0.1:4000/destinations/999
curl.exe -i http://127.0.0.1:4000/destinations/banana
curl.exe -i http://127.0.0.1:4000/hotels
```

To send JSON without command-line quoting problems:

```powershell
$previewBody = @{ name = 'Sample destination'; municipality = 'Basco' } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:4000/destination-previews -Method Post -ContentType 'application/json' -Body $previewBody
```

For malformed JSON testing, save the literal text `{"name":` into `bad.json` in the lab folder, then run:

```powershell
curl.exe -i -X POST http://127.0.0.1:4000/destination-previews -H "Content-Type: application/json" --data-binary "@bad.json"
```

| Test | Expected evidence |
|---|---|
| List destinations | 200; two initial records |
| Filter by Basco | 200; matching record |
| Filter by a nonexistent municipality | 200; empty array |
| Detail ID 1 | 200; correct record |
| Detail ID 999 | 404; destination message |
| Detail ID banana | 400; validation message |
| Unknown route | 404; route message |
| Valid preview JSON | 200; trimmed fields and `saved: false` |
| Missing required preview field | 400 |
| Malformed JSON | 400 from error middleware |
| Non-JSON preview request | 415 |

The sample does not implement every HTTP behavior. For example, an unsupported POST to `/destinations` reaches its generic 404 fallback; do not describe it as a complete 405 implementation. Lesson 2.2 discusses a more deliberate endpoint contract.

## 11. Concurrency in plain language

Suppose a handler is waiting for a database. Non-blocking asynchronous work lets Node serve other requests while that I/O is pending. It does not mean every JavaScript statement runs on a separate thread.

If you put a long synchronous computation inside a handler, it can occupy the event loop and delay other clients. Adding `async` to the function does not automatically move CPU-heavy work to another thread. Future service code should use appropriate asynchronous I/O and avoid unnecessary blocking. [Node event loop guidance](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)

For today's small array lookup this distinction is mostly conceptual. Later, when PostgreSQL becomes involved, the waiting step becomes visible and error handling becomes more important.

## 12. Common problems and a debugging order

| Symptom | Check first |
|---|---|
| Connection refused | Is the program running on the correct port? |
| `EADDRINUSE` | Another process may already use port 4000; stop your prior lab server or choose another port |
| Unexpected 404 | Compare method, path, spelling, and route registration |
| `req.body` unavailable | Check JSON header and parser position |
| Request never completes | Look for middleware missing both `next()` and a response |
| Headers already sent | Look for two responses on the same execution path |
| TypeScript errors | Run `pnpm typecheck`; inspect the first relevant error before editing many files |
| Data disappears on restart | This lesson uses an in-memory fixture, not persistence |

Use this sequence: reproduce the exact request; inspect status and body; locate its log ID; trace middleware and handler; correct the smallest cause; repeat the same test. Random changes make it harder to know what actually fixed the problem.

## 13. Lab Exercise 2.1

**Task:** Extend the local tourism API with a typed `GET /activities/:id` endpoint.

1. Define an `Activity` interface with `id`, `title`, and `durationMinutes`.
2. Add at least three sample activities. Label invented entries as sample data.
3. Register the dynamic route before the fallback.
4. Validate the ID as a positive safe integer.
5. Return 200 for an existing record, 400 for an invalid ID, and 404 for a missing record.
6. Keep the logger and error handling intact.
7. Run typecheck and build; stop development mode and verify `pnpm start` too.
8. Explain one successful and one failing request with a lifecycle diagram.

**Submit:** source files, package and lock files, three request/response examples, checks performed, and your explanation. Do not submit `node_modules` or personal credentials.

**Success criteria:** the route really responds; the data is typed; external values are validated; response statuses match the situations; the explanation identifies the processing order.

### Guided investigation

Temporarily move the fallback above your activity route. Predict the result before requesting the activity. Restore the correct order afterward. In your notes, explain why valid source code can still produce incorrect request behavior.

## 14. Knowledge check

1. When does a route callback run: during registration or when a matching request arrives?
2. What are the distinct responsibilities of Node, Express, and TypeScript?
3. For `/destinations/2?language=en`, which value is a path parameter and which is a query parameter?
4. Why is `Number(req.params.id)` alone insufficient validation?
5. Why should an empty collection result usually differ from a missing detail resource?
6. What can happen when middleware neither responds nor calls `next()`?
7. Why must JSON parsing come before the route that reads the JSON body?
8. What does the server's response `finish` event fail to prove?
9. Why does adding `async` not solve a long synchronous loop?
10. Explain why the preview route returns 200 rather than 201.

## 15. Summary and next lesson

You have turned basic HTTP knowledge into a working typed Express application. The important skill is being able to explain where a request goes, what each step reads, and why a particular response comes back.

Our route handlers still sit together in one file. In [Lesson 2.2](02-rest-constraints.md), you will design the API's public contract and separate route selection from controller and business responsibilities. The goal is to make future changes easier to understand and test.
