"use client";

import Image from "next/image";

interface SocialIconLinkProps {
  href: string;
  src: string;
  alt: string;
  className?: string;
  iconSize?: number;
  invertOnDark?: boolean;
}

/**
 * Icon-based social link that opens in a new tab.
 * @param href - Destination URL
 * @param src - Path to the icon image asset
 * @param alt - Accessible alt text for the icon
 * @param className - Optional CSS class for the anchor element
 * @param iconSize - Width and height of the icon in pixels (default: 20)
 * @param invertOnDark - When true, applies a CSS invert filter to the icon (default: false)
 */
export default function SocialIconLink({
  href,
  src,
  alt,
  className = "",
  iconSize = 20,
  invertOnDark = false,
}: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <Image
        src={src}
        alt={alt}
        width={iconSize}
        height={iconSize}
        style={{ filter: invertOnDark ? "invert(1)" : "none" }}
      />
    </a>
  );
}
