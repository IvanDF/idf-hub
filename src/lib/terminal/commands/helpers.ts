import type { CommandContext, CommandOutput, CommandResult } from "@/types/terminal";

/** Shorthand for the many commands that only print. */
export const say = (outputs: CommandOutput[]): CommandResult => ({ outputs });

/**
 * A page, after a readable beat.
 *
 * Six commands repeated the same prefetch / setTimeout / push / close
 * four-liner before this existed; the beat itself lives in the hook that owns
 * the router, so this only says where to go and what to print on the way.
 */
export const navigate =
  (href: string, message: string) =>
  (ctx: CommandContext): CommandResult => {
    ctx.go(href);
    return say([{ type: "success", content: message }]);
  };
