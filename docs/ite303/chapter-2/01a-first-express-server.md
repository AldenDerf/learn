# 2.1.1 Your First Express Server

**ITE 303 - Web Systems and Technologies 2**

**Chapter 2: Scalable REST API Architecture with Express.js**

**Student handout - Draft for instructor review**

---

## What You Will Learn

By the end of this lesson, you should be able to:

1. Explain what a web server does in simple terms.
2. Describe the different jobs of Node.js, TypeScript, and Express.
3. Create and run a small Express server in a separate practice project.
4. Explain what `app`, `app.get()`, `req`, `res`, `res.send()`, and `app.listen()` do.
5. Add a simple route and predict which URL will reach it.
6. Send a GET request from a browser and trace how the server responds.

---

## Before You Start

This lesson builds on two prerequisites:

- [P.1 - First Node.js & TypeScript](/web-systems/chapter-2/first-program) showed you how to run a TypeScript program with Node.js.
- [P.2 - HTTP Requests & Responses](/web-systems/chapter-2/http-requests-responses) showed you how a client and server exchange messages.

In P.2, you followed this flow:

```text
Client -> HTTP Request -> Server -> HTTP Response -> Client
```

Now you will build the server in the middle:

```text
Client -> HTTP Request -> YOUR EXPRESS SERVER -> HTTP Response -> Client
```

You are moving from **reading HTTP messages** to **writing the program that receives them**.

> [!IMPORTANT]
> Create the practice project in its own folder. Do not add Express or lesson code to the learning platform repository.

---

## 1. What Is a Web Server?

Imagine a school information desk. A student asks a question, the staff member listens, finds the correct information, and gives an answer.

A web server does something similar:

1. It waits for an HTTP request.
2. It checks what the client is asking for.
3. It runs the code for that request.
4. It sends an HTTP response.

The important idea is:

> **A server is a running program waiting for requests.**

A saved TypeScript file is not yet a running server. You must start the program and keep its terminal open.

Here is the first request you will build:

```text
Browser
   |
   | GET /hello
   v
Express Server
   |
   | "Hello!"
   v
Browser
```

The browser is the **client**. It sends `GET /hello`. The Express server receives that request and sends back `Hello!`.

---

## 2. Why Express?

Node.js can create an HTTP server by itself. However, you would need to do more work to inspect URLs and decide which code should run.

Express gives us a simpler way to write rules such as:

```text
When a GET request arrives for /hello, run this function.
```

In code, that rule will look like this:

```typescript
app.get('/hello', (req, res) => {
  res.send('Hello!');
});
```

Express is not magic. It uses Node.js underneath. It gives us clear tools for defining routes and handling HTTP requests and responses.

---

## 3. Node.js vs. TypeScript vs. Express

These three tools work together, but they have different jobs.

| Tool | Its job in this lesson |
|---|---|
| **Node.js** | Runs the server program on your computer. |
| **TypeScript** | Helps you write clearer code and checks types while you develop. |
| **Express** | Helps you define routes and handle HTTP requests and responses. |

In one short summary:

```text
TypeScript = language and development tooling
Node.js    = runtime that runs the program
Express    = web framework used by the program
```

A **framework** is a library that gives you an organized way to build an application. Express gives your server useful web features such as routing.

Express does not replace Node.js, and TypeScript does not receive HTTP requests by itself. Each tool has its own role.

---

## 4. Create the Practice Project

Open PowerShell in a location where you keep your laboratory work. Do **not** run these commands inside the `learn` repository.

### Step 1: Create and enter a new folder

```powershell
mkdir ite303-express-basics
cd ite303-express-basics
pnpm init
```

- `mkdir` creates the practice folder.
- `cd` moves your terminal into that folder.
- `pnpm init` creates `package.json`, which records project information and packages.

### Step 2: Install Express and the development tools

```powershell
pnpm add express@5
pnpm add -D typescript tsx @types/node @types/express@5
```

The first command installs Express because the server needs it when the program runs.

The second command installs development tools:

- `typescript` checks and compiles TypeScript.
- `tsx` runs a TypeScript file during development.
- `@types/node` describes Node.js features for TypeScript.
- `@types/express` describes Express features for TypeScript.
- `-D` records these as development dependencies.

### Step 3: Create the source folder

```powershell
mkdir src
```

Your server file will be `src/server.ts`.

### Step 4: Add project scripts

Open `package.json`. Keep the package entries that pnpm created. Add `"type": "module"` and make sure the `scripts` section contains:

