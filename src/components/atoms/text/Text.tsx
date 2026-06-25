import { createElement } from 'react';
import type { ReactNode } from 'react';
import styles from './Text.module.scss';

export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'small'
  | 'label'
  | 'mono'
  | 'inherit';

type TextTag =
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'p' | 'span' | 'small' | 'label' | 'div' | 'strong' | 'em';

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  as?: TextTag;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  role?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}

const variantTag: Record<TextVariant, TextTag> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  small: 'small',
  label: 'span',
  mono: 'span',
  inherit: 'span',
};

/**
 * Typography primitive that renders a semantic HTML element styled according
 * to the design system type scale defined in Typefaces Details.pdf.
 *
 * @example
 * <Text variant="h1">Page Title</Text>
 * <Text variant="body" as="p">Body content</Text>
 * <Text variant="mono">npm run dev</Text>
 */
export default function Text({
  children,
  variant = 'body',
  as,
  className = '',
  ...rest
}: TextProps & Record<string, unknown>) {
  const tag = as ?? variantTag[variant] ?? 'span';

  const classes = [styles.text, styles[variant]];
  if (variant === 'mono' && as && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(as)) {
    classes.push(styles[`mono-${as}`]);
  }
  if (className) classes.push(className);

  return createElement(
    tag,
    {
      className: classes.join(' '),
      ...(variant === 'label' && !rest.role ? { role: 'label' } : {}),
      ...rest,
    },
    children,
  );
}
