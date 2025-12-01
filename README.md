
**Todo App (Vite + React)**

- **Description:** This is a lightweight single-page Todo application built with React and Vite. It provides a responsive task list with scheduling and category support, a small notes area, and a top navigation bar. The app stores tasks and notes in the browser's `localStorage` so your data persists between page reloads.

**Features**
- **Add / Delete / Toggle:** Create tasks, mark them done/undone, and delete tasks.
- **Scheduled Time:** Optionally attach a scheduled datetime to a task and filter for Upcoming or Overdue tasks.
- **Category:** Assign categories (Personal, Work, Shopping, Study, Other) with simple icons.
- **Modal Add:** A small modal collects scheduled time and category when adding a task.
- **Responsive UI:** Desktop table view (with scheduled time displayed under the task title) and mobile card view.
- **Persistence:** Tasks and Notes save to `localStorage` automatically.

**Tech Stack**
- **Framework:** React (Vite)
- **Bundler / Dev Server:** Vite
- **Styling:** Local CSS files (components include `Navbar.css` and `ListPage.css`). Tailwind was tried but the project currently uses local CSS as a stable fallback.

**Run locally**
- Install dependencies:

```
npm install
```
- Run the dev server (PowerShell / Windows):

```
npm run dev
```

Open the app in the browser at the address shown by Vite (usually `http://localhost:5173`).

**Notes & Tips**
- Data is saved to `localStorage` keys `tasks` and `notes`. Clearing browser storage will remove saved tasks.
- If you want to enable Tailwind in this project, install the adapter and tooling locally and update `postcss.config.cjs` as suggested by Tailwind's runtime messages. Example install (dev deps):

```
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
npx tailwindcss init -p
```

- After enabling Tailwind, you can revert component styles to Tailwind utilities if desired.

**Icons**
- This project now uses Heroicons for the navbar icons. Install them locally with:

```
npm install @heroicons/react
```

After installing, the icons will render as standard React components used by `src/Components/Navbar.jsx`.

**Files of interest**
- `src/Components/ListPage.jsx` — main todo UI and logic
- `src/Components/ListPage.css` — list/table/card styles and responsive rules
- `src/Components/Navbar.jsx` & `src/Components/Navbar.css` — top navigation
- `src/index.css` — global CSS (Tailwind directives were added in a draft but local CSS is used as fallback)

**License & Contributing**
- This is a small demo project — feel free to open issues or send PRs for improvements. If you want, I can add a contributing guide and tests.

