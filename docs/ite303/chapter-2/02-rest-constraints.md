# 2.2 REST Constraints & Architectural Concerns

> **Student handout.** This newly authored lesson is for ITE 303, Web Systems & Technologies 2. It does not replace an original handout. All destination records and application rules below are invented classroom fixtures, not official tourism information.

## Syllabus alignment and learning targets

This lesson belongs to **Chapter 2: Scalable REST API Architecture with Express.js**, under topic **2.2 REST Constraints & Architectural Concerns**. It supports the syllabus objective to design RESTful pathways following architectural separation of concerns and **Lab 2.2: separating route paths from handler business controllers**. It also supports explaining REST constraints and building a service using Express routers and controllers.

By the end, you should be able to:

1. Distinguish a resource, its identifier, and its representation.
2. Explain the six REST constraints and connect them to design choices.
3. Design collection and individual-resource pathways using suitable HTTP methods.
4. Explain the responsibilities of routers, controllers, services, and repositories.
5. Refactor an Express handler into modules without changing its public behavior.
6. Demonstrate valid, invalid, missing-resource, and empty-result requests.

**Prerequisites:** complete Lesson 2.1 and review HTTP requests/responses, JavaScript functions, arrays, modules, and basic TypeScript types. Read this as a sequence: understand the contract first, follow one request through the modules, then do the lab.

## 1. Start with the client's question

Imagine a visitor opening a Batanes destination directory. They ask, “Which destinations are in Basco?” The interface might be a browser today and a mobile app next semester. Both clients should be able to ask the same server the same question.

We will design this request:

```http
GET /api/destinations?municipality=Basco HTTP/1.1
Host: localhost:3001
Accept: application/json
```

The server answers with destination data. It should not require the client to know a database table name, the filename containing the controller, or which machine handled the request. Those details belong behind the API boundary.

An **API contract** is the agreement about how to communicate: accepted paths, methods, inputs, response shapes, and errors. A stable contract lets a frontend student work while a backend student improves storage. For example, replacing an array with a database should not force the frontend to rename `/api/destinations`.

This is a design goal, not an automatic benefit of using Express. Express lets you write a clear API, but it also lets you put every operation into one confusing endpoint. We have to choose the structure deliberately.

## 2. Resource, identifier, and representation

A **resource** is the concept the API makes addressable: a destination, a booking, a user profile, or a collection of destinations. A **resource identifier** tells the client which resource it means. A **representation** is the data sent about that resource at a particular time.

For our example:

| Concept | Example |
| --- | --- |
| Resource | The classroom destination record with ID 1 |
| Identifier | `/api/destinations/1` |
| Representation | JSON containing its ID, name, and municipality |

```json
{
  "id": 1,
  "name": "Sample Coastal Viewpoint",
  "municipality": "Basco"
}
```

The JSON is a representation, not the destination itself. A printed list and a map marker might represent the same destination differently. Similarly, one resource can have more than one supported representation. JSON is convenient for this exercise, but choosing JSON alone does not establish REST compliance.

Do not assume a resource must correspond to exactly one database row. A “destination availability” resource might combine several records. Design around a meaningful client-facing concept; decide storage details afterward.

## 3. REST in one careful definition