```json
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

This block is a **merge guide**, not a replacement for the entire file. Keep `dependencies` and `devDependencies`, and remember to place commas between neighboring properties.

- `pnpm dev` will run the server and restart it after you save a change.
- `pnpm typecheck` will ask TypeScript to check the code without creating output files.

### Step 5: Create `tsconfig.json`

Create a file named `tsconfig.json` in the project folder:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"]
}
```

This configuration tells TypeScript to check files inside `src`, use modern Node.js modules, and apply strict type checking. You do not need to memorize every option today.

Your practice project should now look like this:

```text
ite303-express-basics/
|-- node_modules/
|-- src/
|   `-- server.ts       <- create this next
|-- package.json
|-- pnpm-lock.yaml
`-- tsconfig.json
```

---

## 5. Your First Express Server

Create `src/server.ts`, then enter this small program:

```typescript
import express from 'express';

const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello!');
});

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
```

Stop here for a moment. This server has only two jobs:

1. Answer `GET /hello` with `Hello!`.
2. Wait for requests on port `4000`.

There is no database, middleware chain, controller, or validation yet. Those ideas will come later.

---

## 6. Run the Server

In PowerShell, make sure you are inside `ite303-express-basics`, then run:

```powershell
pnpm dev
```

You should see:

```text
Server running at http://localhost:4000
```

Keep that terminal open. The running process is your server.

Open a browser and visit:

