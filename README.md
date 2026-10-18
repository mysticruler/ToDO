# ToolNest

ToolNest is a calm, frontend-only toolbox for everyday work. Everything runs in the browser: tasks, text utilities, calculators, file conversions, and media helpers stay on the user's device unless a future feature explicitly says otherwise.

## Features

- Public landing page with registry-driven tools, categories, search, favorites, recently used tools, and a command palette.
- Protected local demo authentication for the To-Do workspace, Profile, and Notes.
- To-Do dashboard with projects, priorities, persistence, and responsive navigation.
- Text, PDF, image, productivity, security, and calculator tools.
- Browser-only file processing for PDF, image, and text tools.

## Stack

- React with Vite
- JavaScript and CSS
- Lucide React icons
- Browser APIs: LocalStorage, Canvas, Clipboard, Web Speech, Notifications
- `pdfjs-dist`, `docx`, `qrcode`, and `jszip` for browser-only utilities

## Run

Requires Node.js 22 (`.nvmrc`).

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Test and build

```bash
npm run test
npm run build
```

## Demo login

```text
Login ID: mystic
Password: 1234
```

This project has no backend, API keys, or database configured. Account data, tasks, favorites, and notes use browser storage for the current demo. Do not use the demo authentication for production security.
