/**
 * The bridge between the devtools console and the on-page terminal.
 *
 * The `?cmd=` deep link already runs a command in the terminal, but only once
 * on mount — driving it from the console needs something that works on a page
 * that is already up. A DOM event does that without either side importing the
 * other: `window.idf` dispatches, the mounted Terminal listens.
 */

/** Event the console dispatches and the Terminal listens for. */
export const TERMINAL_COMMAND_EVENT = "idf:terminal-command";

export interface TerminalCommandEventDetail {
  /** The command to run. Empty string means "just open the terminal". */
  command: string;
}

/**
 * Asks the mounted terminal to open and run a command.
 *
 * The event is cancelable and the Terminal calls `preventDefault()` on it, so
 * a `false` return from `dispatchEvent` is the listener's acknowledgement —
 * that is how the caller can tell a mounted terminal from no terminal at all.
 *
 * @param command - Terminal command; empty opens the overlay without running.
 * @returns Whether a terminal was listening.
 */
export function requestTerminalCommand(command: string): boolean {
  const event = new CustomEvent<TerminalCommandEventDetail>(
    TERMINAL_COMMAND_EVENT,
    { detail: { command }, cancelable: true },
  );
  return !window.dispatchEvent(event);
}
