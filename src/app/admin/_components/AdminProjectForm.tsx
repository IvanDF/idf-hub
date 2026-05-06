"use client";

import styles from "../page.module.scss";
import { CATEGORIES, INTERACTIONS, LAYOUTS, PLATFORMS, STATUSES } from "./admin.constants";
import type { FormState } from "./admin.types";

type ChangeHandler = React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

/** Props for the `AdminProjectForm` modal component. */
export interface AdminProjectFormProps {
  /** Current form field values. */
  form: FormState;
  /** ID of the project being edited, or `null` when adding a new project. */
  editingId: string | null;
  /** Whether the save request is in-flight. */
  saving: boolean;
  /** Server/validation error message to display inside the form. */
  formError: string | null;
  /** Whether the current session is the read-only demo account. */
  isDemo: boolean;
  /** Called when any field value changes. */
  onChange: ChangeHandler;
  /** Called when the form is submitted. */
  onSubmit: (e: React.FormEvent) => void;
  /** Called when the modal should close. */
  onClose: () => void;
}

/** Labelled form field wrapper. */
function Field({ label, hint, wide, children }: {
  label: string; hint?: string; wide?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`${styles.field} ${wide ? styles.wide : ""}`}>
      <label className={styles.label}>
        {label}{hint && <span className={styles.hint}> — {hint}</span>}
      </label>
      {children}
    </div>
  );
}

/** Optional select — renders a "— none —" first option followed by the provided items. */
function OptSelect({ name, value, onChange, items }: {
  name: string; value: string; onChange: ChangeHandler; items: readonly string[];
}) {
  return (
    <select name={name} value={value} onChange={onChange} className={styles.input}>
      <option value="">— none —</option>
      {items.map((v) => <option key={v} value={v}>{v}</option>)}
    </select>
  );
}

/**
 * Add/edit project modal form.
 * Renders inside an overlay; the parent controls open/close state.
 */
export function AdminProjectForm({ form, editingId, saving, formError, onChange, onSubmit, onClose }: AdminProjectFormProps) {
  const ta = `${styles.input} ${styles.textarea}`;
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalPrompt}>
            {editingId ? `editing: ${editingId}` : "┌── new project ──"}
          </span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={onSubmit} className={styles.formGrid}>
          <Field label="ID *" hint="slug (e.g. my-project)">
            <input name="id" value={form.id} onChange={onChange} className={styles.input}
              required disabled={Boolean(editingId)} placeholder="project-slug" />
          </Field>

          <Field label="Title *">
            <input name="title" value={form.title} onChange={onChange} className={styles.input} required />
          </Field>

          <Field label="Description *" wide>
            <textarea name="description" value={form.description} onChange={onChange}
              className={ta} required rows={2} />
          </Field>

          <Field label="Long Description" wide>
            <textarea name="longDescription" value={form.longDescription ?? ""} onChange={onChange}
              className={ta} rows={3} />
          </Field>

          <Field label="Category *">
            <select name="category" value={form.category} onChange={onChange} className={styles.input} required>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Platform">
            <OptSelect name="platform" value={form.platform ?? ""} onChange={onChange} items={PLATFORMS} />
          </Field>

          <Field label="Year *">
            <input name="year" value={form.year} onChange={onChange} className={styles.input} required placeholder="2024" />
          </Field>

          <Field label="Status">
            <OptSelect name="status" value={form.status ?? ""} onChange={onChange} items={STATUSES} />
          </Field>

          <Field label="Tags" hint="comma-separated" wide>
            <input name="tags" value={form.tags} onChange={onChange} className={styles.input}
              placeholder="React, TypeScript, Next.js" />
          </Field>

          <Field label="Stack" hint="comma-separated" wide>
            <input name="stack" value={form.stack} onChange={onChange} className={styles.input}
              placeholder="React, Supabase, Vercel" />
          </Field>

          <Field label="Thumbnail URL" wide>
            <input name="thumbnail" value={form.thumbnail} onChange={onChange} className={styles.input}
              placeholder="/projects/my-project/thumb.jpg" />
          </Field>

          <Field label="Role">
            <input name="role" value={form.role ?? ""} onChange={onChange} className={styles.input} />
          </Field>

          <Field label="Duration">
            <input name="duration" value={form.duration ?? ""} onChange={onChange}
              className={styles.input} placeholder="4 weeks" />
          </Field>

          <Field label="Interaction">
            <OptSelect name="interaction" value={form.interaction ?? ""} onChange={onChange} items={INTERACTIONS} />
          </Field>

          <Field label="Layout">
            <OptSelect name="layout" value={form.layout ?? ""} onChange={onChange} items={LAYOUTS} />
          </Field>

          <Field label="Problem" wide>
            <textarea name="problem" value={form.problem ?? ""} onChange={onChange} className={ta} rows={2} />
          </Field>

          <Field label="Solution" wide>
            <textarea name="solution" value={form.solution ?? ""} onChange={onChange} className={ta} rows={2} />
          </Field>

          <Field label="Highlights" hint="comma-separated" wide>
            <input name="highlights" value={form.highlights} onChange={onChange} className={styles.input} />
          </Field>

          {formError && (
            <div className={`${styles.errorBanner} ${styles.formErrorBanner}`}>✗ {formError}</div>
          )}

          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "..." : editingId ? "> update" : "> create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