**REST**, or Representational State Transfer, is an architectural style defined through constraints on how components interact. Its six constraints are client–server, statelessness, cacheability, a uniform interface, a layered system, and optional code-on-demand. Uniform interface includes resource identification, manipulation through representations, self-descriptive messages, and hypermedia-driven application state. See [Fielding's REST definition](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm).

The following classroom scenarios help you reason about those constraints. A small GET API is useful practice, but it is not evidence that a complete system satisfies every REST constraint. We will call our implementation a **resource-oriented HTTP API exercise**, while identifying the broader REST requirements explicitly.

### 3.1 Client–server: separate presentation from service responsibilities

Picture two students working together. Lea builds the page that displays destinations. Marco builds the API that returns records. Lea decides how cards look; Marco decides how records are retrieved. They agree on the response shape before implementing either side.

If Lea changes a card from blue to green, the server should not need a deployment. If Marco reorganizes internal data modules, the page should continue working. This example illustrates why a clear communication boundary matters.

An unhelpful design would make the browser send a database query such as `SELECT * FROM destinations`. That gives the browser responsibilities it should not own and exposes internal details. Our contract asks for resources instead.

### 3.2 Statelessness: make each request understandable on its own

Consider two possible designs:

```text
Conversation-dependent design:
  Request 1: remember that I selected Basco
  Request 2: give me the destinations for my previous selection

Self-contained design:
  Request 1: GET /api/destinations?municipality=Basco
  Request 2: GET /api/destinations?municipality=Sabtang
```

In the second design, a server can understand the second request without remembering the first. The client carries the context needed to express its current request.

**Stateless does not mean “no database.”** Destination records are resource data. A server may store them persistently. The problematic dependency is hidden conversational context required to interpret the next request. Likewise, an in-memory array is not proof of statelessness: an application could still remember a client's previous selection in another variable.

For our exercise, imagine two server instances. Both should interpret `?municipality=Basco` consistently. The example array is copied into each process and is unsuitable for shared writable production data; that storage limitation is separate from request self-containment.

### 3.3 Cacheability: decide when an earlier response may be reused

A visitor repeatedly opening the same public destination description should not necessarily trigger identical work every time. A cache can reuse a response when the response's caching rules allow it.

HTTP provides directives such as `Cache-Control: public, max-age=60` for a response that may be shared and considered fresh for 60 seconds. `no-store` tells caches not to store the response. `no-cache` permits storage but requires successful validation before reuse; it does not mean the same thing as `no-store`. See [RFC 9111, Cache-Control](https://www.rfc-editor.org/rfc/rfc9111.html#name-cache-control).

In a classroom directory, a slightly older public description might be acceptable. A person's private booking data needs different treatment. Start by asking: who may reuse this response, and how old may it be? Do not copy a public caching policy onto personalized responses without understanding the consequences.

Our lab sets `no-store` to keep observations straightforward. This is an explicit policy for a teaching example, not a claim that destination directories should never cache.

### 3.4 Uniform interface: use a shared vocabulary

An office with predictable forms is easier to visit than one that invents a new procedure at every counter. For an API, consistent methods, identifiers, representations, and message semantics provide a shared vocabulary.

The four parts can be remembered using our directory:

| Part | Classroom illustration |
| --- | --- |
| Resource identification | `/api/destinations/1` addresses a specific destination |
| Manipulation through representations | A future update submits an agreed representation or change document |
| Self-descriptive messages | A response declares its content type and communicates its outcome |
| Hypermedia as the engine of application state | A client discovers possible next transitions through links or controls in representations |

A destination representation could include a link to its collection. However, adding an arbitrary `links` field is not enough to implement a full hypermedia contract: clients need agreed meanings for link relations and available transitions. Our introductory lab uses documented paths and plain JSON; full hypermedia interaction is a later extension. Keep that limitation visible when describing the API as RESTful.

### 3.5 Layered system: allow intermediaries behind a stable boundary

Imagine this deployment:

```text
Browser -> gateway -> API instance -> storage
```

The browser addresses the public API. The deployment might add a gateway or move traffic between API instances without teaching the browser every internal connection. Each boundary should have a clear responsibility.

This is different from putting code in `routes/`, `controllers/`, and `services/` folders. Those folders organize one application's code. REST's layered-system constraint concerns interactions between components. Both ideas involve boundaries, but a folder tree alone cannot prove the network architecture is layered.

### 3.6 Code-on-demand: an optional extension

A server can optionally supply executable code that extends a client's capabilities. Browser-delivered scripts provide a familiar illustration. This constraint is optional: our API does not need to deliver executable scripts to complete the lab. Sending ordinary JSON records is data delivery, not code-on-demand.

### Pause and explain

Without looking back, explain why “We use Express and return JSON” does not establish that all REST constraints are satisfied. Use one concrete missing design decision in your explanation.

## 4. Design the paths before the files

We will use the following contract. Only the two GET operations are implemented in the lab; write operations are design examples for discussion.

| Request | Intended meaning | Lab implementation |
| --- | --- | --- |
| `GET /api/destinations` | Read the collection | Yes |
| `GET /api/destinations?municipality=Basco` | Read a filtered collection | Yes |
| `GET /api/destinations/1` | Read one destination | Yes |
| `POST /api/destinations` | Request creation of a destination | Discussion only |
| `PUT /api/destinations/1` | Replace the target's representation | Discussion only |
| `PATCH /api/destinations/1` | Apply a defined partial change | Discussion only |
| `DELETE /api/destinations/1` | Request removal of the target association | Discussion only |

Collection nouns such as `destinations` are a useful convention, not a complete REST definition. Prefer consistent names that students can predict. Avoid encoding the same operation twice, such as `GET /getAllDestinations`, when a collection path already communicates the target.

### Safe and idempotent are different questions

**Safe** asks whether the client requests a state-changing operation. **Idempotent** asks whether repeating an identical request has the same intended server effect as making it once. GET, HEAD, and OPTIONS are safe; safe methods, PUT, and DELETE are idempotent. POST has no general idempotency guarantee. Repeated responses need not be identical, and incidental logging does not make a GET unsafe. See [RFC 9110, method properties](https://www.rfc-editor.org/rfc/rfc9110.html#name-common-method-properties).

For example, requesting deletion twice can leave the same final state—resource absent—even if the first response reports success and the second reports absence. The definition concerns the intended effect, not byte-for-byte response equality.

PATCH is not inherently idempotent, although a particular change can be designed that way. “Set capacity to 20” differs from “increase capacity by 1.” A PATCH request also needs a defined patch-document format; an arbitrary partial JSON object is not universally understood. See [RFC 5789](https://www.rfc-editor.org/rfc/rfc5789.html).

### Path parameters, query parameters, and bodies

```text
GET /api/destinations/1
                      ^ path parameter: which individual resource?

GET /api/destinations?municipality=Basco
                     ^ query parameter: how should the collection be selected?

POST /api/destinations
body: { "name": "Sample Site", "municipality": "Basco" }
      ^ proposed data for an operation that accepts a body
```

For this contract, the path ID selects a record; the municipality query filters records. We do not use a GET body to carry filters. Express makes path and query values available separately, and query values still require runtime checks. TypeScript cannot prevent a client from sending repeated parameters or unexpected input. See [Express routing](https://expressjs.com/en/guide/routing/) and the [Express request API](https://expressjs.com/en/5x/api/request/).

### Choose outcomes deliberately

| Status | Our intended use |
| --- | --- |
| `200 OK` | Successful read, including an empty filtered list |
| `400 Bad Request` | Invalid ID format or invalid municipality filter |
| `404 Not Found` | Valid ID format, but no matching destination; also an unknown path |

Future operations might use `201 Created` after creation, `204 No Content` for success without a body, or `409 Conflict` for a conflict with current resource state. Authentication-related statuses include `401` for missing/invalid authentication credentials and `403` for refusal to fulfill the request. A `401` response requires an appropriate authentication challenge. See [RFC 9110, status codes](https://www.rfc-editor.org/rfc/rfc9110.html#name-status-codes).

An empty collection is still a successfully retrieved collection. In our contract, searching for a municipality with no fixtures returns `200` and `data: []`; asking for individual ID `999` returns `404`. Explain this distinction to the frontend developer before either side writes code.

## 5. Separation of concerns: give each module one clear job

The syllabus lab asks us to separate route paths from handler business controllers. We will start with that required boundary and then show where additional responsibilities fit.

| Module | Main question | Avoid putting here |
| --- | --- | --- |
| Router | Which handler receives this method and path? | Filtering algorithms and database operations |
| Controller | How do HTTP inputs become a response? | SQL and unrelated business calculations |
| Service | What application rule should be applied? | Express `req` and `res` |
| Repository | How are records obtained or stored? | HTTP status selection |

These are teaching conventions, not Express requirements. A tiny handler does not always need four files. The value comes from clear responsibilities, not the number of folders. In this exercise the service controls matching behavior, while the repository supplies data. That makes a later storage replacement easier to explain.

Think of a tourism office. The router is the sign directing you to the correct counter. The controller receives your form and returns the result in the expected format. The service applies the office's rule. The repository retrieves the records. The analogy is useful until it hides details: unlike an office worker, a function only performs the instructions you write.

```text
Request: GET /api/destinations?municipality=basco
  |
  v
app: mounts /api/destinations
  |
  v
router: matches GET /
  |
  v
controller: validates query input
  |
  v
service: applies case-insensitive municipality matching
  |
  v
repository: provides fixture records
  |
  v
service -> controller -> 200 JSON response
```

The response does not need to pass through a second chain of router calls. The arrows summarize function calls returning results to their callers.

## 6. Guided Lab 2.2: build and trace a modular directory

### 6.1 Create a separate practice project

These commands are instructions for a **new student exercise folder**, not the learning platform repository. Use a currently supported Node.js LTS installation and your instructor's pnpm setup. Express 5's minimum Node version is 18, but a minimum requirement is not a recommendation to use an end-of-life release. See [Express installation](https://expressjs.com/en/starter/installing/).

```sh
mkdir ite303-rest-lab
cd ite303-rest-lab
pnpm init
pnpm add express@5
pnpm add -D typescript@5 tsx @types/node @types/express@5
```

Keep the generated package file and add `"type": "module"` at its top level. Add these entries to its `scripts` object:

```json
{
  "dev": "tsx watch src/server.ts",
  "check": "tsc --noEmit",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "rootDir": "src",
    "outDir": "dist",
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

This setup uses Node-style ECMAScript modules. Local imports below end in `.js` because those are the emitted runtime files; TypeScript resolves the corresponding `.ts` sources during compilation. See [TypeScript's module reference](https://www.typescriptlang.org/tsconfig/module.html).

### 6.2 First understand the smallest router/controller split

Before creating the complete lab, read this miniature example:

```ts
// Controller responsibility: produce the HTTP response.
const listDestinations: RequestHandler = (_req, res) => {
  res.json({ data: [] });
};

// Router responsibility: connect the path to the handler.
router.get("/", listDestinations);
```

This is an explanatory fragment, not a standalone file: `RequestHandler` and `router` would need imports/declarations. The important difference is that the router names the path while the controller owns the response. In the complete version below, a service supplies the data instead of hardcoding an empty list.

### 6.3 Create the complete file structure

```text
src/
  app.ts
  server.ts
  destinations/
    destination.types.ts
    destination.repository.ts
    destination.service.ts
    destination.controller.ts
    destination.routes.ts
```

Create each following file exactly once. Read the responsibility sentence before copying its code.

**`src/destinations/destination.types.ts`** describes the shared record shape.

```ts
export interface Destination {
  id: number;
  name: string;
  municipality: string;
}
```

**`src/destinations/destination.repository.ts`** owns the fixture data and returns copies. Copying prevents a caller from accidentally editing the stored classroom records through a returned object reference.

```ts
import type { Destination } from "./destination.types.js";

const destinations: Destination[] = [
  { id: 1, name: "Sample Coastal Viewpoint", municipality: "Basco" },
  { id: 2, name: "Sample Heritage Walk", municipality: "Sabtang" },
  { id: 3, name: "Sample Hill Trail", municipality: "Basco" }
];

export function findAll(): Destination[] {
  return destinations.map((destination) => ({ ...destination }));
}

export function findById(id: number): Destination | undefined {
  const destination = destinations.find((item) => item.id === id);
  return destination ? { ...destination } : undefined;
}
```

**`src/destinations/destination.service.ts`** applies the exercise's case-insensitive matching rule. It receives ordinary values, so it can be called without constructing an HTTP request.

```ts
import * as repository from "./destination.repository.js";
import type { Destination } from "./destination.types.js";

export function listDestinations(municipality?: string): Destination[] {
  const destinations = repository.findAll();
  if (municipality === undefined) return destinations;

  const expected = municipality.toLowerCase();
  return destinations.filter(
    (destination) => destination.municipality.toLowerCase() === expected
  );
}

export function getDestination(id: number): Destination | undefined {
  return repository.findById(id);
}
```

The second function currently delegates directly. Its purpose is to keep the controller dependent on the application-facing module. If this remains a tiny read-only exercise, combining a trivial service and repository can also be reasonable; be able to explain the tradeoff.

**`src/destinations/destination.controller.ts`** checks HTTP inputs and translates results into responses. Notice that invalid syntax and a missing record are different situations.

```ts
import type { RequestHandler } from "express";
import * as service from "./destination.service.js";

export const listDestinations: RequestHandler = (req, res) => {
  const rawMunicipality = req.query.municipality;

  if (
    rawMunicipality !== undefined &&
    (typeof rawMunicipality !== "string" ||
      rawMunicipality.trim().length === 0)
  ) {
    res.status(400).json({
      error: {
        code: "INVALID_MUNICIPALITY",
        message: "municipality must be one non-empty text value"
      }
    });
    return;
  }

  const municipality =
    typeof rawMunicipality === "string" ? rawMunicipality.trim() : undefined;
  const data = service.listDestinations(municipality);
  res.status(200).json({ data, count: data.length });
};

export const getDestination: RequestHandler<{ id: string }> = (req, res) => {
  const rawId = req.params.id;
  const id = Number(rawId);

  if (!/^[1-9]\d*$/.test(rawId) || !Number.isSafeInteger(id)) {
    res.status(400).json({
      error: {
        code: "INVALID_ID",
        message: "id must be a positive safe integer without leading zeros"
      }
    });
    return;
  }

  const data = service.getDestination(id);
  if (data === undefined) {
    res.status(404).json({
      error: { code: "DESTINATION_NOT_FOUND", message: "Destination not found" }
    });
    return;
  }

  res.status(200).json({ data });
};
```

Why not use `parseInt(rawId)` alone? It can accept a numeric beginning followed by unrelated characters. Our contract requires the entire ID text to match the chosen format. Rejecting leading zeros is a classroom convention, not an HTTP requirement.

Why is there a `return` after each error response? Sending JSON does not by itself stop the JavaScript function. Returning prevents the success path from trying to send a second response.

**`src/destinations/destination.routes.ts`** contains the required path-to-handler mapping. Express routers can group routes under a mount point; see [Express routing](https://expressjs.com/en/guide/routing/).

```ts
import { Router } from "express";
import { getDestination, listDestinations } from "./destination.controller.js";

export const destinationRouter = Router();

destinationRouter.get("/", listDestinations);
destinationRouter.get("/:id", getDestination);
```

**`src/app.ts`** assembles the application. The final middleware handles paths that no route matched. These are synchronous read handlers, so no asynchronous database/error layer is needed for this particular fixture.

```ts
import express from "express";
import { destinationRouter } from "./destinations/destination.routes.js";

export const app = express();
app.set("query parser", "simple");

app.use((_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/destinations", destinationRouter);

app.use((_req, res) => {
  res.status(404).json({
    error: { code: "ROUTE_NOT_FOUND", message: "Route not found" }
  });
});
```

**`src/server.ts`** starts the listener. Keeping it separate makes the application easier to import into a test later without immediately opening a port.

```ts
import { app } from "./app.js";

app.listen(3001, () => {
  console.log("Destination lab listening at http://localhost:3001");
});
```

The full individual route is the mount path `/api/destinations` plus `/:id`. Do not repeat the mount prefix inside the router, or you will accidentally require a doubled URL.

### 6.4 Run and inspect

From the exercise folder:

```sh
pnpm check
pnpm build
pnpm start
```

For editing with automatic restart, stop the running server using Ctrl+C, then use `pnpm dev`. Do not start both commands on port 3001 simultaneously.

Open `http://localhost:3001/api/destinations` in a browser. To inspect headers and status codes, use an API client or a terminal. In Windows PowerShell use `curl.exe` to avoid older PowerShell aliases:

```sh
curl.exe -i "http://localhost:3001/api/destinations?municipality=basco"
curl.exe -i "http://localhost:3001/api/destinations/1"
curl.exe -i "http://localhost:3001/api/destinations/999"
curl.exe -i "http://localhost:3001/api/destinations/abc"
```

On macOS/Linux use `curl` instead of `curl.exe`.

| Test input | Expected observation |
| --- | --- |
| `/api/destinations` | `200`, three records, count 3 |
| `?municipality=basco` | `200`, two matching records |
| `?municipality=Unknown` | `200`, empty array, count 0 |
| `?municipality=` | `400`, invalid municipality error |
| `?municipality=Basco&municipality=Sabtang` | `400`, repeated values rejected |
| `/api/destinations/1` | `200`, one record |
| `/api/destinations/999` | `404`, destination not found |
| `/api/destinations/abc` | `400`, invalid ID |
| `/api/destinations/01` | `400`, invalid ID under our convention |
| `/missing` | `404`, route not found |

Read both the status and the JSON. A JSON object containing an `error` property with a `200` status would communicate a different HTTP outcome. For debugging, identify the first stage where the observation differs from your prediction.

### 6.5 Explain the request without reading code aloud

Trace `GET /api/destinations/2` in six sentences: identify the mount, matched route, controller input, validation, service/repository call, and response. Then trace `/api/destinations/abc`. Which calls no longer happen? This is the bridge between Lesson 2.1's lifecycle and this lesson's architectural separation.

## 7. Common mistakes and how to reason about them

**Everything is in the router.** Locate filtering code and response construction. Moving a long function to a new file only helps if its responsibility becomes clear. A router should read like an index of public pathways.

**The service receives `req` and `res`.** Ask how you would call that service from a scheduled task. If it requires fake HTTP objects, the HTTP boundary has spread into your application logic. Pass values such as `id` or `municipality` instead.

**A query is assumed to be a string.** A caller can repeat a parameter. Runtime validation turns unpredictable input into an intentional error response. A TypeScript annotation does not validate network traffic.

**Every empty result becomes 404.** Distinguish a valid collection with zero matches from a missing individual resource. The frontend often needs different messages: “No matches” versus “This destination does not exist.”

**GET performs a destructive action.** Do not make a link such as `/deleteDestination/1` delete data when read. A crawler or preview system may retrieve a URL. Design operations according to their method semantics.

**More files are assumed to mean scalability.** Our array and synchronous fixtures are educational. Production scalability involves shared storage, bounded queries, connection management, caching policy, observability, and deployment decisions. Clear modules make changes easier; they do not supply those facilities automatically.

## 8. Student activities

### Activity A — contract before implementation

Design pathways for a fictional list of tour packages and one package by ID. Write the method, path, accepted inputs, successful response shape, and invalid/missing outcomes. Use invented data. Exchange the contract with a partner and ask them to predict three requests without seeing your code.

### Activity B — required Lab 2.2 submission

Submit the separate exercise project with its lockfile and a short README. The README must contain your file-responsibility table, five request/response observations, and an explanation of why the router does not directly access the fixture array.

Demonstrate all of the following:

- A collection read and individual read work.
- Route paths and controller functions live in separate modules.
- Invalid input produces an intentional client error.
- A valid missing ID differs from an invalid ID.
- An empty filter result remains a successful collection response.
- The code passes the exercise's TypeScript check and build.

These are draft assessment criteria for instructor review, not an official replacement for the syllabus grading policy.

### Activity C — a small controlled change

Add an optional `name` filter that performs case-insensitive substring matching. Decide how it combines with `municipality`, document the decision, and reject repeated or blank `name` values. Keep HTTP parsing in the controller and matching in the service. Record requests that demonstrate both filters separately and together.

### Activity D — architecture discussion

Suppose a database replaces the array next month. Identify which module must change and what asynchronous changes might propagate to its callers. Then suppose the public response must hide an internal field. Explain why a database record and an API representation do not have to be identical.

## 9. Knowledge checks

1. What is the difference between a resource and its JSON representation?
2. Why does storing destinations in a database not contradict statelessness?
3. Which request details make the municipality selection self-contained?
4. Name the four uniform-interface subconstraints and illustrate one.
5. Why is a `links` property alone insufficient to establish a full hypermedia contract?
6. How do network layers differ from application code folders?
7. Why can DELETE be idempotent when repeated responses differ?
8. Give one idempotent partial change and one non-idempotent partial change.
9. Why should `/api/destinations?municipality=Unknown` return a different kind of outcome from `/api/destinations/999`?
10. Which module should choose a `400` status? Which should own record retrieval?
11. What breaks if you send an error response but continue into the success path?
12. Which REST constraint is optional, and is it implemented in this lab?

## 10. Glossary

| Term | Meaning in this lesson |
| --- | --- |
| API contract | Agreed request and response behavior |
| Resource | An addressable concept exposed by the API |
| Representation | Transferred data describing resource state |
| Endpoint | A method and address through which a client interacts |
| Route parameter | A value captured from a matching path segment |
| Query parameter | A value in the URL query used by this contract for selection |
| Controller | HTTP input/output adapter for an application operation |
| Service | Module applying application rules |
| Repository | Module encapsulating data access |
| Safe method | A method whose requested semantics are read-only |
| Idempotent operation | Repetition has the same intended effect as one request |
| Cache | Storage that may reuse eligible responses |
| Hypermedia | Links or controls that guide available interactions |
| Separation of concerns | Assigning distinct responsibilities to clear boundaries |

## 11. Summary and review boundary

Start with the client's question and define a stable resource contract. REST asks broader architectural questions than “Does it return JSON?” Inside the server, separate pathway selection from HTTP handling and application/data responsibilities. Trace one request through those boundaries, then test both successful and unsuccessful cases.

The complete lab intentionally implements GET reads over fictional in-memory fixtures. It does not implement authentication, write operations, persistence, full hypermedia, or production deployment. The instructor should review terminology, pacing, and assessment criteria before this draft becomes published course material. Executable-example verification is recorded in the chapter review notes rather than implied by inclusion here.
