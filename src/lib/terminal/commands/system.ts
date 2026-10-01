import type { CommandEntry, CommandOutput } from "@/types/terminal";
import { say } from "./helpers";
import { GUIDE_OUTPUT, buildSoundOutput, buildYggOutput } from "@/lib/terminal/Terminal.data";
import { SHORTCUTS_INFO } from "@/lib/terminal/Terminal.constants";
import { buildCategoryHelp, buildHelpOutput, isHelpCategory } from "@/lib/terminal/Terminal.help";
import { buildShareOutput } from "@/lib/terminal/Terminal.share";

/** The terminal itself, and the session you are in. */
export const SYSTEM_COMMANDS: CommandEntry[] = [
  {
    name: "help",
    aliases: ["?", "-h"],
    arg: "[category]",
    summary: "this list, or one category of it",
    category: "system",
    cta: { label: "→ run", cmd: "help" },
    run: ({ args, commands }) => {
      const topic = args[0]?.toLowerCase();
      return say(
        topic && isHelpCategory(topic)
          ? buildCategoryHelp(topic, commands)
          : buildHelpOutput(commands),
      );
    },
  },
  {
    name: "guide",
    aliases: ["tour", "start"],
    summary: "a short tour of what to type",
    category: "system",
    cta: { label: "→ run", cmd: "guide" },
    run: () => say(GUIDE_OUTPUT),
  },
  {
    name: "shortcuts",
    aliases: ["keys"],
    summary: "keyboard shortcuts",
    category: "system",
    run: () =>
      say([
        { type: "system", content: "KEYBOARD SHORTCUTS:" },
        ...SHORTCUTS_INFO.map(
          (s): CommandOutput => ({
            type: "text",
            content: `  ${s.key.padEnd(20)} - ${s.action}`,
          }),
        ),
      ]),
  },
  {
    name: "theme",
    aliases: ["yoda", "dark side", "light side"],
    summary: "flip light and dark",
    category: "system",
    cta: { label: "→ run", cmd: "theme" },
    run: ({ theme }) => {
      theme.playLightOn();
      theme.toggle();
      return say([
        {
          type: "success",
          content: ["Dark.", "Light.", "Switched."][
            Math.floor(Math.random() * 3)
          ],
        },
      ]);
    },
  },
  {
    name: "sound",
    aliases: ["audio", "music"],
    summary: "turn the site's audio on or off",
    category: "system",
    run: ({ audio }) => {
      const outputs = buildSoundOutput(audio.enabled, audio.muted);
      if (audio.enabled) audio.toggleMute();
      else audio.toggleAudio();
      return say(outputs);
    },
  },
  {
    name: "ygg",
    aliases: ["yggdrasil", "tmux"],
    summary: "repaint the panel in the home-server colours",
    category: "system",
    run: ({ setSkin }) => {
      // Toggle, so the same word undoes it — nobody should have to guess a
      // second command to get their terminal back.
      let turnedOn = false;
      setSkin((current) => {
        turnedOn = current === "default";
        return turnedOn ? "yggdrasil" : "default";
      });
      return say(buildYggOutput(turnedOn));
    },
  },
  {
    name: "share",
    arg: "[what]",
    summary: "a link to what you are looking at",
    category: "system",
    run: async ({ args }) => say(await buildShareOutput(args)),
  },
  {
    name: "whoami",
    summary: "who the session thinks you are",
    category: "system",
    run: async ({ auth }) => {
      const user = await auth.getUser();
      if (!user?.email) {
        return say([
          { type: "system", content: "User: Guest / Observer" },
          { type: "text", content: "Access Level: Read-Only" },
          { type: "text", content: 'Type "admin" to access the admin panel.' },
        ]);
      }
      const isDemo = user.email === "admin@idf.dev";
      return say([
        { type: "system", content: `User: ${user.email}` },
        {
          type: "success",
          content: isDemo
            ? "Access Level: C-137 (Morty-level — session-only, wubba lubba dub dub)"
            : "Access Level: Admin (full access)",
        },
        { type: "text", content: 'Type "admin" to open the dashboard.' },
      ]);
    },
  },
  {
    name: "admin",
    summary: "the dashboard",
    category: "system",
    run: async (ctx) => {
      // Prefetch before the auth round-trip so the dashboard loads in parallel
      // with the /api/auth/me call instead of after it.
      ctx.router.prefetch("/admin");
      const user = await ctx.auth.getUser();
      ctx.go("/admin");
      return say(
        user?.email
          ? [
              { type: "system", content: `Logged in as ${user.email}` },
              { type: "success", content: "→ Opening admin dashboard..." },
            ]
          : [
              { type: "system", content: "Accessing admin panel..." },
              { type: "success", content: "→ /admin" },
              {
                type: "text",
                content: "demo: admin@idf.dev / wubbalubbadubdub",
              },
            ],
      );
    },
  },
  {
    name: "logout",
    summary: "end the session",
    category: "system",
    run: async ({ auth, setIsOpen }) => {
      const user = await auth.getUser();
      if (!user?.email) {
        return say([{ type: "error", content: "Not logged in." }]);
      }
      setTimeout(async () => {
        await auth.signOut();
        setIsOpen(false);
      }, 400);
      return say([
        { type: "system", content: `Signing out ${user.email}...` },
        { type: "success", content: "Session terminated." },
      ]);
    },
  },
  {
    name: "echo",
    arg: "[text]",
    summary: "say it back",
    category: "system",
    hidden: true,
    run: ({ args }) => say([{ type: "text", content: args.join(" ") }]),
  },
  {
    name: "clear",
    summary: "empty the scrollback",
    category: "system",
    run: ({ setHistory }) => {
      setHistory([]);
      return { outputs: [], skipHistory: true };
    },
  },
  {
    name: "exit",
    aliases: ["close"],
    summary: "close the terminal",
    category: "system",
    run: ({ setIsOpen }) => {
      setIsOpen(false);
      return { outputs: [], skipHistory: true };
    },
  },
];
