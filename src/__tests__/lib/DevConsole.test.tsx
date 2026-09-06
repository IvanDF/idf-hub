import DevConsole from "@/components/atoms/dev-console";
import { CONSOLE_COMMANDS } from "@/lib/console";
import { EASTER_EGGS, TOTAL_EASTER_EGGS } from "@/lib/terminal/Terminal.constants";
import { render } from "@testing-library/react";

const EGG_STORAGE_KEY = "idf-easter-eggs";

/** Flattens every console.log argument of a spy into one searchable string. */
function loggedText(spy: jest.SpyInstance): string {
  return spy.mock.calls.flat().join(" ");
}

describe("DevConsole", () => {
  let logSpy: jest.SpyInstance;
  let tableSpy: jest.SpyInstance;

  beforeEach(() => {
    localStorage.clear();
    delete window.idf;
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    tableSpy = jest.spyOn(console, "table").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    tableSpy.mockRestore();
  });

  it("exposes a frozen window.idf and prints the banner on mount", () => {
    render(<DevConsole />);

    expect(window.idf).toBeDefined();
    expect(Object.isFrozen(window.idf)).toBe(true);
    expect(loggedText(logSpy)).toContain("Different angles. Better questions.");
  });

  it("does not print the banner twice across remounts", () => {
    render(<DevConsole />);
    const afterFirstMount = logSpy.mock.calls.length;

    render(<DevConsole />);

    expect(logSpy.mock.calls.length).toBe(afterFirstMount);
  });

  it("renders nothing", () => {
    const { container } = render(<DevConsole />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe("window.idf", () => {
  let logSpy: jest.SpyInstance;
  let tableSpy: jest.SpyInstance;

  /** Mounts the atom with a given set of eggs already discovered. */
  function mountWithEggs(discovered: string[]) {
    localStorage.setItem(EGG_STORAGE_KEY, JSON.stringify(discovered));
    render(<DevConsole />);
    logSpy.mockClear();
    tableSpy.mockClear();
  }

  beforeEach(() => {
    localStorage.clear();
    delete window.idf;
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    tableSpy = jest.spyOn(console, "table").mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    tableSpy.mockRestore();
  });

  it("lists every command in help()", () => {
    mountWithEggs([]);

    window.idf?.help();

    const text = loggedText(logSpy);
    for (const { call } of CONSOLE_COMMANDS) {
      expect(text).toContain(call);
    }
  });

  it("prints the identity card and the socials in whoami()", () => {
    mountWithEggs([]);

    window.idf?.whoami();

    const text = loggedText(logSpy);
    expect(text).toContain("Ivan Del Fatti");
    expect(text).toContain("https://github.com/IvanDF");
  });

  it("tables the stack", () => {
    mountWithEggs([]);

    window.idf?.stack();

    expect(tableSpy).toHaveBeenCalledTimes(1);
    const rows = tableSpy.mock.calls[0][0] as { tool: string }[];
    expect(rows.some((r) => r.tool.startsWith("Next.js"))).toBe(true);
  });

  it("reads egg progress from the terminal's store, masking what is unfound", () => {
    const found = EASTER_EGGS[0];
    mountWithEggs([found.id]);

    window.idf?.eggs();

    expect(loggedText(logSpy)).toContain(`1/${TOTAL_EASTER_EGGS}`);
    const rows = tableSpy.mock.calls[0][0] as {
      egg: string;
      status: string;
      clue: string;
    }[];
    expect(rows).toHaveLength(TOTAL_EASTER_EGGS);
    expect(rows[0]).toMatchObject({ egg: found.name, status: "✓ found", clue: "—" });
    expect(rows[1].egg).toBe("???");
    expect(rows[1].clue).toBe(EASTER_EGGS[1].hint);
  });

  it("ignores corrupt egg storage instead of throwing", () => {
    localStorage.setItem(EGG_STORAGE_KEY, "not json");
    render(<DevConsole />);
    logSpy.mockClear();

    expect(() => window.idf?.eggs()).not.toThrow();
    expect(loggedText(logSpy)).toContain(`0/${TOTAL_EASTER_EGGS}`);
  });

  it("hints at an egg that is still hidden", () => {
    const allButOne = EASTER_EGGS.slice(1).map((e) => e.id);
    mountWithEggs(allButOne);

    window.idf?.hint();

    expect(loggedText(logSpy)).toContain(EASTER_EGGS[0].hint);
  });

  it("has nothing left to hint once every egg is found", () => {
    mountWithEggs(EASTER_EGGS.map((e) => e.id));

    window.idf?.hint();

    expect(loggedText(logSpy)).toContain("you found them all");
  });
});
