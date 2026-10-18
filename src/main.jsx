import React, { lazy, memo, Suspense, useCallback, useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  Clock3,
  CheckCircle2,
  Star,
  FolderKanban,
  Settings,
  Plus,
  Search,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  X,
  Check,
  Command,
  Download,
  Upload,
  SlidersHorizontal,
  Flag,
  Menu,
  LogOut,
} from "lucide-react";
import "./styles.css";
import Profile from "./Profile.jsx";
import Landing from "./Landing.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import ToolNotFound from "./components/ToolNotFound.jsx";
import {recordRecent,toolByRoute} from "./registry/tools.js";
const Converter = lazy(() => import("./Converter.jsx"));
const Password = lazy(() => import("./tools/password/Password.jsx"));
const QR = lazy(() => import("./tools/qr/QR.jsx"));
const Pomodoro = lazy(() => import("./tools/pomodoro/Pomodoro.jsx"));
const ImageCompressor = lazy(() => import("./tools/image-compressor/ImageCompressor.jsx"));
const Notes = lazy(() => import("./tools/notes/Notes.jsx"));
const WordCounter = lazy(() => import("./tools/word-counter/WordCounter.jsx"));
const CaseConverter = lazy(() => import("./tools/case-converter/CaseConverter.jsx"));
const TextDiff = lazy(() => import("./tools/text-diff/TextDiff.jsx"));
const LoremIpsum = lazy(() => import("./tools/lorem-ipsum/LoremIpsum.jsx"));
const MarkdownEditor = lazy(() => import("./tools/markdown-editor/MarkdownEditor.jsx"));
const FindReplace = lazy(() => import("./tools/find-replace/FindReplace.jsx"));
const LineTools = lazy(() => import("./tools/line-tools/LineTools.jsx"));
const SlugGenerator = lazy(() => import("./tools/slug-generator/SlugGenerator.jsx"));
const TextToSpeech = lazy(() => import("./tools/text-to-speech/TextToSpeech.jsx"));
const SpeechToText = lazy(() => import("./tools/speech-to-text/SpeechToText.jsx"));
const JSONFormatter = lazy(() => import("./tools/json-formatter/JSONFormatter.jsx"));
const PasswordStrength = lazy(() => import("./tools/password-strength/PasswordStrength.jsx"));
const EMICalculator = lazy(() => import("./tools/emi-calculator/EMICalculator.jsx"));
const PercentageCalculator = lazy(() => import("./tools/percentage-calculator/PercentageCalculator.jsx"));
const VelocityRush = lazy(() => import("./tools/velocity-rush/VelocityRush.jsx"));

