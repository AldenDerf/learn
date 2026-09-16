# 2.1.2 Understanding the Request/Response Lifecycle

**ITE 303 - Web Systems and Technologies 2**

**Chapter 2: Scalable REST API Architecture with Express.js**

---

## What You Will Learn

By the end of this lesson, you should be able to:

1. Trace what happens from the moment a client sends a request until it receives a response.
2. Explain how `req` represents the incoming request and `res` helps build the outgoing response.
3. Read a route parameter with `req.params`.
4. Read a query parameter with `req.query`.
5. Explain the difference between a route path, a route parameter, and a query parameter.
6. Send JSON with an intentional HTTP status using `res.status()` and `res.json()`.

---

## Before You Start

Continue using the same `ite303-express-basics` practice project from [2.1.1 - Your First Express Server](/web-systems/chapter-2/first-express-server).

Do not initialize another project or install Express again. You should already be able to:

- start the server with `pnpm dev`;
- create a route with `app.get()`;
- explain that `req` is the request and `res` is the response; and
- test a route in your browser.

In 2.1.1, your route sent the same response every time:

```typescript
app.get('/welcome', (req, res) => {
  res.send('Welcome to ITE 303!');
});
```

Now you will use information from the incoming request:

```text
2.1.1: Request arrives -> handler sends fixed text

2.1.2: Request arrives -> handler reads req -> handler builds res
```

---

## 1. Reconnect to Your Express Server

Open `ite303-express-basics/src/server.ts`. Begin with the small server you completed in 2.1.1:

```typescript
import express from 'express';

const app = express();

app.get('/welcome', (req, res) => {
  res.send('Welcome to ITE 303!');
});

app.get('/about', (req, res) => {
  res.send('This is my first Express server.');
});

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
```

Run the server if it is not already running:

```powershell
pnpm dev
```

Test these URLs before continuing:

