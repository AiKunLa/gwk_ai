import { EventEmitter } from "node:events";
import type { ChildProcess } from "node:child_process";

import { afterEach, describe, expect, it, vi } from "vitest";

import { stopProcess, withTimeout } from "@/e2e/global-setup";

describe("E2E process lifecycle", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects a stalled lifecycle phase after its hard timeout", async () => {
    vi.useFakeTimers();
    const stalled = withTimeout(
      new Promise<void>(() => undefined),
      100,
      "server ready",
    );
    const rejected = expect(stalled).rejects.toThrow(
      "server ready timed out after 100ms",
    );

    await vi.advanceTimersByTimeAsync(100);
    await rejected;
  });

  it("disconnects a child and waits for a clean exit", async () => {
    const emitter = new EventEmitter();
    const disconnect = vi.fn(() => {
      queueMicrotask(() => emitter.emit("exit", 0, null));
    });
    const child = Object.assign(emitter, {
      connected: true,
      exitCode: null,
      signalCode: null,
      disconnect,
      kill: vi.fn(() => true),
    }) as unknown as ChildProcess;

    await stopProcess(child, 100);

    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(child.kill).not.toHaveBeenCalled();
  });

  it("force-kills a child that ignores disconnect", async () => {
    vi.useFakeTimers();
    const emitter = new EventEmitter();
    const kill = vi.fn(() => {
      queueMicrotask(() => emitter.emit("exit", 0, null));
      return true;
    });
    const child = Object.assign(emitter, {
      connected: true,
      exitCode: null,
      signalCode: null,
      disconnect: vi.fn(),
      kill,
    }) as unknown as ChildProcess;

    const stopping = stopProcess(child, 100);
    await vi.advanceTimersByTimeAsync(100);
    await stopping;

    expect(child.disconnect).toHaveBeenCalledTimes(1);
    expect(kill).toHaveBeenCalledTimes(1);
  });
});
