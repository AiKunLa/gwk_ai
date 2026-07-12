import { expect, test } from "@playwright/test";

const onePixelPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nGQAAAAASUVORK5CYII=",
  "base64",
);

test("creates, uploads, previews, publishes, and deletes an article", async ({ page }, testInfo) => {
  const title = `Tiptap upload flow ${testInfo.project.name} ${Date.now()}`;
  const imageFile = {
    name: "diagram.png",
    mimeType: "image/png",
    buffer: onePixelPng,
  };

  await page.goto("/posts/new");
  await expect(page).toHaveURL(/\/posts\/[0-9a-f-]+\/edit$/);

  await page.getByRole("textbox", { name: "文章标题" }).fill(title);
  await page
    .getByRole("textbox", { name: "文章正文" })
    .fill("This article verifies the complete rich-text publishing flow.");
  await page.getByLabel("摘要").fill("A concise end-to-end publishing test.");
  await page.getByLabel("标签").fill("Next.js, Tiptap");

  const fakeOssPattern = /\/api\/test-oss(?:\?|$)/;
  const uploadStarted = Promise.withResolvers<void>();
  const releaseUpload = Promise.withResolvers<void>();
  await page.route(fakeOssPattern, async (route) => {
    if (route.request().method() !== "POST") {
      await route.continue();
      return;
    }
    const response = await route.fetch();
    uploadStarted.resolve();
    await releaseUpload.promise;
    await route.fulfill({ response });
  });

  await page.getByLabel("选择正文图片").setInputFiles(imageFile);
  await uploadStarted.promise;
  await expect(page.getByRole("button", { name: "预览", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "保存", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "发布", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "删除文章" })).toBeDisabled();
  releaseUpload.resolve();
  const articleImage = page.locator(".tiptap-editor figure img");
  await expect(articleImage).toBeVisible();
  await expect(page.getByRole("button", { name: "预览", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "保存", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "发布", exact: true })).toBeEnabled();
  await expect(page.getByRole("button", { name: "删除文章" })).toBeEnabled();
  await page.unroute(fakeOssPattern);
  await articleImage.click();
  await page.getByLabel("替代文本").fill("Request lifecycle diagram");
  await page.getByLabel("图片说明").fill("Request lifecycle");

  await page.getByLabel("选择封面图片").setInputFiles(imageFile);
  await expect(page.locator(".cover-picker img")).toBeVisible();

  const saveResponse = page.waitForResponse(
    (response) => response.url().includes("/api/articles/") && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await expect((await saveResponse).status()).toBe(200);
  await expect(page.getByRole("status").filter({ hasText: "已保存" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await scrollToTop(page);
  await page.screenshot({ path: testInfo.outputPath("editor.png"), fullPage: true });

  const firstSnapshot = "The first queued save snapshot.";
  const queuedSnapshot = "The queued preview sees a newer snapshot.";
  const latestSummary = "The save loop keeps edits made during the second request.";
  const firstPatchStarted = Promise.withResolvers<void>();
  const secondPatchStarted = Promise.withResolvers<void>();
  const releaseFirstPatch = Promise.withResolvers<void>();
  const releaseSecondPatch = Promise.withResolvers<void>();
  const articleApiPattern = "**/api/articles/*";
  let patchCount = 0;
  await page.route(articleApiPattern, async (route) => {
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    patchCount += 1;
    if (patchCount > 2) {
      await route.continue();
      return;
    }

    const response = await route.fetch();
    if (patchCount === 1) {
      firstPatchStarted.resolve();
      await releaseFirstPatch.promise;
    } else {
      secondPatchStarted.resolve();
      await releaseSecondPatch.promise;
    }
    await route.fulfill({ response });
  });

  await page.getByLabel("摘要").fill(firstSnapshot);
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await firstPatchStarted.promise;
  await page.getByRole("button", { name: "预览", exact: true }).click();
  await page.getByLabel("摘要").fill(queuedSnapshot);
  releaseFirstPatch.resolve();
  await secondPatchStarted.promise;
  await page.getByLabel("摘要").fill(latestSummary);
  releaseSecondPatch.resolve();
  await expect(page).toHaveURL(/\/preview$/);
  await page.unroute(articleApiPattern);
  expect(patchCount).toBe(3);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  await expect(page.getByText(latestSummary, { exact: true })).toBeVisible();
  await expect(page.getByText("Request lifecycle", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "继续编辑" }).click();
  await expect(page).toHaveURL(/\/edit$/);
  const publishResponse = page.waitForResponse(
    (response) => response.url().includes("/api/articles/") && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "发布", exact: true }).click();
  await expect((await publishResponse).status()).toBe(200);
  await expect(page).toHaveURL(/\/posts\/[0-9a-f-]+$/);
  await expect(page.getByRole("heading", { level: 1, name: title })).toBeVisible();
  const publishedImage = page.locator(".article-prose figure img");
  await publishedImage.scrollIntoViewIfNeeded();
  await expect(publishedImage).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await scrollToTop(page);
  await page.screenshot({ path: testInfo.outputPath("published.png"), fullPage: true });

  const publicUrl = page.url();
  await page.getByRole("link", { name: "编辑", exact: true }).click();
  await expect(page).toHaveURL(/\/edit$/);

  let cleanPreviewPatchCount = 0;
  const countCleanPreviewPatches = (request: import("@playwright/test").Request) => {
    if (request.method() === "PATCH" && request.url().includes("/api/articles/")) {
      cleanPreviewPatchCount += 1;
    }
  };
  page.on("request", countCleanPreviewPatches);
  await page.getByRole("button", { name: "预览", exact: true }).click();
  await expect(page).toHaveURL(/\/preview$/);
  page.off("request", countCleanPreviewPatches);
  expect(cleanPreviewPatchCount).toBe(0);
  expect((await page.request.get(publicUrl)).status()).toBe(200);

  await page.getByRole("link", { name: "继续编辑" }).click();
  await expect(page).toHaveURL(/\/edit$/);
  const draftOnlySummary = `Draft-only summary ${testInfo.project.name} ${Date.now()}`;
  await page.getByLabel("摘要").fill(draftOnlySummary);
  const draftSaveResponse = page.waitForResponse(
    (response) => response.url().includes("/api/articles/") && response.request().method() === "PATCH",
  );
  await page.getByRole("button", { name: "保存", exact: true }).click();
  await expect((await draftSaveResponse).status()).toBe(200);

  await page.goto(publicUrl);
  await expect(page.getByRole("heading", { name: "文章不存在" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  expect(await page.title()).not.toContain(title);
  const publicHead = await page.locator("head").innerHTML();
  expect(publicHead).not.toContain(title);
  expect(publicHead).not.toContain(draftOnlySummary);

  await page.goto(`${publicUrl}/edit`);
  await expect(page).toHaveURL(/\/edit$/);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "删除文章" }).click();
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { name: title })).toHaveCount(0);
});

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page) {
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  expect(hasOverflow).toBe(false);
}

async function scrollToTop(page: import("@playwright/test").Page) {
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
}
