"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function NewArticleEntry() {
  const router = useRouter();
  const startedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    void fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          success: boolean;
          data?: { id: string };
          error?: { message?: string };
        };
        if (!response.ok || !payload.success || !payload.data) {
          throw new Error(payload.error?.message || "无法创建草稿");
        }
        router.replace(`/posts/${payload.data.id}/edit`);
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "无法创建草稿");
      });
  }, [router]);

  return (
    <main className="center-state">
      {error ? (
        <div className="state-message" role="alert">
          <h1>草稿创建失败</h1>
          <p>{error}</p>
          <button type="button" className="secondary-button" onClick={() => location.reload()}>
            重试
          </button>
        </div>
      ) : (
        <div className="loading-indicator" role="status" aria-label="正在创建草稿">
          <span />
        </div>
      )}
    </main>
  );
}
