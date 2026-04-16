"use client";

import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import type { ProjectCategory, ProjectPlatform } from "@/types/project";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.scss";

interface ProjectRow {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ProjectCategory;
  platform?: ProjectPlatform;
  tags: string[];
  year: string;
  duration?: string;
  role?: string;
  status?: "live" | "in-progress" | "archived" | "concept";
  stack?: string[];
  highlights?: string[];
  problem?: string;
  solution?: string;
  metrics?: { label: string; value: string }[];
  links?: Record<string, string>;
  media: { thumbnail: string; gallery?: string[]; fit?: "cover" | "contain" };
  interaction?: "glitch" | "tilt" | "spotlight";
  layout?: "tall" | "wide" | "featured";
}

type ProjectApiPayload = Omit<ProjectRow, "longDescription" | "metrics"> & {
  long_description?: string;
};

const EMPTY_FORM: Omit<
  ProjectRow,
  "tags" | "stack" | "highlights" | "metrics" | "links" | "media"
> & {
  tags: string;
  stack: string;
  highlights: string;
  thumbnail: string;
} = {
  id: "",
  title: "",
  description: "",
  longDescription: "",
  category: "DEV",
  platform: undefined,
  tags: "",
  year: new Date().getFullYear().toString(),
  duration: "",
  role: "",
  status: undefined,
  stack: "",
  highlights: "",
  problem: "",
  solution: "",
  thumbnail: "",
  interaction: undefined,
  layout: undefined,
};

type FormState = typeof EMPTY_FORM;

const CATEGORIES: ProjectCategory[] = [
  "DEV",
  "VSCODE",
  "CREATIVE",
  "MAKER",
  "APPLE",
  "CODEPEN",
  "EXPERIMENT",
];
const PLATFORMS: ProjectPlatform[] = [
  "github",
  "figma",
  "notion",
  "codepen",
  "apple-shortcuts",
  "vscode-marketplace",
  "web",
];
const STATUSES = ["live", "in-progress", "archived", "concept"] as const;
const INTERACTIONS = ["glitch", "tilt", "spotlight"] as const;
const LAYOUTS = ["tall", "wide", "featured"] as const;

function rowToForm(row: ProjectRow): FormState {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.longDescription ?? "",
    category: row.category,
    platform: row.platform,
    tags: (row.tags ?? []).join(", "),
    year: row.year,
    duration: row.duration ?? "",
    role: row.role ?? "",
    status: row.status,
    stack: (row.stack ?? []).join(", "),
    highlights: (row.highlights ?? []).join(", "),
    problem: row.problem ?? "",
    solution: row.solution ?? "",
    thumbnail: row.media?.thumbnail ?? "",
    interaction: row.interaction,
    layout: row.layout,
  };
}

function formToRow(form: FormState): ProjectApiPayload {
  return {
    id: form.id.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    long_description: form.longDescription?.trim() || undefined,
    category: form.category,
    platform: form.platform || undefined,
    tags: form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    year: form.year.trim(),
    duration: form.duration?.trim() || undefined,
    role: form.role?.trim() || undefined,
    status: form.status || undefined,
    stack: form.stack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    highlights: form.highlights
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    problem: form.problem?.trim() || undefined,
    solution: form.solution?.trim() || undefined,
    links: {},
    media: { thumbnail: form.thumbnail.trim() },
    interaction: form.interaction || undefined,
    layout: form.layout || undefined,
  };
}

