import { fork, type ChildProcess } from "node:child_process";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";

interface ServerProcessMessage {
  type: "ready" | "closed" | "error";
  message?: string;
}

const START_TIMEOUT_MS = 120_000;
const SHUTDOWN_TIMEOUT_MS = 20_000;
const FORCE_STOP_TIMEOUT_MS = 12_000;

export default async function globalSetup() {
  process.env.APP_ORIGIN = "http://127.0.0.1:3000";
  process.env.ARTICLE_DB_PATH = "./data/e2e.db";
  process.env.E2E_FAKE_OSS = "1";
  process.env.E2E_FAKE_OSS_TOKEN = randomUUID();

  const serverProcess = fork(
    resolve(process.cwd(), "e2e/server-process.mjs"),
    [],
    {
      env: { ...process.env },
      execArgv: [],
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    },
  );

  try {
    await withTimeout(
      waitForProcessMessage(serverProcess, "ready"),
      START_TIMEOUT_MS,
      "E2E server ready",
    );
  } catch (error) {
    await stopAfterFailure(serverProcess, error);
    throw error;
  }

  return async () => {
    const closed = waitForProcessMessage(serverProcess, "closed");
    const exited = waitForProcessExit(serverProcess);

    try {
      await withTimeout(
        Promise.all([
          closed,
          exited,
          sendToProcess(serverProcess, "shutdown"),
        ]).then(() => undefined),
        SHUTDOWN_TIMEOUT_MS,
        "E2E server shutdown",
      );
    } catch (error) {
      await stopAfterFailure(serverProcess, error);
      throw error;
    }
  };
}

export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string,
): Promise<T> {
  return new Promise<T>((resolvePromise, rejectPromise) => {
    const timer = setTimeout(() => {
      rejectPromise(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolvePromise(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        rejectPromise(error);
      },
    );
  });
}

export async function stopProcess(
  child: ChildProcess,
  timeoutMs = FORCE_STOP_TIMEOUT_MS,
): Promise<void> {
  if (hasExited(child)) return;
  const gracefulExit = waitForProcessExit(child);

  if (child.connected) {
    child.disconnect();
  } else {
    child.kill();
  }

  try {
    await withTimeout(gracefulExit, timeoutMs, "E2E server process stop");
    return;
  } catch {
    if (!hasExited(child)) child.kill();
  }

  if (!hasExited(child)) {
    await withTimeout(
      waitForProcessExit(child),
      timeoutMs,
      "E2E server process force stop",
    );
  }
}

async function stopAfterFailure(
  child: ChildProcess,
  originalError: unknown,
): Promise<void> {
  try {
    await stopProcess(child);
  } catch (stopError) {
    throw new AggregateError(
      [originalError, stopError],
      "E2E server failed and could not be stopped",
    );
  }
}

function sendToProcess(child: ChildProcess, message: string): Promise<void> {
  return new Promise((resolveSend, rejectSend) => {
    if (!child.connected || typeof child.send !== "function") {
      rejectSend(new Error("E2E server IPC channel is closed"));
      return;
    }
    child.send(message, (error) => {
      if (error) {
        rejectSend(error);
        return;
      }
      resolveSend();
    });
  });
}

function hasExited(child: ChildProcess): boolean {
  return child.exitCode !== null || child.signalCode !== null;
}

function waitForProcessMessage(
  child: ChildProcess,
  expectedType: ServerProcessMessage["type"],
): Promise<void> {
  return new Promise((resolveMessage, rejectMessage) => {
    const cleanup = () => {
      child.off("message", handleMessage);
      child.off("error", handleError);
      child.off("exit", handleExit);
    };
    const handleMessage = (message: unknown) => {
      const serverMessage = message as ServerProcessMessage;
      if (serverMessage.type !== expectedType && serverMessage.type !== "error") {
        return;
      }
      cleanup();
      if (serverMessage.type === "error") {
        rejectMessage(
          new Error(serverMessage.message || "E2E server process failed"),
        );
        return;
      }
      resolveMessage();
    };
    const handleError = (error: Error) => {
      cleanup();
      rejectMessage(error);
    };
    const handleExit = (code: number | null, signal: NodeJS.Signals | null) => {
      cleanup();
      rejectMessage(
        new Error(
          `E2E server process exited before ${expectedType} (code ${code}, signal ${signal})`,
        ),
      );
    };

    child.on("message", handleMessage);
    child.once("error", handleError);
    child.once("exit", handleExit);
  });
}

function waitForProcessExit(child: ChildProcess): Promise<void> {
  return new Promise((resolveExit, rejectExit) => {
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolveExit();
        return;
      }
      rejectExit(
        new Error(`E2E server process exited with code ${code}, signal ${signal}`),
      );
    });
  });
}
