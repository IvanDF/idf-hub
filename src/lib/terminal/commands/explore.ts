import { PROJECTS } from "@/data/projects";
import { hrefForProject } from "@/types/project";
import type { CommandEntry, CommandOutput } from "@/types/terminal";
import { say } from "./helpers";
import { buildBrainOutput } from "@/lib/terminal/Terminal.brain";
import { buildEggsOutput } from "@/lib/terminal/Terminal.data";
import { buildBrandOutput } from "@/lib/terminal/brand.data";
import { buildHintOutput } from "@/lib/terminal/Terminal.suggest";

/** Digging through the work, and the things behind it. */
export const EXPLORE_COMMANDS: CommandEntry[] = [
  {
    name: "search",
    aliases: ["find", "cerca", "ricerca"],
    arg: "[keyword]",
    summary: "find projects by anything",
    detail:
      "Matches titles, tags, stack and descriptions — try a technology rather than a name.",
    category: "explore",
    cta: { label: "→ try", cmd: "search shader" },
    run: ({ args }) => {
      const query = args.join(" ").trim().toLowerCase();
      if (!query) {
        return say([
          { type: "system", content: "SEARCH USAGE" },
          { type: "text", content: "search [keyword]" },
          {
            type: "text",
            content: "Try: search shader, search vscode, search design",
          },
          { type: "text", content: "Oppure: cerca shader" },
        ]);
      }
      const matches = PROJECTS.filter((p) => {
        const tags = p.tags.join(" ").toLowerCase();
        return (
          p.id.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          tags.includes(query)
        );
      });
      return say(
        matches.length === 0
          ? [
              { type: "error", content: `No matches for '${query}'` },
              { type: "text", content: "Tip: use broader keywords." },
            ]
          : [
              { type: "success", content: `${matches.length} match(es) found` },
              ...matches.slice(0, 6).map(
                (p): CommandOutput => ({
                  type: "text",
                  content: `- ${p.id} | ${p.title}`,
                  cta: { label: "→ open", cmd: "open " + p.id },
                }),
              ),
              {
                type: "text",
                content: "Use: open [project-id] to jump directly.",
              },
            ],
      );
    },
  },
  {
    name: "open",
    aliases: ["apri"],
    arg: "[id]",
    summary: "jump straight to a project",
    detail: "Takes a project id, which `search` prints beside each result.",
    category: "explore",
    run: (ctx) => {
      const targetId = ctx.args.join(" ").trim().toLowerCase();
      if (!targetId) {
        return say([
          { type: "system", content: "OPEN USAGE" },
          { type: "text", content: "open [project-id]" },
          { type: "text", content: "apri [project-id]" },
        ]);
      }
      const target = PROJECTS.find((p) => p.id.toLowerCase() === targetId);
      if (!target) {
        return say([
          { type: "error", content: `Project not found: ${targetId}` },
          { type: "text", content: "Tip: run search first." },
        ]);
      }
      ctx.go(hrefForProject(target));
      return say([
        { type: "success", content: `Opening ${target.title}...` },
      ]);
    },
  },
  {
    name: "brand",
    aliases: ["identity"],
    summary: "identity system and companion",
    category: "explore",
    cta: { label: "→ run", cmd: "brand" },
    run: () => say(buildBrandOutput()),
  },
  {
    name: "brain",
    // No `cortex` alias: the egg of that name is typeable and is matched
    // before commands are, so the alias could never have fired.
    summary: "a neuroscience fact, and a hidden lab",
    category: "explore",
    cta: { label: "→ run", cmd: "brain" },
    run: () => say(buildBrainOutput()),
  },
  {
    name: "eggs",
    aliases: ["achievements", "badges", "easter"],
    summary: "what you have found so far",
    detail:
      "The site hides a handful of things. This tracks which ones you have tripped over.",
    category: "explore",
    cta: { label: "→ run", cmd: "eggs" },
    run: ({ discoveredEggs }) => say(buildEggsOutput(discoveredEggs)),
  },
  {
    name: "hint",
    summary: "one nudge toward something unfound",
    category: "explore",
    cta: { label: "→ run", cmd: "hint" },
    run: ({ discoveredEggs }) => say(buildHintOutput(discoveredEggs)),
  },
];
