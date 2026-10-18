import React, { useMemo, useState } from "react";
import { Check, LogOut, Mail, Pencil, Save, UserRound, X } from "lucide-react";

const PROFILE_KEY = "todo_profile";
const DEFAULT_PROFILE = {
  displayName: "Mystic",
  email: "mystic@example.com",
  photoUrl: "",
  joinedAt: "2026-10-18T00:00:00.000Z",
};

export function readProfile() {
  try {
    return { ...DEFAULT_PROFILE, ...(JSON.parse(localStorage.getItem(PROFILE_KEY)) || {}) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function Profile({ tasks, onLogout, onBack, notify }) {
  const [profile, setProfile] = useState(readProfile);
  const [name, setName] = useState(profile.displayName);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.completed).length,
    pending: tasks.filter((task) => !task.completed).length,
  }), [tasks]);
  const initials = profile.displayName.trim().slice(0, 2).toUpperCase() || "M";
  const saveName = (event) => {
    event.preventDefault();
    const displayName = name.trim();
    if (!displayName) return setError("Display name cannot be empty.");
    setSaving(true);
    setError("");
    // The current app uses local auth, so this is the local auth-profile store.
    // Replace this one persistence call with the backend auth update when connected.
    window.setTimeout(() => {
      const next = { ...profile, displayName };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      setProfile(next);
      setEditing(false);
      setSaving(false);
      notify("Profile updated");
    }, 450);
  };
  return <section className="profile-page">
    <div className="page-head profile-head"><div><p className="eyebrow">ACCOUNT</p><h1>Your profile</h1><p className="sub">Manage your personal details and productivity snapshot.</p></div><button className="secondary" onClick={onBack}>Back to workspace</button></div>
    <div className="profile-grid">
      <div className="card profile-card"><div className="profile-identity"><div className="profile-avatar">{profile.photoUrl ? <img src={profile.photoUrl} alt="Profile"/> : initials}</div><div><h2>{profile.displayName}</h2><p><Mail size={14}/>{profile.email}</p></div></div><div className="profile-meta"><span>Member since</span><strong>{new Date(profile.joinedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong></div>{editing ? <form className="profile-form" onSubmit={saveName}><label>Display name<input autoFocus value={name} onChange={(event)=>setName(event.target.value)} aria-invalid={Boolean(error)}/></label>{error && <p className="form-error">{error}</p>}<div className="profile-actions"><button type="button" className="secondary" onClick={()=>{setName(profile.displayName);setEditing(false)}}><X size={15}/> Cancel</button><button className="primary" disabled={saving}>{saving ? "Saving..." : <><Save size={15}/> Save name</>}</button></div></form> : <button className="secondary edit-profile" onClick={()=>setEditing(true)}><Pencil size={15}/> Edit display name</button>}</div>
      <div className="card profile-stats"><p className="eyebrow">YOUR ACTIVITY</p><h2>Task snapshot</h2><div className="profile-stat-list"><div><span>Total tasks</span><strong>{stats.total}</strong></div><div><span>Completed</span><strong className="green">{stats.completed}</strong></div><div><span>Pending</span><strong className="violet">{stats.pending}</strong></div></div></div>
    </div>
    <div className="card profile-security"><div><p className="eyebrow">SESSION</p><h2>Sign out of ToolNest</h2><p className="sub">You can sign back in any time with your demo credentials.</p></div><button className="logout-button profile-logout" onClick={onLogout}><LogOut size={16}/> Log out</button></div>
  </section>;
}
