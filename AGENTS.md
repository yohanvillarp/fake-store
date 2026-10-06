# Project: fake-store

Refer to [GEMINI.md](file:///c:/Users/yohan/myspace/lab/active/fake-store/GEMINI.md) for full project specifications, architecture guidelines, and commands.

## Key Rules for AI Agents
1. **Architecture**: Feature-Sliced Design (FSD 2.1). Layers in order: `app` -> `pages` -> `widgets` -> `features` -> `entities` -> `shared`.
2. **Path Aliases**: Always use `@/*` pointing to `src/*`. Avoid relative import traversal (`../../`).
3. **Public API**: Always export and import via the slice/layer `index.ts`.
4. **Styling**: Tailwind CSS v4 in `@/app/styles/index.css`.
5. **Commands**: Always prefix terminal commands with `cd c:\Users\yohan\myspace\lab\active\fake-store ; <command>` due to the PowerShell profile startup path.
6. **Data Flow & Backend**: Live orders from React (`POST /api/orders`) process through Vercel Serverless into PostgreSQL (`Orders`, `Items`, `Payments` via SQL transaction), structured to integrate with historical Olist data in Power BI.