const seedProjects = [
  { id: "p1", name: "Personal", color: "#9b8cff" },
  { id: "p2", name: "Work", color: "#43d9b0" },
  { id: "p3", name: "Learning", color: "#ffb86b" },
];
const seedTasks = [
  {
    id: "t1",
    title: "Map out the next product milestone",
    description:
      "Turn the product vision into a focused plan for the next sprint.",
    completed: false,
    priority: "High",
    projectId: "p2",
    due: today(0),
    starred: true,
    tags: ["planning"],
    created: Date.now() - 86400000 * 2,
    subtasks: [
      { id: "s1", title: "Review customer notes", done: true },
      { id: "s2", title: "Draft milestone brief", done: false },
    ],
  },
  {
    id: "t2",
    title: "Morning run · 5 km",
    description: "Keep the streak alive.",
    completed: true,
    priority: "Medium",
    projectId: "p1",
    due: today(0),
    starred: false,
    tags: ["health"],
    created: Date.now() - 86400000 * 3,
    subtasks: [],
  },
  {
    id: "t3",
    title: "Read 20 pages of Deep Work",
    description: "",
    completed: false,
    priority: "Low",
    projectId: "p3",
    due: today(1),
    starred: false,
    tags: ["growth"],
    created: Date.now() - 86400000,
    subtasks: [],
  },
];
function today(add = 0) {
  let d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + add);
  return d.toISOString().slice(0, 10);
}
const uid = () => Math.random().toString(36).slice(2, 10);
function Login({ onLogin }) {
  const [id, setId] = useState(""),
    [password, setPassword] = useState(""),
    [loading, setLoading] = useState(false),
    [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (id === "mystic" && password === "1234") {
      setError("");
      setLoading(true);
      setTimeout(onLogin, 4000);
    } else setError("Use mystic / 1234");
  };
  return (
    <div className="login-screen">
      <div className="login-orb orb-one" />
      <div className="login-orb orb-two" />
      <div className="login-card">
        <div className="login-brand">
          <span className="logo">✦</span>
          <b>ToolNest</b>
        </div>
        <p className="eyebrow">WELCOME BACK</p>
        <h1>
          Make space for
          <br />
          <em>great work.</em>
        </h1>
        <p className="login-sub">Sign in to return to your calm workspace.</p>
        <form onSubmit={submit}>
          <label>
            Login ID
            <input
              autoFocus
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter your login ID"
              disabled={loading}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </label>
          {error && <div className="login-error">{error}</div>}
          <button
            className={"login-button " + (loading ? "is-loading" : "")}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="signing-scene" aria-hidden="true"><span className="runner">🏃</span><span className="room-door" /></span>
                Signing you in...
              </>
            ) : (
              <>
                Enter workspace <ChevronRight size={17} />
              </>
            )}
          </button>
        </form>
        <div className="demo-hint">
          Demo access <strong>mystic</strong>
          <span>·</span>
          <strong>1234</strong>
        </div>
      </div>
      <div className="login-footer">
        Private by design <span>•</span> Your tasks stay on this device
      </div>
    </div>
  );
}
function TodoApp({ initialView = "dashboard" }) {
  if (!sessionStorage.getItem("taskora_logged_in"))
    return (
      <Login
        onLogin={() => {
          sessionStorage.setItem("taskora_logged_in", "1");
          location.reload();
        }}
      />
    );
  const [tasks, setTasks] = useState(() => { const saved = load("taskora_tasks", seedTasks); return Array.isArray(saved) ? saved : seedTasks; }),
    [projects, setProjects] = useState(() => { const saved = load("taskora_projects", seedProjects); return Array.isArray(saved) ? saved : seedProjects; }),
    [view, setView] = useState(initialView),
    [query, setQuery] = useState(""),
    [modal, setModal] = useState(null),
    [sidebar, setSidebar] = useState(true),
    [sort, setSort] = useState("due"),
    [toast, setToast] = useState("");
  useEffect(
    () => localStorage.setItem("taskora_tasks", JSON.stringify(tasks)),
    [tasks],
  );
  useEffect(
    () => localStorage.setItem("taskora_projects", JSON.stringify(projects)),
    [projects],
  );
  useEffect(() => {
    let h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.querySelector(".search input")?.focus();
      }
      if (e.key === "Escape") setModal(null);
    };
    addEventListener("keydown", h);
    return () => removeEventListener("keydown", h);
  }, []);
  const notify = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 2400);
  };
  const counts = {
    all: tasks.filter((t) => !t.completed).length,
    today: tasks.filter((t) => t.due === today(0) && !t.completed).length,
    upcoming: tasks.filter((t) => t.due > today(0) && !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    important: tasks.filter((t) => t.starred && !t.completed).length,
    overdue: tasks.filter((t) => t.due < today(0) && !t.completed).length,
  };
  const filtered = useMemo(() => {
    let a = [...tasks];
    if (view === "active") a = a.filter((t) => !t.completed);
    if (view === "today") a = a.filter((t) => t.due === today(0));
    if (view === "upcoming")
      a = a.filter((t) => t.due > today(0) && !t.completed);
    if (view === "completed") a = a.filter((t) => t.completed);
    if (view === "important") a = a.filter((t) => t.starred);
    if (view === "overdue")
      a = a.filter((t) => t.due < today(0) && !t.completed);
    if (view.startsWith("project:"))
      a = a.filter((t) => t.projectId === view.split(":")[1]);
    if (query)
      a = a.filter((t) =>
        (t.title + " " + (t.description || "") + " " + (t.tags || []).join(" "))
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
    return a.sort((x, y) =>
      sort === "title"
        ? x.title.localeCompare(y.title)
        : sort === "priority"
          ? ["Urgent", "High", "Medium", "Low"].indexOf(x.priority) -
            ["Urgent", "High", "Medium", "Low"].indexOf(y.priority)
          : (x.due || "").localeCompare(y.due || ""),
    );
  }, [tasks, view, query, sort]);
  const toggle = useCallback((id) =>
    setTasks((ts) =>
      ts.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    ), []);
  const saveTask = (data) => {
    if (!data.title.trim()) return notify("Give your task a title first.");
    setTasks((ts) =>
      data.id
        ? ts.map((t) => (t.id === data.id ? { ...t, ...data } : t))
        : [
            {
              ...data,
              id: uid(),
              created: Date.now(),
              subtasks: data.subtasks || [],
              tags: data.tags || [],
            },
            ...ts,
          ],
    );
    setModal(null);
    notify(data.id ? "Task updated" : "Task added");
  };
  const remove = useCallback((id) => {
    if (!window.confirm("Delete this task? This cannot be undone.")) return;
    setTasks((ts) => ts.filter((t) => t.id !== id));
    setModal(null);
    notify("Task deleted");
  }, []);
  const addProject = () => {
    let name = prompt("Project name");
    if (name?.trim()) {
      setProjects((p) => [
        ...p,
        {
          id: uid(),
          name: name.trim(),
          color:
            "#" +
            Math.floor(Math.random() * 16777215)
              .toString(16)
              .padStart(6, "0"),
        },
      ]);
      notify("Project created");
    }
  };
  const title =
    view === "dashboard"
      ? "Good morning, Alex."
      : view === "all"
        ? "My tasks"
        : view === "active"
        ? "Active tasks"
        : view === "today"
          ? "Today's focus"
          : view === "upcoming"
            ? "Upcoming"
            : view === "completed"
              ? "Completed"
              : view === "important"
                ? "Important"
                : "Overdue";
  return (
    <div className="app">
      <aside className={sidebar ? "sidebar" : "sidebar collapsed"}>
        <div className="brand">
          <span className="logo">✦</span>
          {sidebar && (
            <>
              <b>ToolNest</b>
              <span className="beta">BETA</span>
            </>
          )}
        </div>
        <nav>
          <Nav
            icon={<LayoutDashboard />}
            text="Dashboard"
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          />
          <Nav
            icon={<Inbox />}
            text="My tasks"
            count={counts.all}
            active={view === "all" || view === "active"}
            onClick={() => setView("all")}
          />
          <Nav
            icon={<CalendarDays />}
            text="Today"
            count={counts.today}
            active={view === "today"}
            onClick={() => setView("today")}
          />
          <Nav
            icon={<Clock3 />}
            text="Upcoming"
            count={counts.upcoming}
            active={view === "upcoming"}
            onClick={() => setView("upcoming")}
          />
          <Nav
            icon={<CheckCircle2 />}
            text="Completed"
            count={counts.completed}
            active={view === "completed"}
            onClick={() => setView("completed")}
          />
          <Nav
            icon={<Star />}
            text="Important"
            count={counts.important}
            active={view === "important"}
            onClick={() => setView("important")}
          />
        </nav>
        {sidebar && (
          <>
            <div className="section-label">
              PROJECTS <button onClick={addProject}>+</button>
            </div>
            {projects.map((p) => (
              <Nav
                key={p.id}
                icon={<span className="dot" style={{ background: p.color }} />}
                text={p.name}
                active={view === "project:" + p.id}
                onClick={() => setView("project:" + p.id)}
              />
            ))}
          </>
        )}
        <div className="side-bottom">
          <Nav
            icon={<Settings />}
            text="Settings"
            onClick={() => setModal({ type: "settings" })}
          />
          <button className="logout-button" onClick={() => { sessionStorage.removeItem("taskora_logged_in"); location.reload(); }}><LogOut /><span>Log out</span></button>
          <button className="collapse" onClick={() => setSidebar(!sidebar)}>
            {sidebar ? <ChevronLeft /> : <ChevronRight />}
            {sidebar && "Collapse"}
          </button>
        </div>
      </aside>
      <main>
        <header>
          <button className="mobile-menu" onClick={() => setSidebar(!sidebar)}>
            <Menu />
          </button>
          <div className="crumb">
            Workspace <span>/</span> {title}
          </div>
          <div className="header-actions">
            <label className="search">
              <Search size={17} />
              <input
                placeholder="Search tasks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>
            <button className="avatar" onClick={() => setView("profile")} aria-label="Open profile">AS</button>
          </div>
        </header>
        {view === "profile" ? (
          <Profile tasks={tasks} onBack={() => setView("dashboard")} notify={notify} onLogout={() => { sessionStorage.removeItem("taskora_logged_in"); location.reload(); }} />
        ) : view === "dashboard" ? (
          <Dashboard
            tasks={tasks}
            counts={counts}
            onView={setView}
            onAdd={() => setModal({ type: "task" })}
            onToggle={toggle}
            onEdit={(t) => setModal({ type: "task", task: t })}
            onDelete={remove}
            projects={projects}
          />
        ) : (
          <section className="workspace">
            <div className="page-head">
              <div>
                <p className="eyebrow">
                  {view === "all" || view === "active" ? "YOUR WORKSPACE" : "FOCUS VIEW"}
                </p>
                <h1>{title}</h1>
                <p className="sub">
                  {filtered.length} {filtered.length === 1 ? "task" : "tasks"}{" "}
                  in this view
                </p>
              </div>
              <button
                className="primary"
                onClick={() => setModal({ type: "task" })}
              >
                <Plus size={18} /> Add task
              </button>
            </div>
            <div className="toolbar task-toolbar">
              <div className="task-filters" role="tablist" aria-label="Task status filters">
                {[['all','All'],['active','Active'],['completed','Completed']].map(([key,label]) => <button key={key} className={view === key ? "active" : ""} onClick={() => setView(key)} role="tab" aria-selected={view === key}>{label}<span>{key === 'all' ? tasks.length : key === 'active' ? tasks.filter(t => !t.completed).length : counts.completed}</span></button>)}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tasks">
                <option value="due">Sort by due date</option>
                <option value="priority">Sort by priority</option>
                <option value="title">Sort by title</option>
              </select>
            </div>
            <TaskList
              tasks={filtered}
              projects={projects}
              onToggle={toggle}
              onEdit={(t) => setModal({ type: "task", task: t })}
              onDelete={remove}
              onNotify={notify}
            />
          </section>
        )}
      </main>
      {modal?.type === "task" && (
        <TaskModal
          task={modal.task}
          projects={projects}
          onClose={() => setModal(null)}
          onSave={saveTask}
        />
      )}{" "}
      {modal?.type === "settings" && (
        <SettingsModal
          tasks={tasks}
          setTasks={setTasks}
          onClose={() => setModal(null)}
          onNotify={notify}
        />
      )}{" "}
      {toast && (
        <div className="toast">
          <Check size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
function load(k, f) {
  try {
    return JSON.parse(localStorage.getItem(k)) || f;
  } catch {
    return f;
  }
}
function Nav({ icon, text, count, active, onClick }) {
  return (
    <button className={"nav " + (active ? "active" : "")} onClick={onClick}>
      {icon}
      <span>{text}</span>
      {count != null && <small>{count}</small>}
    </button>
  );
}
function Dashboard({
  tasks,
  counts,
  onView,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
  projects,
}) {
  let done = tasks.filter((t) => t.completed).length,
    pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <section className="dashboard">
      <div className="hero">
        <div>
          <p className="eyebrow">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
          <h1>
            Make space for <em>great work.</em>
          </h1>
          <p className="sub">Keep track of today so you can enjoy tomorrow.</p>
        </div>
        <button className="primary" onClick={onAdd}>
          <Plus size={18} /> New task
        </button>
      </div>
      <div className="stat-grid">
        <Stat
          label="Open tasks"
          value={counts.all}
          hint="Across your workspace"
        />
        <Stat label="Due today" value={counts.today} hint="Keep the momentum" />
        <Stat
          label="Completed"
          value={counts.completed}
          hint="All time progress"
        />
        <div className="stat progress">
          <div>
            <span>Completion rate</span>
            <strong>{pct}%</strong>
          </div>
          <div className="ring" style={{ "--pct": pct + "%" }}>
            <i>{pct}%</i>
          </div>
        </div>
      </div>
      <div className="dash-grid">
        <div className="card">
          <div className="card-head">
            <div>
              <p className="eyebrow">YOUR DAY</p>
              <h2>Today's focus</h2>
            </div>
            <button onClick={() => onView("today")} className="link">
              View all <ChevronRight size={15} />
            </button>
          </div>
          <TaskList
            tasks={tasks.filter((t) => t.due === today(0))}
            projects={projects}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            compact
          />
        </div>
        <div className="card activity">
          <div className="card-head">
            <div>
              <p className="eyebrow">MOMENTUM</p>
              <h2>Weekly activity</h2>
            </div>
          </div>
          <div className="bars">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div className="bar-col" key={i}>
                <div
                  className="bar"
                  style={{ height: 25 + ((i * 17) % 65) + "%" }}
                />
                <span>{d}</span>
              </div>
            ))}
          </div>
          <p className="muted">
            Small steps compound into remarkable progress.
          </p>
        </div>
      </div>
    </section>
  );
}
function Stat({ label, value, hint }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  );
}
function TaskList({ tasks, projects, onToggle, onEdit, onDelete, compact }) {
  const projectById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  return (
    <div className="task-list">
      {!tasks.length ? (
        <div className="empty">
          <div>✦</div>
          <h3>Nothing here yet</h3>
          <p>Your clear space is an invitation to begin.</p>
        </div>
      ) : (
        tasks.map((t) => (
          <Task
            key={t.id}
            t={t}
            project={projectById.get(t.projectId)}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            compact={compact}
          />
        ))
      )}
    </div>
  );
}
const Task = memo(function Task({ t, project, onToggle, onEdit, onDelete, compact }) {
  return (
    <article className={"task " + (t.completed ? "is-done" : "")}>
      <button
        className="check"
        onClick={() => onToggle(t.id)}
        aria-label="Toggle task"
      >
        {t.completed && <Check size={14} />}
      </button>
      <div className="task-main" onClick={() => onEdit(t)}>
        <div className="task-title">
          {t.title}
          {t.starred && <Star className="star-fill" size={14} />}
        </div>
        {!compact && t.description && <p>{t.description}</p>}
        <div className="meta">
          <span className={"priority " + t.priority.toLowerCase()}>
            <Flag size={11} />
            {t.priority}
          </span>
          {t.due && (
            <span className={t.due < today(0) && !t.completed ? "overdue" : ""}>
              <CalendarDays size={12} />
              {t.due === today(0) ? "Today" : t.due}
            </span>
          )}
          {project && (
            <span>
              <i className="dot" style={{ background: project.color }} />
              {project.name}
            </span>
          )}
          {t.subtasks?.length > 0 && (
            <span>
              {t.subtasks.filter((s) => s.done).length}/{t.subtasks.length}{" "}
              subtasks
            </span>
          )}
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => onEdit(t)} aria-label="Edit">
          <Edit3 size={15} />
        </button>
        <button onClick={() => onDelete(t.id)} aria-label="Delete">
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
});
function TaskModal({ task, projects, onClose, onSave }) {
  const [f, setF] = useState(task || { title: "", description: "", priority: "Medium", projectId: projects[0]?.id, due: "", completed: false, starred: false, tags: [], subtasks: [] });
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const upd = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const submit = (event) => { event.preventDefault(); if (submitting) return; const title = f.title.trim(); if (!title) { setError("A task title is required."); return; } setError(""); setSubmitting(true); onSave({ ...f, title, description: f.description.trim() }); };
  return (
    <div className="overlay"><form className="modal" onSubmit={submit}>
      <div className="modal-head"><div><p className="eyebrow">{task ? "EDIT TASK" : "QUICK CAPTURE"}</p><h2>{task ? "Refine task" : "What needs doing?"}</h2></div><button type="button" onClick={onClose} aria-label="Close task editor"><X /></button></div>
      <label>Title<input autoFocus required value={f.title} onChange={(e) => { setError(""); upd("title", e.target.value); }} placeholder="e.g. Prepare quarterly review" /></label>
      <label>Description<textarea value={f.description || ""} onChange={(e) => upd("description", e.target.value)} placeholder="Add a little more context..." /></label>
      <div className="form-row"><label>Priority<select value={f.priority || "Medium"} onChange={(e) => upd("priority", e.target.value)}>{["Low", "Medium", "High", "Urgent"].map((x) => <option key={x}>{x}</option>)}</select></label><label>Due date<input type="date" value={f.due || ""} onChange={(e) => upd("due", e.target.value)} /></label></div>
      <div className="form-row"><label>Project<select value={f.projectId || ""} onChange={(e) => upd("projectId", e.target.value)}><option value="">No project</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label className="check-label"><input type="checkbox" checked={Boolean(f.completed)} onChange={(e) => upd("completed", e.target.checked)} /> Completed</label></div>
      <label className="check-label"><input type="checkbox" checked={Boolean(f.starred)} onChange={(e) => upd("starred", e.target.checked)} /> Mark important</label>
      <label>Tags<div className="tag-input"><input value={tag} onChange={(e) => setTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (tag.trim() && !(f.tags || []).includes(tag.trim())) { upd("tags", [...(f.tags || []), tag.trim()]); setTag(""); } } }} placeholder="Type a tag, press Enter" />{(f.tags || []).map((x) => <span key={x}>{x}<button type="button" onClick={() => upd("tags", f.tags.filter((t) => t !== x))} aria-label={`Remove ${x}`}>×</button></span>)}</div></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="modal-foot"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button type="submit" className="primary" disabled={submitting}>{task ? "Save changes" : "Add task"} <Command size={14} /></button></div>
    </form></div>
  );
}