[http://localhost:4000/hello](http://localhost:4000/hello)

The browser should display:

```text
Hello!
```

You can also send the same GET request from a second PowerShell window:

```powershell
curl.exe http://localhost:4000/hello
```

You should again receive `Hello!`.

> [!TIP]
> Use `curl.exe` in Windows PowerShell. Writing `curl` may run a PowerShell alias on some computers.

When you finish working, return to the server terminal and press `Ctrl + C` to stop it.

---

## 7. What Just Happened?

Follow the complete request:

```text
Browser
   |
   | GET /hello
   v
Express
   |
   | finds app.get('/hello')
   v
Route handler
   |
   | res.send('Hello!')
   v
HTTP response
   |
   v
Browser displays Hello!
```

In plain English:

1. Your browser sent a GET request to `/hello` on port `4000`.
2. Node.js received the network request for the running program.
3. Express looked through the registered routes.
4. Express found a GET route whose path was `/hello`.
5. Express ran that route's handler function.
6. The handler used `res.send()` to send the response.
7. The browser displayed the response body.

The route handler did not run when you typed the code. It ran when a matching request arrived.

---

## 8. Understand the Code Line by Line

### `import express from 'express';`

This imports the Express function from the package you installed. Without the installation and import, this file cannot use Express.

### `const app = express();`

This creates the **Express application** and stores it in `app`.

Think of `app` as the main server organizer. You use it to register routes and start listening for requests.

### `app.get('/hello', ...)`

`app.get()` registers a route for the HTTP `GET` method.

It means:

```text
If a GET request arrives for this path, run this handler.
```

Calling `app.get()` during startup does not send a GET request. It teaches Express how to respond when a request arrives later.

### `'/hello'`

`/hello` is the **route path**, often called simply the **path**.

The path is the part after the host and port:

```text
http://localhost:4000/hello
                     ^^^^^^
                     path
```

Both the method and path must match this route: `GET` and `/hello`.

### `(req, res) => { ... }`

This arrow function is the **route handler**. A route handler is the function Express runs after it finds a matching route.

- `req` represents the incoming HTTP **request**.
- `res` represents the HTTP **response** that your server will send.

This first route does not need to read anything from `req`, but Express still provides it. Later lessons will use `req` to read information sent by the client.

Here is the route as a labeled picture:

```text
app.get('/hello', (req, res) => {
|   |       |       |    |
|   |       |       |    `-- response object
|   |       |       `------- request object
|   |       `--------------- route handler function
|   `----------------------- route path
`--------------------------- Express application

get = HTTP method handled by this route
```

### `res.send('Hello!');`

`res.send()` creates and sends a simple HTTP response. Express uses `200 OK` by default here and sends `Hello!` as the response body.

After the response is sent, this request has received its answer.

### `app.listen(4000, ...)`

`app.listen()` starts the server and tells it to wait for connections on port `4000`.

The function after `4000` runs once the server has started listening:

```typescript
() => {
  console.log('Server running at http://localhost:4000');
}
```

That message is for you, the developer. It does not become the browser's HTTP response.

---

## 9. Your First Experiment

Change the route path and response:

```typescript
app.get('/welcome', (req, res) => {
  res.send('Welcome to ITE 303!');
});
```

Save the file. Because the development script uses `tsx watch`, the server should restart automatically.

Before testing, make a prediction:

> **What do you think will happen if you still visit `/hello`?**

Now test both URLs:

- [http://localhost:4000/welcome](http://localhost:4000/welcome)
- [http://localhost:4000/hello](http://localhost:4000/hello)

You should observe:

- `/welcome` displays `Welcome to ITE 303!`.
- `/hello` no longer matches a route, so Express returns a `404 Not Found` response.

The 404 does not mean the server is necessarily broken. It means the running server did not find a matching route for that request.

The experiment shows an important rule:

> **A route responds only when the request method and path match it.**

---

## 10. Add One More Route

Keep the `/welcome` route, then add this route below it:

```typescript
app.get('/about', (req, res) => {
  res.send('This is my first Express server.');
});
```

Save the file and visit:

[http://localhost:4000/about](http://localhost:4000/about)

Your server can now answer two different paths:

```text
GET /welcome -> Welcome to ITE 303!
GET /about   -> This is my first Express server.
```

One running server can contain many routes. Express checks the incoming request and runs the matching handler.

---

## 11. Common Beginner Mistakes

| Problem | What to check |
|---|---|
| The browser says it cannot connect | Is `pnpm dev` still running? Did you close the terminal? |
| The browser opens the wrong application | Check that the URL uses port `4000`, not `3000`. |
| You receive `404 Not Found` | Compare the URL with the route path, including spelling and `/`. |
| Your latest change does not appear | Save `src/server.ts` and check whether the terminal restarted. |
| PowerShell says Express cannot be found | Run the install commands inside the practice project and check `package.json`. |
| PowerShell cannot find `package.json` | Use `cd` to enter `ite303-express-basics` before running `pnpm dev`. |
| The server stops immediately | Read the first error in the terminal and check the indicated line. |
| You are editing files under `AldenDerf/learn` | Stop and move the exercise to your separate practice folder. |

If port `4000` is already being used, you may see an `EADDRINUSE` error. Stop the older server with `Ctrl + C`, then run `pnpm dev` again.

---

## 12. Try It Yourself

Complete these tasks in your practice project's `src/server.ts`.

### A. Create `/name`

Add a GET route that returns your name.

### B. Create `/course`

Add a GET route that returns `ITE 303 - Web Systems and Technologies 2`.

### C. Create `/school`

Add a GET route that returns the name of your school.

For every route:

1. Write the route before opening the URL.
2. Predict what response you should receive.
3. Save the file.
4. Test the exact path in your browser.
5. Explain which handler ran and why.

Do not copy a complete solution first. Use the `/welcome` and `/about` examples as patterns.

<details>
<summary>Check the expected route shapes after you try</summary>

Your route declarations should have these method-and-path pairs:

```text
GET /name
GET /course
GET /school
```

Each handler should use `res.send()` with a different response. Your exact response text will depend on your name and school.

</details>

---

## 13. Check Your Understanding

Answer these questions before opening the answers.

1. What is Express used for in this lesson?
2. What does `app.get('/hello', handler)` register?
3. What is the difference between `req` and `res`?
4. What does `app.listen(4000)` do?
5. Why does `/hello` not respond with your welcome message after the only route is changed to `/welcome`?

<details>
<summary>View the concise answers</summary>

1. Express helps us define routes and handle HTTP requests and responses.
2. It registers a handler for GET requests whose path is `/hello`.
3. `req` represents the incoming request; `res` represents the response the server will send.
4. It starts the server listening for connections on port `4000`.
5. Route matching uses both the method and path. `/hello` and `/welcome` are different paths.

</details>

### Before You Continue

- [ ] I can explain that a server is a running program waiting for requests.
- [ ] I can explain the different jobs of Node.js, TypeScript, and Express.
- [ ] I can start and stop my Express server.
- [ ] I can explain `app`, `app.get()`, the route path, and the route handler.
- [ ] I can explain the basic difference between `req` and `res`.
- [ ] I can add a new GET route and test its URL.

---

## 14. What Comes Next?

Your server can now receive a simple request and send a simple response. The response is fixed because the handler does not read information from `req` yet.

Real applications need to read information from requests. For example:

```text
/students/1
/students?course=BSIT
```

In **2.1.2**, you will learn how a route can receive values from the path and query string. For now, make sure you can build, run, explain, and change the simple server from this lesson.
