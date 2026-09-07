import { filterKnownThreeWarnings } from "@/lib/three/console";
import { error, getConsoleFunction, setConsoleFunction, warn } from "three";

/** three exposes no "unset" — the hook is a module-level slot, so null clears it. */
const clearConsoleFunction = () =>
  (setConsoleFunction as unknown as (fn: null) => void)(null);

const CLOCK_DEPRECATION =
  "Clock: This module has been deprecated. Please use THREE.Timer instead.";

describe("filterKnownThreeWarnings", () => {
  let warnSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    clearConsoleFunction();
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    clearConsoleFunction();
    warnSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("swallows the THREE.Clock deprecation R3F triggers", () => {
    filterKnownThreeWarnings();

    // three prefixes "THREE." itself, which is why the real line is doubled.
    warn(`THREE.${CLOCK_DEPRECATION}`);

    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("lets every other warning through", () => {
    filterKnownThreeWarnings();

    warn("WebGLRenderer: Context Lost.");

    expect(warnSpy).toHaveBeenCalledWith("THREE.WebGLRenderer: Context Lost.");
  });

  it("never touches errors", () => {
    filterKnownThreeWarnings();

    error(`THREE.${CLOCK_DEPRECATION}`);

    expect(errorSpy).toHaveBeenCalled();
  });

  it("installs once, so several Canvas modules cannot stack wrappers", () => {
    filterKnownThreeWarnings();
    const installed = getConsoleFunction();

    filterKnownThreeWarnings();

    expect(getConsoleFunction()).toBe(installed);
  });
});
