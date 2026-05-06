"use client";

import styles from "../page.module.scss";
import type { ProjectRow } from "./admin.types";

/** Props for the `AdminProjectsTable` component. */
export interface AdminProjectsTableProps {
  /** List of projects to display. */
  projects: ProjectRow[];
  /** Whether the initial fetch is in-flight. */
  loading: boolean;
  /** Error message from the fetch, if any. */
  error: string | null;
  /** Called when the user clicks "edit" on a row. */
  onEdit: (project: ProjectRow) => void;
  /** Called when the user clicks "delete" on a row. */
  onDelete: (id: string) => void;
  /** Whether the current session is the read-only demo account. */
  isDemo: boolean;
}

/**
 * Displays the scrollable projects table with edit/delete actions.
 * Shows a loading indicator or error banner when appropriate.
 */
export function AdminProjectsTable({
  projects,
  loading,
  error,
  onEdit,
  onDelete,
}: AdminProjectsTableProps) {
  if (loading) {
    return (
      <div className={styles.loadingMsg}>
        <span className={styles.cursor}>_</span> loading...
      </div>
    );
  }

  return (
    <>
      {error && <div className={styles.errorBanner}>✗ {error}</div>}

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
                      className={`${styles.status} ${styles[`status_${p.status.replace("-", "_")}`]}`}
                    >
                      {p.status}
                    </span>
                  )}
                </td>
                <td className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => onEdit(p)}
                  >
                    edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => onDelete(p.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
