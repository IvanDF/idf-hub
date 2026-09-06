/**
 * Public shape of the `window.idf` console API — the developer-facing
 * companion that greets anyone who opens the devtools on the site.
 *
 * Every method prints to the console and returns nothing: the value of a
 * call is what it writes, not what it hands back.
 */
export interface IdfConsoleApi {
  /** Lists every available `idf.*` command with a one-line description. */
  help(): void;
  /** Prints the identity card: who iDF is, and where to find him. */
  whoami(): void;
  /** Prints the tech stack this site runs on as a table. */
  stack(): void;
  /** Prints easter-egg progress, reading the same store as the terminal. */
  eggs(): void;
  /** Prints one cryptic nudge toward an egg that is still hidden. */
  hint(): void;
}

declare global {
  interface Window {
    /** Present once the console companion has mounted (client only). */
    idf?: IdfConsoleApi;
  }
}
