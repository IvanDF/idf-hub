import type { CommandOutput } from "@/types/terminal";

/**
 * `share [command]` — builds a ?cmd= deep link and copies it to the
 * clipboard. Returns the output lines for the terminal history.
 */
export async function buildShareOutput(
  args: string[],
): Promise<CommandOutput[]> {
  const target = args.join(" ").trim();
  if (!target) {
    return [
      { type: "system", content: "SHARE USAGE" },
      { type: "text", content: "share [command] — copy a deep link that runs it" },
      {
        type: "text",
        content: "Try: share snake",
        cta: { label: "→ run", cmd: "share snake" },
      },
    ];
  }
  const link = `${window.location.origin}/?cmd=${encodeURIComponent(target)}`;
  try {
    await navigator.clipboard.writeText(link);
    return [
      { type: "success", content: "Link copied to clipboard:" },
      { type: "text", content: link },
    ];
  } catch {
    return [
      { type: "error", content: "Clipboard unavailable — here is the link:" },
      { type: "text", content: link },
    ];
  }
}
