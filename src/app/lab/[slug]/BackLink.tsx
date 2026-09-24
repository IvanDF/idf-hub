"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./ProjectDetail.module.scss";

interface BackLinkProps {
  /** Project to scroll back to in the list. */
  projectId: string;
}

/**
 * Back link to the Lab list, preserving the filter and returning to the row
 * the visitor came from.
 *
 * `view=lab` is explicit: /lab with no view shows the two-way fork, so a bare
 * href sent people back to a choice they had already made.
 *
 * Client-side on purpose: reading searchParams in the server page would opt
 * the whole route out of static generation, turning every card click into an
 * on-demand server render.
 */
export default function BackLink({ projectId }: BackLinkProps) {
  const params_ = useSearchParams();
  const filter = params_.get("filter");
  const kind = params_.get("kind");

  // `from` rather than a #hash: the list reads it during render, so it can
  // open the Archive when the row lives in there before trying to scroll to it.
  const params = new URLSearchParams({ view: "lab", from: projectId });
  if (filter) params.set("filter", filter);
  if (kind) params.set("kind", kind);

  return (
    <Link href={`/lab?${params}`} className={styles.backLink}>
      <ArrowLeft size={14} />
      Work
    </Link>
  );
}