- [http://localhost:4000/welcome](http://localhost:4000/welcome)
- [http://localhost:4000/about](http://localhost:4000/about)

Both routes still send fixed text. The next routes will respond differently based on what the client sends.

---

## 2. What Happens When a Request Arrives?

Suppose a browser requests `GET /welcome`.

```text
Client
   |
   | GET /welcome
   v
Express receives the request
   |
   | checks the method and path
   v
Matches app.get('/welcome')
   |
   | runs the route handler
   v
Handler sends the response
   |
   | Welcome to ITE 303!
   v
Client displays the response
```

The handler runs because **both** parts match:

| Incoming request | Registered route | Match? |
|---|---|---|
| `GET /welcome` | `app.get('/welcome', ...)` | Yes |
| `GET /about` | `app.get('/welcome', ...)` | No: different path |
| `POST /welcome` | `app.get('/welcome', ...)` | No: different method |

The route handler is not constantly running. Express calls it when a matching request arrives.

For every matched request, Express gives the handler two useful objects:

```text
Incoming request information -> req
Outgoing response builder    -> res
```

---

## 3. Meet `req` More Closely

In 2.1.1, the route received `req`, but it did not read anything from it.

The `req` object contains information Express knows about the incoming request. For example:

| Request information | Express property | Example value |
|---|---|---|
| HTTP method | `req.method` | `GET` |
| Current path | `req.path` | `/request-info` |
| Route parameters | `req.params` | `{ id: '42' }` |
| Query parameters | `req.query` | `{ course: 'BSIT' }` |

Add this route above `app.listen()`:

```typescript
app.get('/request-info', (req, res) => {
  const message = `Method: ${req.method}, Path: ${req.path}`;
  res.send(message);
});
```

Save the file and visit:

[http://localhost:4000/request-info](http://localhost:4000/request-info)

You should see:

```text
Method: GET, Path: /request-info
```

Follow the roles carefully:

```text
req.method and req.path -> read from the incoming request
res.send(message)       -> sends the outgoing response
```

> [!IMPORTANT]
> `req` and `res` belong to one request-response exchange. A new browser request produces a new pair of request and response objects.

---

## 4. Route Parameters

Sometimes part of the path changes.

```text
/students/1
/students/25
/students/juan
```

The final part identifies which student the client is asking about. We can mark that changing part with `:` in the route path:

```typescript
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;
  res.send(`You requested student ${studentId}.`);
});
```

Here, `:id` is a **route parameter**. It is a named placeholder inside the route path.

```text
Registered route: /students/:id
                              ^
                              named placeholder

Requested URL:    /students/25
                            ^^
                            captured value
```

Express places the captured value in `req.params`:

```text
GET /students/25
        |
        `-> req.params.id is "25"
```

Test these URLs:

- [http://localhost:4000/students/1](http://localhost:4000/students/1)
- [http://localhost:4000/students/25](http://localhost:4000/students/25)

The same handler runs for both requests, but `req.params.id` contains a different value.

Before testing this URL, make a prediction:

[http://localhost:4000/students/ana](http://localhost:4000/students/ana)

> **Will the route match? What value will `req.params.id` contain?**

It will match, and the value will be the text `"ana"`. Route parameters arrive as text. This route only shows how to read the value; later lessons will validate whether a value is acceptable.

### What if the value is missing?

Visit:

[http://localhost:4000/students](http://localhost:4000/students)

That URL does not match `/students/:id` because the `:id` part is missing. It will match only if you separately create a `/students` route.

---

## 5. Query Parameters

A query parameter adds optional information after a `?` in the URL.

```text
/students?course=BSIT
         |-----------|
          query string
```

In this example:

```text
course = query parameter name
BSIT   = query parameter value
```

Add this route above `app.listen()`:

```typescript
app.get('/students', (req, res) => {
  const course = String(req.query.course ?? 'all courses');
  res.send(`Course filter: ${course}`);
});
```

Save the file and test:

- [http://localhost:4000/students?course=BSIT](http://localhost:4000/students?course=BSIT)
- [http://localhost:4000/students?course=BSCS](http://localhost:4000/students?course=BSCS)
- [http://localhost:4000/students](http://localhost:4000/students)

You should observe:

| Request | Response |
|---|---|
| `/students?course=BSIT` | `Course filter: BSIT` |
| `/students?course=BSCS` | `Course filter: BSCS` |
| `/students` | `Course filter: all courses` |

`req.query.course` reads the value named `course` from the query string. The `??` supplies `all courses` when that value is missing.

In this controlled exercise, you are sending one short text value. Real applications must check query values before trusting or using them. You will practice validation later.

> [!NOTE]
> A query string is not part of the Express route path. All three requests above match the same `/students` route.

---

## 6. Route Parameter vs. Query Parameter

Both techniques place information in a URL, but they answer different questions.

| Feature | Route parameter | Query parameter |
|---|---|---|
| Example | `/students/25` | `/students?course=BSIT` |
| Express route | `/students/:id` | `/students` |
| Read with | `req.params.id` | `req.query.course` |
| Beginner meaning | Which specific student? | Which course filter? |
| Usually required for that route? | Yes | Often optional |

Picture the difference like this:

```text
/students/25
          `-> identify student 25

/students?course=BSIT
          `-> ask for students using a BSIT filter
```

Do not choose based only on where the value looks convenient. Ask what the value means in the request.

### Quick prediction

Consider this request:

```text
/students/42?course=BSIT
```

Before reading the answer, identify:

1. the route parameter value; and
2. the query parameter value.

<details>
<summary>Check your prediction</summary>

- `req.params.id` would contain `"42"` for a route such as `/students/:id`.
- `req.query.course` would contain `"BSIT"`.

</details>

---

## 7. Return Structured Data with `res.json()`

So far, your handlers have sent plain text. Servers often need to send several related values together.

Change the `/students/:id` route to this:

```typescript
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;

  res.json({
    message: 'Student request received',
    studentId: studentId,
  });
});
```

Visit:

[http://localhost:4000/students/25](http://localhost:4000/students/25)

The browser should display JSON similar to:

```json
{
  "message": "Student request received",
  "studentId": "25"
}
```

`res.json()` does two useful jobs:

1. It converts the JavaScript object into JSON.
2. It sends that JSON as the HTTP response.

The value is `"25"`, with quotation marks, because a route parameter arrives as text.

This example does not look up a real student. It only returns the value received in the request so you can see the lifecycle clearly.

---

## 8. Set a Basic Response Status

In [P.2 - HTTP Requests & Responses](/web-systems/chapter-2/http-requests-responses), you learned that an HTTP response includes a status code.

Express uses `200 OK` by default for the successful responses you have sent. You can also choose the status intentionally with `res.status()`:

```typescript
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;

  res.status(200).json({
    message: 'Student request received',
    studentId: studentId,
  });
});
```

Read the final statement from left to right:

```text
res.status(200).json({ ... })
|       |          |
|       |          `-> send this JSON body
|       `------------> choose HTTP status 200
`--------------------> build the response
```

