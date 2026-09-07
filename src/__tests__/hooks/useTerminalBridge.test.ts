import { useTerminalBridge } from "@/hooks/terminal/useTerminalBridge";
import { requestTerminalCommand } from "@/lib/terminal/Terminal.bridge";
import { act, renderHook } from "@testing-library/react";

describe("useTerminalBridge", () => {
  let setIsOpen: jest.Mock;
  let executeCommand: jest.Mock;

  /** Mounts the hook and returns a rerender bound to the open flag. */
  function mount(isOpen = false) {
    const view = renderHook(
      (props: { isOpen: boolean }) =>
        useTerminalBridge({ ...props, setIsOpen, executeCommand }),
      { initialProps: { isOpen } },
    );
    return view;
  }

  beforeEach(() => {
    jest.useFakeTimers();
    setIsOpen = jest.fn();
    executeCommand = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("acknowledges the request so the caller knows a terminal is there", () => {
    mount();

    let handled = false;
    act(() => {
      handled = requestTerminalCommand("snake");
    });

    expect(handled).toBe(true);
  });

  it("reports no terminal when nothing is mounted", () => {
    expect(requestTerminalCommand("snake")).toBe(false);
  });

  it("opens the terminal first and runs the command once it is up", () => {
    const { rerender } = mount(false);

    act(() => {
      requestTerminalCommand("snake");
    });

    expect(setIsOpen).toHaveBeenCalledWith(true);
    expect(executeCommand).not.toHaveBeenCalled();

    rerender({ isOpen: true });
    act(() => {
      jest.runAllTimers();
    });

    expect(executeCommand).toHaveBeenCalledWith("snake");
  });

  it("runs straight away when the terminal is already open", () => {
    mount(true);

    act(() => {
      requestTerminalCommand("cheers");
    });

    expect(executeCommand).toHaveBeenCalledWith("cheers");
    expect(setIsOpen).not.toHaveBeenCalled();
  });

  it("only opens the terminal when the command is empty", () => {
    const { rerender } = mount(false);

    act(() => {
      requestTerminalCommand("");
    });
    rerender({ isOpen: true });
    act(() => {
      jest.runAllTimers();
    });

    expect(setIsOpen).toHaveBeenCalledWith(true);
    expect(executeCommand).not.toHaveBeenCalled();
  });

  it("stops listening once unmounted", () => {
    const { unmount } = mount();
    unmount();

    expect(requestTerminalCommand("snake")).toBe(false);
    expect(setIsOpen).not.toHaveBeenCalled();
  });
});
