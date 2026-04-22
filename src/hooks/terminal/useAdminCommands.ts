"use client";

import type React from "react";
import { useCallback } from "react";
import { ADMIN_HELP_OUTPUT } from "@/components/organisms/Terminal/Terminal.data";
import type { CommandOutput } from "@/components/organisms/Terminal/Terminal.types";

type AdminCommandResult = {
  outputs: CommandOutput[];
  handled: boolean;
};

type UseAdminCommandsOptions = {
  router: { push: (href: string) => void };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * Handles admin-context-only terminal commands (list, add, status, site, ping).
 * Returns a `handleAdminCommand` function to call from the main command orchestrator.
 */
export function useAdminCommands({ router, setIsOpen }: UseAdminCommandsOptions): {
  handleAdminCommand: (cmd: string, args?: string[]) => Promise<AdminCommandResult>;
} {
  const handleAdminCommand = useCallback(
    async (cmd: string): Promise<AdminCommandResult> => {
      // Note: _args reserved for future subcommands
      let outputs: CommandOutput[] = [];
      let handled = false;

      switch (cmd) {
        case "help":
        case "-h":
          outputs = ADMIN_HELP_OUTPUT;
          handled = true;
          break;

        case "list": {
          try {
            const res = await fetch("/api/projects");
            const projects = await res.json();
            outputs = [
              { type: "system", content: `${projects.length} projects in DB` },
              ...projects.slice(0, 15).map((p: { id: string; status?: string; year: string }) => ({
                type: "text" as const,
                content: `${p.id.padEnd(28)} ${p.year}  ${p.status ?? "—"}`,
              })),
              ...(projects.length > 15
                ? [{ type: "text" as const, content: `  ... and ${projects.length - 15} more` }]
                : []),
            ];
          } catch {
            outputs = [{ type: "error", content: "Failed to fetch projects" }];
          }
          handled = true;
          break;
        }

        case "add":
          outputs = [{ type: "success", content: "Opening add form..." }];
          setTimeout(() => window.dispatchEvent(new CustomEvent("terminal:admin:add")), 300);
          handled = true;
          break;

        case "status": {
          try {
            const res = await fetch("/api/projects");
            const projects = await res.json();
            const count = (s: string) =>
              projects.filter((p: { status?: string }) => p.status === s).length;
            outputs = [
              { type: "system", content: "── DB STATUS ──" },
              { type: "success", content: `total:       ${projects.length}` },
              { type: "text", content: `live:        ${count("live")}` },
              { type: "text", content: `in-progress: ${count("in-progress")}` },
              { type: "text", content: `archived:    ${count("archived")}` },
            ];
          } catch {
            outputs = [{ type: "error", content: "Failed to reach API" }];
          }
          handled = true;
          break;
        }

        case "site":
          outputs = [{ type: "success", content: "← Returning to site..." }];
          setTimeout(() => { router.push("/"); setIsOpen(false); }, 700);
          handled = true;
          break;

        case "ping":
          outputs = [{ type: "success", content: "pong. DB is alive." }];
          handled = true;
          break;
      }

      return { outputs, handled };
    },
    [router, setIsOpen],
  );

  return { handleAdminCommand };
}
