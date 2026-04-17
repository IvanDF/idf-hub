"use client";

import { useTheme } from "@/context/ThemeContext";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminDeleteConfirm } from "./_components/AdminDeleteConfirm";
import { AdminProjectForm } from "./_components/AdminProjectForm";
import { AdminProjectsTable } from "./_components/AdminProjectsTable";
import { EMPTY_FORM } from "./_components/admin.constants";
import type { FormState, ProjectRow } from "./_components/admin.types";
import { formToRow, rowToForm } from "./_components/admin.utils";
import styles from "./page.module.scss";

/** Projects admin dashboard — manages state and delegates rendering to sub-components. */
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
    setProjects(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  useEffect(() => {
    const handler = () => openAdd();
    window.addEventListener("terminal:admin:add", handler);
    return () => window.removeEventListener("terminal:admin:add", handler);
  }, []);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setIsDemo(data.user?.email === "morty@c-137.com"));
  }, []);

  async function handleLogout() {
    await createClient().auth.signOut();
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      const row = { ...formToRow(form), id: isEdit ? editingId! : `demo-${Date.now()}` } as ProjectRow;
      setProjects((prev) =>
        isEdit ? prev.map((p) => (p.id === editingId ? row : p)) : [row, ...prev],
      );
      setSaving(false);
      closeForm();
      return;
    }

    const res = await fetch(
      isEdit ? `/api/projects/${editingId}` : "/api/projects",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formToRow(form)),
      },
    );

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
    const res = await fetch(`/api/projects/${deleteTarget}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    if (res.ok || res.status === 204) fetchProjects();
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.prompt}>root@idf-hub:~$</span>
          <h1 className={styles.title}>projects dashboard</h1>
        </div>
        <div className={styles.headerRight}>
          <Link href="/" className={styles.backBtn}>← site</Link>
          <button className={styles.themeBtn} onClick={toggleTheme} title="Toggle theme">
            {theme === "dark" ? "○ light" : "● dark"}
          </button>
          <button className={styles.logoutBtn} onClick={handleLogout}>&gt; logout</button>
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
          <span className={styles.count}>{loading ? "..." : `${projects.length} projects`}</span>
          <button className={styles.addBtn} onClick={openAdd}>[ + add project ]</button>
        </div>

        <AdminProjectsTable
          projects={projects}
          loading={loading}
          error={error}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          isDemo={isDemo}
        />
      </main>

      {showForm && (
        <AdminProjectForm
          form={form}
          editingId={editingId}
          saving={saving}
          formError={formError}
          isDemo={isDemo}
          onChange={handleChange}
          onSubmit={handleSave}
          onClose={closeForm}
        />
      )}

      <AdminDeleteConfirm
        targetId={deleteTarget}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
