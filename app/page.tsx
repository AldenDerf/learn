import Link from "next/link";

const subjects = [
  {
    code: "ITE 303",
    title: "Web Systems and Technologies 2",
    description:
      "TypeScript, scalable REST APIs, databases, backend security, and reactive web interfaces.",
    href: "/web-systems",
    current: true,
  },
  {
    code: "ITM 402",
    title: "System Administration and Maintenance",
    description:
      "Linux systems, users and permissions, networking services, remote access, and maintenance.",
    href: "/sys-admin",
    current: false,
  },
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-12 text-slate-100 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
            Student learning platform
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Learn with clear lessons and practical labs.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Access course handouts, code examples, and laboratory activities for your enrolled subjects.
          </p>
        </header>

        <section aria-labelledby="subjects-heading" className="mt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-sky-300">Academic resources</p>
              <h2 id="subjects-heading" className="mt-1 text-2xl font-semibold text-white">
                Choose a subject
              </h2>
            </div>
            <p className="text-sm text-slate-400">Use Ctrl + K inside a subject to search its handouts.</p>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {subjects.map((subject) => (
              <article
                key={subject.code}
                className="flex flex-col rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-xl shadow-black/10"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-sky-400/10 px-3 py-1 text-sm font-semibold text-sky-300">
                    {subject.code}
                  </span>
                  {subject.current && (
                    <span className="rounded-full border border-emerald-500/40 px-3 py-1 text-sm text-emerald-300">
                      Current focus
                    </span>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{subject.title}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-300">{subject.description}</p>
                <Link
                  href={subject.href}
                  className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-300"
                >
                  Open {subject.code}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