export default function AdminPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/projects");
    if (!res.ok) {
      setError("Failed to fetch projects");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    const handler = () => openAdd();
    window.addEventListener("terminal:admin:add", handler);
    return () => window.removeEventListener("terminal:admin:add", handler);
  }, []);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        setIsDemo(data.user?.email === "morty@c-137.com");
      });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(row: ProjectRow) {
    setForm(rowToForm(row));
    setEditingId(row.id);
    setFormError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormError(null);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value || undefined }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const isEdit = Boolean(editingId);

    if (isDemo) {
      const row: ProjectRow = {
        id: isEdit ? editingId! : `demo-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        longDescription: form.longDescription?.trim() || undefined,
        category: form.category,
        platform: form.platform || undefined,
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        year: form.year.trim(),
        duration: form.duration?.trim() || undefined,
        role: form.role?.trim() || undefined,
        status: form.status || undefined,
        stack: form.stack
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        highlights: form.highlights
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        problem: form.problem?.trim() || undefined,
        solution: form.solution?.trim() || undefined,
        links: {},
        media: { thumbnail: form.thumbnail.trim() },
        interaction: form.interaction || undefined,
        layout: form.layout || undefined,
      };
      if (isEdit) {
        setProjects((prev) => prev.map((p) => (p.id === editingId ? row : p)));
      } else {
        setProjects((prev) => [row, ...prev]);
      }
      setSaving(false);
      closeForm();
      return;
    }

    const payload = formToRow(form);
    const url = isEdit ? `/api/projects/${editingId}` : "/api/projects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setFormError(data.error ?? "Save failed");
      setSaving(false);
      return;
    }

    setSaving(false);
    closeForm();
    fetchProjects();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    if (isDemo) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget));
      setDeleting(false);
      setDeleteTarget(null);
      return;
    }

    const res = await fetch(`/api/projects/${deleteTarget}`, {
      method: "DELETE",
    });
    setDeleting(false);
    setDeleteTarget(null);
    if (res.ok || res.status === 204) {
      fetchProjects();
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.prompt}>root@idf-hub:~$</span>
          <h1 className={styles.title}>projects dashboard</h1>
        </div>
        <div className={styles.headerRight}>
          <Link href="/" className={styles.backBtn}>
            ← site
          </Link>
          <button
            className={styles.themeBtn}
            onClick={toggleTheme}
            title="Toggle theme"
          >
            {theme === "dark" ? "○ light" : "● dark"}
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            &gt; logout
          </button>
        </div>
      </header>

      {isDemo && (
        <div className={styles.demoBanner}>
          [C-137 MODE] Morty-level access — changes exist only in this dimension
          (session-only, nothing saved to DB)
        </div>
      )}

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <span className={styles.count}>
            {loading ? "..." : `${projects.length} projects`}
          </span>
          <button className={styles.addBtn} onClick={openAdd}>
            [ + add project ]
          </button>
        </div>

        {error && <div className={styles.errorBanner}>✗ {error}</div>}

        {loading ? (
          <div className={styles.loadingMsg}>
            <span className={styles.cursor}>_</span> loading...
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className={styles.tdMono}>{p.id}</td>
                    <td>{p.title}</td>
                    <td>
                      <span
                        className={`${styles.badge} ${styles[`badge${p.category}`]}`}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td className={styles.tdMono}>{p.year}</td>
                    <td>
                      {p.status && (
                        <span
                          className={`${styles.status} ${styles[`status_${p.status?.replace("-", "_")}`]}`}
                        >
                          {p.status}
                        </span>
                      )}
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => openEdit(p)}
                      >
                        edit
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteTarget(p.id)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Form modal */}
      {showForm && (
        <div
          className={styles.overlay}
          onClick={(e) => e.target === e.currentTarget && closeForm()}
        >
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <span className={styles.modalPrompt}>
                {editingId ? `editing: ${editingId}` : "┌── new project ──"}
              </span>
              <button className={styles.closeBtn} onClick={closeForm}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className={styles.formGrid}>
              <Field label="ID *" hint="slug (e.g. my-project)">
                <input
                  name="id"
                  value={form.id}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  disabled={Boolean(editingId)}
                  placeholder="project-slug"
                />
              </Field>

              <Field label="Title *">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </Field>

              <Field label="Description *" wide>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                  required
                  rows={2}
                />
              </Field>

              <Field label="Long Description" wide>
                <textarea
                  name="longDescription"
                  value={form.longDescription ?? ""}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={3}
                />
              </Field>

              <Field label="Category *">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Platform">
                <select
                  name="platform"
                  value={form.platform ?? ""}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">— none —</option>
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Year *">
                <input
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="2024"
                />
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={form.status ?? ""}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">— none —</option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Tags" hint="comma-separated" wide>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="React, TypeScript, Next.js"
                />
              </Field>

              <Field label="Stack" hint="comma-separated" wide>
                <input
                  name="stack"
                  value={form.stack}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="React, Supabase, Vercel"
                />
              </Field>

              <Field label="Thumbnail URL" wide>
                <input
                  name="thumbnail"
                  value={form.thumbnail}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="/projects/my-project/thumb.jpg"
                />
              </Field>

              <Field label="Role">
                <input
                  name="role"
                  value={form.role ?? ""}
                  onChange={handleChange}
                  className={styles.input}
                />
              </Field>

              <Field label="Duration">
                <input
                  name="duration"
                  value={form.duration ?? ""}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="4 weeks"
                />
              </Field>

              <Field label="Interaction">
                <select
                  name="interaction"
                  value={form.interaction ?? ""}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">— none —</option>
                  {INTERACTIONS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Layout">
                <select
                  name="layout"
                  value={form.layout ?? ""}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">— none —</option>
                  {LAYOUTS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Problem" wide>
                <textarea
                  name="problem"
                  value={form.problem ?? ""}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={2}
                />
              </Field>

              <Field label="Solution" wide>
                <textarea
                  name="solution"
                  value={form.solution ?? ""}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.textarea}`}
                  rows={2}
                />
              </Field>

              <Field label="Highlights" hint="comma-separated" wide>
                <input
                  name="highlights"
                  value={form.highlights}
                  onChange={handleChange}
                  className={styles.input}
                />
              </Field>

              {formError && (
                <div
                  className={`${styles.errorBanner} ${styles.formErrorBanner}`}
                >
                  ✗ {formError}
                </div>
              )}

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={closeForm}
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className={styles.saveBtn}
                  disabled={saving}
                >
                  {saving ? "..." : editingId ? "> update" : "> create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <div className={styles.overlay}>
          <div className={styles.confirm}>
            <p className={styles.confirmText}>
              delete <span className={styles.confirmId}>{deleteTarget}</span>?
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                cancel
              </button>
              <button
                className={styles.deleteConfirmBtn}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "..." : "> confirm delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  wide,
  children,
}: {
  label: string;
  hint?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <label className={styles.label}>
        {label}
        {hint && <span className={styles.hint}> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}
