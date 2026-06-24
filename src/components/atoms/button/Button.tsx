"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

export type ButtonVariant = "primary" | "secondary" | "chrome" | "ghost";

interface BaseButtonProps {
  children: ReactNode;
  className?: string;
  iconOnly?: boolean;
  stamp?: boolean;
  variant?: ButtonVariant;
}

interface NativeButtonProps
  extends BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: undefined;
}

interface LinkButtonProps
  extends BaseButtonProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> {
  href: string;
  external?: boolean;
  type?: never;
}

export type ButtonProps = NativeButtonProps | LinkButtonProps;

/**
 * Renders the shared button primitive used across the interface.
 * Supports native buttons, internal links, and external links through one
 * consistent visual API with variant-based styling.
 */
export default function Button(props: ButtonProps) {
  const {
    children,
    className = "",
    iconOnly = false,
    stamp = true,
    variant = "secondary",
    href,
    external,
    ...rest
  } = props as ButtonProps & { external?: boolean };

  const buttonClassName = [
    styles.button,
    styles[variant],
    iconOnly ? styles.iconOnly : "",
    !stamp ? styles.noStamp : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    const isExternal = external ?? /^https?:\/\//.test(href);

    if (isExternal) {
      const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
      const rel =
        anchorProps.rel ??
        (anchorProps.target === "_blank" ? "noopener noreferrer" : undefined);

      return (
        <a
          href={href}
          className={buttonClassName}
          data-no-stamp={!stamp ? "true" : undefined}
          rel={rel}
          {...anchorProps}
        >
          {children}
        </a>
      );
    }

    const linkProps = rest as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "className" | "children"
    >;

    return (
      <Link href={href} className={buttonClassName} {...linkProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      type={buttonProps.type ?? "button"}
      className={buttonClassName}
      data-no-stamp={!stamp ? "true" : undefined}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
