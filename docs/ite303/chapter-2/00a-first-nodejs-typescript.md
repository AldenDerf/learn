# Prerequisite 1: Running Your First Node.js + TypeScript Program

**ITE 303: Web Systems and Technologies 2**  
**Chapter 2 Foundation: Scalable REST API Architecture with Express.js**  
**Student Handout & Laboratory Preparation**

---

## Learning Objectives

Before you build web servers with Express, you need to be comfortable running TypeScript code on your own machine. By the end of this lesson, you will be able to:

1. **Differentiate the roles** of Node.js, TypeScript, and `pnpm`.
2. **Explain the mental model** of how TypeScript source code becomes a running program.
3. **Initialize a backend project** from scratch using Windows PowerShell.
4. **Install and configure** essential development dependencies (`typescript`, `@types/node`, `tsx`).
5. **Write, run, and modify** a typed program using `package.json` scripts.
6. **Read terminal output** and troubleshoot common beginner mistakes (syntax errors, missing files, type mismatches).
7. **Control process execution** (starting, stopping with `Ctrl + C`, and restarting).

---

## 1. The Core Mental Model

In frontend web development, your browser loads an HTML file, downloads JavaScript, and executes it directly. 

In backend development, **there is no browser window**. Your code runs directly on your computer's operating system through a runtime called **Node.js**, and your primary interface is the **Terminal (PowerShell)**.

Here is the exact journey from writing code to seeing output:

```text
┌────────────────────────┐
│   Source Code (.ts)    │  Written by you in VS Code with strict types
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  TypeScript / Transpile │  Checks types for errors & strips types to plain JS
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     Node.js Runtime    │  Executes the resulting JavaScript on your CPU
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     Running Process    │  Active program in memory (RAM)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│     Terminal Output    │  Console messages printed to PowerShell
└────────────────────────┘
```

### Who Does What?

| Tool | What it is | Its specific job | What happens if it is missing? |
|---|---|---|---|
| **Node.js** | JavaScript Runtime | Executes JavaScript outside of a web browser. | Your computer cannot run server-side JavaScript. |
| **TypeScript** | Typed Superset of JS | Provides static type checking during development to catch errors before runtime, and strips type annotations to produce plain JavaScript. | Node.js will throw a syntax error if given raw `.ts` files directly. |
| **pnpm** | Fast Package Manager | Downloads, caches, and organizes libraries and command-line tools into `node_modules`. | You cannot easily install or manage external libraries. |
| **tsx** | Fast Development Runner | Transpiles TypeScript on the fly in memory (stripping types) and runs the code immediately with Node.js during development. | You would have to manually run `tsc` to produce `.js` files every time you test an edit. |

> [!IMPORTANT]
> **Source Code vs. Running Program:**  
> A file saved on your hard drive (`index.ts`) is just text. It does nothing on its own. It only becomes a **running program** (a process) when Node.js loads it into memory and executes its instructions. Editing a file does not magically update an already-running program unless the tool restarts the process!

---

## 2. Required Tools

Make sure you have these tools installed before proceeding:

1. **Node.js (v20+ LTS or v22+):** Verify in PowerShell:
   ```powershell
   node -v
   ```
2. **pnpm (v9+ or v10+):** Verify in PowerShell:
   ```powershell
   pnpm -v
   ```
3. **VS Code:** With the official *JavaScript and TypeScript* extensions enabled.
4. **Windows Terminal:** Using PowerShell 7 or Windows PowerShell.

If `node -v` or `pnpm -v` reports an error (such as *"The term 'node' is not recognized"*), stop and consult your instructor or lab technician to install them before continuing.

---

## 3. Step-by-Step Project Setup

Let us build an isolated, clean workspace from scratch. Do not write this code inside your operating system's desktop or user root.

### Step 1: Open PowerShell and create a project directory
Open Windows Terminal or PowerShell and run:

```powershell
# Create a dedicated laboratory directory
mkdir C:\ite303-labs
cd C:\ite303-labs

# Create and enter your first project folder
mkdir hello-ts
cd hello-ts
```

### Step 2: Initialize the project (`package.json`)
Run `pnpm init` to create your project's manifest:

```powershell
pnpm init
```

**Why did that happen?**  
`pnpm init` creates a file named `package.json`. This file is the ID card of your project. It records your project name, scripts, and installed dependencies.

### Step 3: Install TypeScript and development tools
Run the following command in PowerShell:

```powershell
pnpm add -D typescript @types/node tsx
```