function SettingsModal({ tasks, setTasks, onClose, onNotify }) {
  let exportData = () => {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" }),
    );
    a.download = "todo-backup.json";
    a.click();
    onNotify("Backup exported");
    onClose();
  };
  return (
    <div className="overlay">
      <div className="modal settings">
        <div className="modal-head">
          <div>
            <p className="eyebrow">WORKSPACE</p>
            <h2>Settings</h2>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="setting">
          <div>
            <b>Keyboard shortcuts</b>
            <p>⌘ K opens quick search · Enter saves tasks</p>
          </div>
          <kbd>⌘ K</kbd>
        </div>
        <div className="setting">
          <div>
            <b>Data portability</b>
            <p>Keep a local backup of your ToolNest workspace.</p>
          </div>
          <button className="secondary" onClick={exportData}>
            <Download size={15} /> Export JSON
          </button>
        </div>
        <div className="setting danger">
          <div>
            <b>Clear workspace</b>
            <p>This permanently removes all local tasks.</p>
          </div>
          <button
            className="secondary"
            onClick={() => {
              if (confirm("Clear all tasks?")) {
                setTasks([]);
                onNotify("Workspace cleared");
                onClose();
              }
            }}
          >
            Clear data
          </button>
        </div>
      </div>
    </div>
  );
}
function RouterApp() {
  const loggedIn = Boolean(sessionStorage.getItem("taskora_logged_in"));
  const profile = (() => { try { return JSON.parse(localStorage.getItem("todo_profile")) || { displayName: "Mystic" }; } catch { return { displayName: "Mystic" }; } })();
  const [route, setRoute] = useState(window.location.pathname + window.location.search);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const go = (target) => { const clean = target.split("?")[0]; if (clean !== "/" && clean !== "/login") recordRecent(clean); window.history.pushState({}, "", target); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo(0, 0); };
  useEffect(() => { const update = () => setRoute(window.location.pathname + window.location.search); addEventListener("popstate", update); return () => removeEventListener("popstate", update); }, []);
  useEffect(() => { const key = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); } }; addEventListener("keydown", key); return () => removeEventListener("keydown", key); }, []);
  useEffect(() => { const current = route.split("?")[0], tool = toolByRoute(current); document.title = tool ? `${tool.title} · ToolNest` : "ToolNest"; let meta = document.querySelector('meta[name="description"]'); if (!meta) { meta=document.createElement("meta"); meta.name="description"; document.head.appendChild(meta); } meta.content = tool?.description || "A calm collection of useful browser tools."; }, [route]);
  useEffect(() => { const link = document.querySelector('link[rel="icon"]'); if (!link) return; const canvas=document.createElement("canvas");canvas.width=64;canvas.height=64;const ctx=canvas.getContext("2d");let angle=0;const draw=()=>{ctx.clearRect(0,0,64,64);ctx.fillStyle="#111426";ctx.beginPath();ctx.roundRect(0,0,64,64,18);ctx.fill();const g=ctx.createLinearGradient(7,7,57,57);g.addColorStop(0,"#b7adff");g.addColorStop(.5,"#6758d1");g.addColorStop(1,"#43d9b0");ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(7,7,50,50,15);ctx.fill();ctx.save();ctx.translate(32,32);ctx.rotate(angle);ctx.fillStyle="#fff";ctx.beginPath();for(let i=0;i<8;i++){const r=i%2?7:20,a=-Math.PI/2+i*Math.PI/4;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r)}ctx.closePath();ctx.fill();ctx.restore();ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(32,32,3,0,Math.PI*2);ctx.fill();link.href=canvas.toDataURL("image/png");angle+=Math.PI/24};draw();const timer=setInterval(draw,80);return()=>clearInterval(timer)},[]);
  const current = route.split("?")[0];
  const fallback = <div className="tool-page"><div className="converter-card"><p className="sub">Loading tool...</p></div></div>;
  const overlay = (page) => <><CommandPalette open={paletteOpen} onClose={()=>setPaletteOpen(false)} onNavigate={go}/>{page}</>;
  if (current === "/login") { if (loggedIn) { window.location.replace("/"); return null; } const redirect = new URLSearchParams(window.location.search).get("redirect") || "/"; return overlay(<Login onLogin={() => { sessionStorage.setItem("taskora_logged_in", "1"); go(redirect); }} />); }
  if (current === "/converter") return overlay(<Suspense fallback={fallback}><Converter onBack={() => go("/")} notify={() => {}} /></Suspense>);
  if (["/password","/qr","/pomodoro","/image-compressor"].includes(current)) return overlay(<Suspense fallback={fallback}>{current === "/password" ? <Password onBack={() => go("/")} /> : current === "/qr" ? <QR onBack={() => go("/")} /> : current === "/pomodoro" ? <Pomodoro onBack={() => go("/")} /> : <ImageCompressor onBack={() => go("/")} />}</Suspense>);
  const textTools = {"/word-counter":WordCounter,"/case-converter":CaseConverter,"/text-diff":TextDiff,"/lorem-ipsum":LoremIpsum,"/markdown-editor":MarkdownEditor,"/find-replace":FindReplace,"/line-tools":LineTools,"/slug-generator":SlugGenerator,"/text-to-speech":TextToSpeech,"/speech-to-text":SpeechToText ,"/json-formatter":JSONFormatter,"/password-strength":PasswordStrength,"/emi-calculator":EMICalculator,"/percentage-calculator":PercentageCalculator};
  if (textTools[current]) { const Tool = textTools[current]; return overlay(<Suspense fallback={fallback}><Tool onBack={() => go("/")} /></Suspense>); }
  if (current === "/velocity-rush") return overlay(<Suspense fallback={fallback}><VelocityRush onBack={() => go("/")} /></Suspense>);
  if (current === "/todo" || current === "/profile") return overlay(<ProtectedRoute loggedIn={loggedIn} path={current}><TodoApp initialView={current === "/profile" ? "profile" : "dashboard"} /></ProtectedRoute>);
  if (current === "/notes") return overlay(<ProtectedRoute loggedIn={loggedIn} path={current}><Suspense fallback={fallback}><Notes onBack={() => go("/")} /></Suspense></ProtectedRoute>);
  const registered = toolByRoute(current); if (current !== "/" && registered) return overlay(<ToolNotFound onBack={() => go("/")} />); if (current !== "/") return overlay(<ToolNotFound onBack={() => go("/")} />);
  return overlay(<Landing loggedIn={loggedIn} profile={profile} onNavigate={go} onLogout={() => { sessionStorage.removeItem("taskora_logged_in"); go("/"); }} />);
}
class AppErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() { return this.state.error ? <div className="tool-page"><div className="converter-card"><p className="eyebrow">APP ERROR</p><h1>Something went wrong</h1><p className="sub">{this.state.error.message}</p><button className="primary" onClick={() => location.reload()}>Reload app</button></div></div> : this.props.children; }
}
createRoot(document.getElementById("root")).render(<AppErrorBoundary><RouterApp /></AppErrorBoundary>);
