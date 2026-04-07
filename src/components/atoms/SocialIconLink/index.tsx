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
