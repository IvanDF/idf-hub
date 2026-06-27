// Shared chrome data — single source for nav links and social handles.
// Consumed by LeftColumn / RightColumn (desktop rails and their mobile reflow)
// and by tests, so the lists are never duplicated across components.

export interface NavItem {
  href: string;
  label: string;
}

export interface SocialLink {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/lab", label: "Work" },
  { href: "/about", label: "About" },
];

export const socials: SocialLink[] = [
  { href: "https://www.instagram.com/idf.me/", label: "IG" },
  { href: "https://www.linkedin.com/in/ivandf/", label: "LI" },
  { href: "https://github.com/IvanDF", label: "GH" },
  { href: "https://www.figma.com/@ivandf", label: "FG" },
  { href: "https://findpenguins.com/idf.travel", label: "FP" },
];