You can inspect the status and headers with:

```powershell
curl.exe -i http://localhost:4000/students/25
```

Look for a response beginning with:

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
```

For now, use `200` for this successful GET request. Later lessons will choose other statuses for specific situations.

### One request, one completed response

Once `res.json()` or `res.send()` completes the response, do not try to send another response for the same request.

This is incorrect:

```typescript
app.get('/two-answers', (req, res) => {
  res.send('First answer');
  res.send('Second answer'); // Incorrect: this request was already answered.
});
```

One request should receive one completed response:

```text
One request -> one handler path -> one completed response
```

---

## 9. Trace a Complete Request

Now combine a route parameter, a query parameter, JSON, and a status in one small route:

```typescript
app.get('/students/:id', (req, res) => {
  const studentId = req.params.id;
  const course = String(req.query.course ?? 'not provided');

  res.status(200).json({
    message: 'Student request received',
    studentId: studentId,
    course: course,
  });
});
```

Send this request:

[http://localhost:4000/students/42?course=BSIT](http://localhost:4000/students/42?course=BSIT)

Trace it from beginning to end:

```text
Client
   |
   | GET /students/42?course=BSIT
   v
Express checks method and path
   |
   | matches GET /students/:id
   v
Route handler reads req
   |
   | req.params.id     -> "42"
   | req.query.course  -> "BSIT"
   v
Route handler builds res
   |
   | status -> 200
   | body   -> JSON object
   v
Express sends HTTP response
   |
   v
