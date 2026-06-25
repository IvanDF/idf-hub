"use client";

import Text from "@/components/atoms/text";
import styles from "../page.module.scss";

/** Props for the `AdminDeleteConfirm` modal. */
export interface AdminDeleteConfirmProps {
  /** ID of the project pending deletion, or `null` when the modal is hidden. */
  targetId: string | null;
  /** Whether the delete request is in-flight. */
  deleting: boolean;
  /** Called when the user confirms the deletion. */
  onConfirm: () => void;
  /** Called when the user cancels. */
  onCancel: () => void;
}

/**
 * Confirmation overlay shown before a destructive delete action.
 * Renders nothing when `targetId` is `null`.
 */
export function AdminDeleteConfirm({
  targetId,
  deleting,
  onConfirm,
  onCancel,
}: AdminDeleteConfirmProps) {
  if (!targetId) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.confirm}>
        <Text as="p" variant="mono" className={styles.confirmText}>
          delete <Text as="span" variant="mono" className={styles.confirmId}>{targetId}</Text>?
        </Text>
        <div className={styles.confirmActions}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={deleting}
          >
            cancel
          </button>
          <button
            className={styles.deleteConfirmBtn}
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "..." : "> confirm delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
