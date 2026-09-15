# Development workflow

## Delivery loop

1. Inspect status, source, dependencies, and applicable instructions.
2. Define one user-visible outcome, affected files, and acceptance criteria.
3. Implement the smallest coherent change. Keep content imports separate from interface changes and dependency upgrades.
4. Review the diff for content preservation, security, accessibility, and unrelated edits.
5. Run checks appropriate to the change, record results, then commit that feature/update.
6. Report the commit and next step. Repeat for the next feature.

## Commands and verification

Use the package manager version in `package.json`; do not mix lockfiles.

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

- Run installation only when dependencies need provisioning. A lockfile failure needs investigation, not a blind regeneration.
- Documentation-only changes: inspect content, relative links, and `git diff --check`; no app build needed.
- App/config changes: lint, typecheck, and production build. Separate pre-existing failures from regressions. Do not claim a feature verified with outstanding relevant failures.
- UI/content routing changes: also open affected routes in a browser, test navigation and mobile layout, inspect console errors, and verify keyboard use. A successful build alone is insufficient.
- Add focused behavior tests for access control, progress persistence, imports, and substantive logic. Avoid tests that merely duplicate implementation.
- The existing `test-sidebar.mjs` prints diagnostics; it is not an assertion-based passing test suite.
- Never execute handout snippets against production resources. Use isolated fixtures for examples when practical.

## Git policy

- One completed feature or coherent update per commit. Examples: `feat(ite303): add chapter 2 navigation`, `fix(ui): restore keyboard focus`, `docs(dev): define agent workflow`.
- Inspect staged changes before committing. Stage explicit paths or selected hunks; avoid `git add .` in a dirty workspace.
- Do not bundle the existing uncommitted Nextra migration into a new setup commit. If a future feature depends on it, inspect and verify a separate baseline commit first.
- Never amend someone else's commit, discard changes, force-push, or rewrite history as routine cleanup.
- If Git rejects repository ownership, a command-scoped `git -c safe.directory=C:/nextjs-projects/ts/learn ...` avoids changing global trust settings.
- If the environment blocks a commit, request the required permission and report the actual result. Do not claim an uncreated commit.

## Maintainability and security

- Prefer server rendering for lesson content; use client components only for interaction.
- Reuse layout and design tokens across subjects; isolate subject content and identifiers.
- Document meaningful architectural decisions and package changes with their reason.
- Never store secrets in `NEXT_PUBLIC_*`. Use environment configuration and sanitized fixtures.
- Future Markdown editing must render sanitized content; do not execute arbitrary uploaded MDX/JavaScript.
- Future database changes require reviewed migrations, repeatable imports, and backup/rollback planning. Do not seed by overwriting instructor edits.
- Do not hide failing checks, weaken lint/type rules, or patch dependencies to make tests pass without explaining the underlying issue.

## Automation rollout

Current setup documents local quality gates; it does not install hooks or CI enforcement.
Once the existing application baseline is verified and committed, add CI for frozen installation, lint, typecheck, and build. Add browser tests as real workflows land. Keep CI aligned with verified Node/pnpm versions and repository secrets.

## Task handoff template

```text
Outcome:
Scope / owned files:
Acceptance criteria:
Content sources:
Checks and results:
Commit:
Remaining work:
```