Client receives JSON
```

The expected body is:

```json
{
  "message": "Student request received",
  "studentId": "42",
  "course": "BSIT"
}
```

Notice the order:

1. The request arrives.
2. Express finds the matching route.
3. The handler reads values from `req`.
4. The handler prepares and sends the response through `res`.
5. The client receives the completed response.

That sequence is the basic request/response lifecycle inside your Express application.

---

## 10. Your Experiments

Use the combined `/students/:id` route from the previous section.

### Experiment A: Change the route parameter

Before opening the URL, predict the `studentId` in the JSON response:

[http://localhost:4000/students/101?course=BSIT](http://localhost:4000/students/101?course=BSIT)

Test it and compare the result with your prediction.

### Experiment B: Change the query parameter

Predict which value will change and which value will stay the same:

[http://localhost:4000/students/101?course=BSCS](http://localhost:4000/students/101?course=BSCS)

### Experiment C: Remove the query parameter

Predict the response before visiting:

[http://localhost:4000/students/101](http://localhost:4000/students/101)

The route still matches because the route parameter is present. The `course` value becomes `not provided` because the query parameter is optional in this handler.

After every request, explain aloud or in your notebook:

```text
Which route matched?
What did req contain?
What did res send?
```

---

## 11. Common Beginner Mistakes

| Problem | What to check |
|---|---|
| `req.params.id` is `undefined` | Does the route path use the same name, such as `:id`? |
| `/students` returns 404 | A `/students/:id` route still requires an ID segment. |
| The query value is missing | Check the `?`, parameter name, and spelling: `?course=BSIT`. |
| `/students?course=BSIT` reaches the wrong expectation | Remember that the query string is not part of the route path. |
| The response shows text instead of JSON | Check that the handler uses `res.json()`, not `res.send()` with a sentence. |
| The status is not what you expected | Check the number passed to `res.status()` before the response is sent. |
| The terminal reports an error after sending | Make sure one request path sends only one response. |
| Your changes do not appear | Save `src/server.ts` and confirm that `pnpm dev` restarted the server. |

Trace the request before changing random lines. Start with the method and URL, find the matching route, inspect what the handler reads from `req`, and then inspect what it sends through `res`.

---

## 12. Try It Yourself

Complete these tasks in the same `ite303-express-basics/src/server.ts` file.

### A. Create a subject route

Create a route with this shape:

```text
GET /subjects/:code
```

For `/subjects/ITE303`, return JSON containing the captured subject code.

### B. Read a year query parameter

In the same route, read an optional `year` query parameter. Use `not provided` when it is missing.

Test both requests:

```text
/subjects/ITE303?year=3
/subjects/ITE303
```

### C. Trace your route

For `/subjects/ITE303?year=3`, write these five items in your notebook:

1. HTTP method
2. matching Express route
3. route parameter and value
4. query parameter and value
5. response status and JSON body

Do not open the answer until you have written and tested your own route.

<details>
<summary>Check one possible solution</summary>

```typescript
app.get('/subjects/:code', (req, res) => {
  const subjectCode = req.params.code;
  const year = String(req.query.year ?? 'not provided');

  res.status(200).json({
    subjectCode: subjectCode,
    year: year,
  });
});
```

For `/subjects/ITE303?year=3`:

- method: `GET`
- matching route: `/subjects/:code`
- `req.params.code`: `"ITE303"`
- `req.query.year`: `"3"`
- status: `200`
- body: `{ "subjectCode": "ITE303", "year": "3" }`

</details>

---

## 13. Check Your Understanding

Answer these questions before opening the answers.

1. What causes an Express route handler to run?
2. What is the difference between `req` and `res`?
3. For `/students/42`, how does the route `/students/:id` read `42`?
4. For `/students?course=BSIT`, how does the handler read `BSIT`?
5. What is the difference between `res.send()` and `res.json()` in this lesson?
6. Why should one request receive only one completed response?

<details>
<summary>View the concise answers</summary>

1. The handler runs when the incoming HTTP method and path match its registered route.
2. `req` contains incoming request information; `res` is used to build and send the outgoing response.
3. Express captures `42` as `req.params.id`.
4. The handler reads it from `req.query.course`.
5. `res.send()` can send simple text; `res.json()` converts an object to JSON and sends it as the response.
6. After a response is completed, that request has already received its answer. Trying to send again is an error.

</details>

### Before You Continue

- [ ] I can trace a request from the client to the matching handler and back.
- [ ] I can explain what information comes from `req`.
- [ ] I can explain how a handler uses `res`.
- [ ] I can read a route parameter with `req.params`.
- [ ] I can read a query parameter with `req.query`.
- [ ] I can explain when a route parameter differs from a query parameter.
- [ ] I can send JSON with an intentional `200` status.
- [ ] I know that one request should receive one completed response.

---

## 14. What Comes Next?

Your server can now read information from a request and use that information to build a response.

So far, each request moves directly to one matching route handler:

```text
Request -> Route handler -> Response
```

Real applications often need shared steps that run before a route handler, such as recording that a request arrived or preparing information for several routes.

In **2.1.3**, you will meet middleware and see how Express can place shared steps into the request lifecycle. You do not need to write middleware yet. First, make sure you can trace the lifecycle from this lesson without guessing.
