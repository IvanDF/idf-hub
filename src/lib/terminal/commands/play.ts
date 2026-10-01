import type { CommandEntry } from "@/types/terminal";
import { say } from "./helpers";
import { PLAY_OUTPUT } from "@/lib/terminal/Terminal.brain";

/** The parts that exist because they were fun to build. */
export const PLAY_COMMANDS: CommandEntry[] = [
  {
    name: "play",
    arg: "[game]",
    summary: "what there is to play",
    category: "play",
    cta: { label: "→ run", cmd: "play" },
    run: (ctx) => {
      const game = ctx.args[0];
      if (game === "snake") {
        ctx.setGameActive(true);
        return { outputs: [], skipHistory: true };
      }
      if (game === "cortex" || game === "brain") {
        ctx.go("/cortex");
        return say([{ type: "success", content: "Booting the cortex lab..." }]);
      }
      return say(PLAY_OUTPUT);
    },
  },
  {
    name: "snake",
    summary: "the game, straight away",
    category: "play",
    run: (ctx) => {
      ctx.setGameActive(true);
      return { outputs: [], skipHistory: true };
    },
  },
];
