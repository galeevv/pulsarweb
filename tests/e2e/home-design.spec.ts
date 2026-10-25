import { expect, test } from "@playwright/test"

test("услуги чередуют широкую и узкую карточки с общей высотой", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await expect(page.locator("#services h2")).toHaveText("Что мы делаем")
  await expect(page.locator("#projects h2")).toHaveText("Наши проекты")
  await expect(page.locator("#services .eyebrow")).toHaveCount(0)
  expect(
    await page
      .locator(".home-motion section[id]")
      .evaluateAll((nodes) => nodes.map((node) => node.id))
  ).toEqual(["services", "process", "projects", "why-pulsarweb"])
  await expect(page.locator('#why-pulsarweb a[href="/start"]')).toHaveText(
    "Обсудить проект"
  )
  const boxes = await page.locator(".service-visual").evaluateAll((nodes) =>
    nodes.map((node) => {
      const { width, height, y } = node.getBoundingClientRect()
      return { width, height, y }
    })
  )
  const gap = await page
    .locator(".service-grid")
    .evaluate((node) => parseFloat(getComputedStyle(node).columnGap))
  for (const index of [0, 2]) {
    const wide = boxes[index === 0 ? 0 : 3]
    const narrow = boxes[index === 0 ? 1 : 2]
    expect((wide.width - gap) / narrow.width).toBeCloseTo(2, 1)
    expect(boxes[index].height).toBe(boxes[index + 1].height)
    expect(boxes[index].y).toBe(boxes[index + 1].y)
  }
  await expect(page.locator("#projects article")).toHaveCount(2)
  await expect(page.locator("#projects article dl > div")).toHaveCount(0)
  for (const id of ["services", "projects", "process", "why-pulsarweb"]) {
    await page.locator("#" + id).scrollIntoViewIfNeeded()
    await expect(page.locator("#" + id + " h2")).toBeVisible()
  }
  expect(
    await page
      .locator(".home-motion")
      .evaluate((node) => node.getAnimations({ subtree: true }).length)
  ).toBe(0)
})

test("содержимое главной доступно без JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto("http://127.0.0.1:3100/")
  await expect(page.locator("#services h2")).toBeVisible()
  await expect(page.locator("#projects article")).toHaveCount(2)
  await page.locator("#services a").first().click()
  await expect(page).toHaveURL(/services\/landing-pages$/)
  await context.close()
})
