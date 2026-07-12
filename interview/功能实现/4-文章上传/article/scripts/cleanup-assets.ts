import { getRuntime } from "@/lib/server/runtime";

const result = await getRuntime().cleanupService.run(100);
console.log(`Asset cleanup complete: queued=${result.queued}, deleted=${result.deleted}`);
