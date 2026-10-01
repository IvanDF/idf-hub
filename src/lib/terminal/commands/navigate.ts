import type { CommandEntry } from "@/types/terminal";
import { navigate } from "./helpers";

/** Every page of the site, without touching the mouse. */
export const NAVIGATE_COMMANDS: CommandEntry[] = [
  {
    name: "home",
    aliases: ["back"],
    summary: "the front page",
    category: "navigate",
    cta: { label: "→ open", cmd: "home" },
    run: navigate("/", "Returning Home..."),
  },
  {
    name: "lab",
    aliases: ["work", "projects", "progetti", "portfolio", "experiments"],
    summary: "selected projects",
    detail:
      "The Lab is the whole archive. Filter it by Code, Design, Craft or Lab once you are there.",
    category: "navigate",
    cta: { label: "→ open", cmd: "lab" },
    run: navigate("/lab", "Accessing The Lab..."),
  },
  {
    name: "about",
    aliases: ["me", "chi"],
    summary: "who iDF is",
    category: "navigate",
    cta: { label: "→ open", cmd: "about" },
    run: navigate("/about", "About Ivan Del Fatti..."),
  },
  {
    name: "career",
    aliases: ["path"],
    summary: "ten years, no straight line",
    category: "navigate",
    cta: { label: "→ open", cmd: "career" },
    run: navigate(
      "/lab?view=career",
      "Walking The Path — ten years, no straight line...",
    ),
  },
  {
    name: "time",
    aliases: ["flux"],
    summary: "the time machine",
    category: "navigate",
    cta: { label: "→ open", cmd: "time" },
    run: navigate("/time-machine", "Time Machine..."),
  },
];
