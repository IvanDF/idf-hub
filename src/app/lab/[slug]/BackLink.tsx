"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import styles from "./ProjectDetail.module.scss";

/**
 * Back link that preserves the /lab filter from the query string.
 * Client-side on purpose: reading searchParams in the server page would opt
 * the whole route out of static generation, turning every card click into an
 * on-demand server render.
 */
export default function BackLink() {
  const filter = useSearchParams().get("filter");
  const backHref = filter
    ? `/lab?filter=${encodeURIComponent(filter)}`
    : "/lab";

  return (
    <Link href={backHref} className={styles.backLink}>
      <ArrowLeft size={14} />
      Work
    </Link>
  );
}
