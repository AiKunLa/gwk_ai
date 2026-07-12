import { createServer } from "node:http";

const hostname = "127.0.0.1";
const port = 3000;
const FORCE_EXIT_AFTER_MS = 10_000;

if (typeof process.send !== "function") {
  throw new Error("E2E server process requires an IPC channel");
}

const sockets = new Set();
let app;
let server;
let shutdownPromise;

process.on("message", (message) => {
  if (message === "shutdown") void shutdown(0);
});
process.once("disconnect", () => {
  void shutdown(0);
});

try {
  const { default: next } = await import("next");
  app = next({ dev: true, dir: process.cwd(), hostname, port });
  await app.prepare();
  if (shutdownPromise) await shutdownPromise;

  const requestHandler = app.getRequestHandler();
  const upgradeHandler = app.getUpgradeHandler();
  server = createServer((request, response) => {
    void requestHandler(request, response).catch((error) => {
      console.error("E2E server request failed", error);
      if (!response.headersSent) response.statusCode = 500;
      response.end();
    });
  });

  server.on("connection", (socket) => {
    sockets.add(socket);
    socket.once("close", () => sockets.delete(socket));
  });
  server.on("upgrade", (request, socket, head) => {
    void upgradeHandler(request, socket, head).catch(() => socket.destroy());
  });

  await new Promise((resolveListen, rejectListen) => {
    const handleError = (error) => rejectListen(error);
    server.once("error", handleError);
    server.listen(port, hostname, () => {
      server.off("error", handleError);
      resolveListen();
    });
  });
  if (shutdownPromise) await shutdownPromise;

  await sendToParent({ type: "ready" });
} catch (error) {
  await sendToParent({
    type: "error",
    message: error instanceof Error ? error.message : "E2E server startup failed",
  }).catch(() => undefined);
  await shutdown(1);
}

function shutdown(exitCode) {
  if (shutdownPromise) return shutdownPromise;

  shutdownPromise = (async () => {
    const forceExit = setTimeout(
      () => process.exit(exitCode || 1),
      FORCE_EXIT_AFTER_MS,
    );
    let finalExitCode = exitCode;

    try {
      if (server) {
        await new Promise((resolveClose) => {
          server.close(() => resolveClose());
          server.closeAllConnections();
          for (const socket of sockets) socket.destroy();
        });
      }
      if (app) await app.close();
      if (finalExitCode === 0) await sendToParent({ type: "closed" });
    } catch (error) {
      finalExitCode = 1;
      await sendToParent({
        type: "error",
        message:
          error instanceof Error ? error.message : "E2E server close failed",
      }).catch(() => undefined);
    }

    clearTimeout(forceExit);
    if (process.connected) process.disconnect();
    process.exit(finalExitCode);
  })();

  return shutdownPromise;
}

function sendToParent(message) {
  return new Promise((resolveSend, rejectSend) => {
    if (typeof process.send !== "function" || !process.connected) {
      resolveSend();
      return;
    }
    process.send(message, (error) => {
      if (error) {
        rejectSend(error);
        return;
      }
      resolveSend();
    });
  });
}