**What does this command mean?**
- `add`: Tells `pnpm` to download packages from the npm registry.
- `-D` (or `--save-dev`): Installs these as **development dependencies**. These tools help you write and run code while programming, but they are not needed in production when only compiled JavaScript is served.
- `typescript`: The official TypeScript compiler (`tsc`).
- `@types/node`: Type definitions that teach TypeScript about Node.js built-ins (such as `process`, `Buffer`, and file system APIs).
- `tsx`: A lightweight runner that runs `.ts` files directly without manual compile steps.

### Step 4: Initialize the TypeScript configuration (`tsconfig.json`)
Run:

```powershell
pnpm exec tsc --init
```

> [!NOTE]
> **Why `pnpm exec`?**  
> Because `tsc` was installed inside your project's local `node_modules/.bin` folder rather than globally on your computer, `pnpm exec` tells PowerShell: *"Find and run the `tsc` executable stored inside this project."*

This generates a `tsconfig.json` file. Let us inspect and adjust it to ensure strict type safety.

Open the folder in VS Code:
```powershell
code .
```

In VS Code, open `tsconfig.json`. Ensure the following core options are set (you can replace the contents with this clean configuration):

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

---

## 4. Writing Your First TypeScript Program

Now let us write real, typed code.

### Step 1: Create a `src` directory and `index.ts`
In PowerShell (or through VS Code's file explorer):

```powershell
mkdir src
New-Item src/index.ts
```

### Step 2: Add code with types and interfaces
Open `src/index.ts` in VS Code and type the following:

```typescript
// Define a clear data shape using a TypeScript interface
interface StudentRecord {
  id: number;
  fullName: string;
  course: string;
  yearLevel: number;
  isEnrolled: boolean;
}

// A function with explicit parameter and return types
function formatStudentBadge(student: StudentRecord): string {
  const status = student.isEnrolled ? "Active" : "On Leave";
  return `[${student.course}-${student.yearLevel}] ${student.fullName} (Status: ${status})`;
}

// Create sample data matching the interface
const studentOne: StudentRecord = {
  id: 101,
  fullName: "Maria Santos",
  course: "BSIT",
  yearLevel: 3,
  isEnrolled: true,
};

// Execute the function and log output to the terminal
console.log("=== ITE 303: Backend Environment Initialized ===");
console.log(formatStudentBadge(studentOne));
console.log("Program finished successfully.");
```

### Code Explanation: Line-by-Line

- **`interface StudentRecord`:** Tells TypeScript what properties every student object must have. If you forget `isEnrolled` or assign a string to `yearLevel`, TypeScript immediately underlines it in red in VS Code.
- **`student: StudentRecord`:** Enforces that `formatStudentBadge` only accepts objects that satisfy the `StudentRecord` contract.
- **`: string` after function parentheses:** Guarantees that this function will always return a string.
- **`console.log(...)`:** The standard method in Node.js to print text lines to your terminal screen.

---

## 5. Running the Program

You have two ways to execute your code during development:

### Method A: Direct execution via `pnpm exec tsx`
In your PowerShell terminal:

```powershell
pnpm exec tsx src/index.ts
```

### Expected Output
```text
=== ITE 303: Backend Environment Initialized ===
[BSIT-3] Maria Santos (Status: Active)
Program finished successfully.
```

> [!IMPORTANT]
> **Understanding `tsx` vs. Full Type-Checking (`tsc --noEmit`):**
> - **Static Type Checking:** TypeScript analyzes your code at edit/build time. It checks that variables, function parameters, and return types match your declared contracts *before* anything runs.
> - **Type Erasure:** Node.js cannot read TypeScript types. During transpilation, all types, interfaces, and annotations are stripped away, leaving pure JavaScript.
> - **What `tsx` does:** `tsx` is designed for speed and convenience during local development. It strips types on the fly and immediately runs the code in Node.js. However, **running a file with `tsx` does not perform a complete static type check across your project**. In some situations, `tsx` will execute code even if subtle type mismatches exist!
> - **How to perform a full type check:** When you want to verify that your entire project is strictly type-safe without emitting JavaScript files or starting the program, run:
>   ```powershell
>   pnpm exec tsc --noEmit
>   ```
>   The `--noEmit` flag tells the TypeScript compiler: *"Check every file for type errors according to `tsconfig.json`, but do not produce output `.js` files."*

### Method B: Using `package.json` scripts (Recommended)
Real projects don't require typing long terminal commands every time. Open your `package.json` and look at the `"scripts"` block. Add `"dev"` and `"build"`:

```json
{
  "name": "hello-ts",
  "version": "1.0.0",
  "description": "My first TypeScript backend program",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc"
  },
  "devDependencies": {
    "@types/node": "^20.17.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0"
  }
}
```

Now, run your script with:

```powershell
pnpm dev
```

`pnpm` automatically finds `tsx` inside `node_modules` and runs `src/index.ts` with the exact same output!

---

## 6. Process Control: Stopping & Restarting

Backend servers and long-running scripts frequently run indefinitely in your terminal until explicitly stopped.

Let us test a long-running process. Replace `src/index.ts` temporarily with a heartbeat:

```typescript
console.log("Server heartbeat simulation started. Press Ctrl+C to stop.");

let tick = 0;
const intervalId = setInterval(() => {
  tick++;
  console.log(`[Pulse ${tick}] System operational at: ${new Date().toLocaleTimeString()}`);
}, 2000);
```

Run it:
```powershell
pnpm dev
```

Notice that **PowerShell does not return to the command prompt (`PS C:\...>`)**. It stays occupied because Node.js is actively executing the interval loop.

### How to Stop a Running Program: `Ctrl + C`
1. Click inside your PowerShell terminal window.
2. Press `Ctrl` + `C` on your keyboard.
3. If prompted `Terminate batch job (Y/N)?`, type `Y` and press `Enter` (or pressing `Ctrl + C` twice immediately terminates it).
4. The program stops, memory is released, and your prompt `PS C:\ite303-labs\hello-ts>` returns.

---

## 7. Common Beginner Mistakes & How to Fix Them

### Mistake 1: Running the command outside the project folder
**Symptom:**
```text
Cannot find module 'C:\ite303-labs\src\index.ts'
```
**Cause:** You are in `C:\ite303-labs` instead of `C:\ite303-labs\hello-ts`.  
**Fix:** Run `pwd` to check your current working directory. Use `cd hello-ts` to enter the folder where `package.json` and `src/` exist.

### Mistake 2: PowerShell Script Execution Policy Error
**Symptom:**
```text
File ...\pnpm.ps1 cannot be loaded because running scripts is disabled on this system.
```
**Fix:** Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Then close and reopen your terminal.

### Mistake 3: TypeScript Type Error
**Symptom:** In VS Code or in `pnpm exec tsc`, you see:
```text
Type 'string' is not assignable to type 'number'.
```
**Cause:** You assigned `"three"` to `yearLevel` when your interface declared it as `number`.  
**Fix:** TypeScript prevented a runtime bug before your program even started. Change the value to a number (`3`).

---

## 8. Try It Yourself (Hands-On Exercise)

Now test your understanding by adding local Batanes tourism data to your program.

### Task:
1. Open `src/index.ts`.
2. Define a new interface named `Destination`:
   ```typescript
   interface Destination {
     id: number;
     name: string;
     municipality: "Basco" | "Mahatao" | "Ivana" | "Uyugan" | "Itbayat" | "Sabtang";
     isHeritageSite: boolean;
   }
   ```
3. Create an array of at least two destinations:
   ```typescript
   const destinations: Destination[] = [
     { id: 1, name: "Basco Lighthouse", municipality: "Basco", isHeritageSite: true },
     { id: 2, name: "Tayid Lighthouse", municipality: "Mahatao", isHeritageSite: false },
   ];
   ```
4. Write a function `displayDestinations(items: Destination[]): void` that loops through the array using `.forEach()` and logs each destination formatted nicely.
5. Run your script with `pnpm dev`.

### What Should Happen?
Your terminal should cleanly print both destination badges. If you accidentally misspell `"Basco"` as `"Manila"`, notice how TypeScript immediately warns you because `"Manila"` is not in the union of allowed municipalities!

---

## 9. Check Your Understanding

Answer these questions in your laboratory notebook:

1. **Why can't Node.js directly run TypeScript code without a transpiler or runner like `tsx`?**
2. **What is the difference between `dependencies` and `devDependencies` in `package.json`?**
3. **If your program enters an infinite loop or runs a server, what keyboard combination stops it?**
4. **Does saving a file in VS Code automatically change what is currently running in your terminal? Explain why or why not.**

---

## 10. "Before You Continue" Checklist

Do not move to the next lesson until you can check off every item:

- [ ] I can check `node -v` and `pnpm -v` in Windows PowerShell.
- [ ] I can initialize a new project with `pnpm init`.
- [ ] I can install `typescript`, `@types/node`, and `tsx` as dev dependencies.
- [ ] I can create and configure `tsconfig.json`.
- [ ] I know how to write a typed interface and function in `src/index.ts`.
- [ ] I can run my code using `pnpm dev`.
- [ ] I know how to press `Ctrl + C` to terminate a running terminal process.

---

## Next Step

Now that you can run backend TypeScript programs and inspect their terminal output, you are ready to understand **how client applications talk to servers across the network**.

👉 Proceed to **[Prerequisite 2: Understanding HTTP Requests & Responses](./http-requests-responses)**.
