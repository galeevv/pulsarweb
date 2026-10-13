import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

const routes = [
  "/",
  "/services",
  "/services/websites",
  "/services/web-systems",
  "/services/telegram",
  "/services/desktop",
  "/services/infrastructure",
  "/services/support",
  "/projects",
  "/projects/pulsar-cloud",
  "/about",
  "/contacts",
  "/legal/privacy",
  "/legal/personal-data-consent",
  "/legal/cookies",
]

async function checkAccessibility(page: Page) {
  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(
          (animation) => animation.effect?.getTiming().iterations !== Infinity
        )
        .map((animation) => animation.finished.catch(() => {}))
    )
  })
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    // Base UI sentinels immediately redirect focus; exercise real Tab paths below.
    // Keep aria-hidden-focus enabled for all actual controls and content.
    .exclude("[data-base-ui-focus-guard]")
    .analyze()
  expect(result.violations).toEqual([])
}

for (const width of [390, 1440]) {
  test(`доступность и отсутствие ошибок браузера на ${width}px`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text())
    })
    await page.setViewportSize({ width, height: 900 })
    for (const path of routes) {
      await test.step(path, async () => {
        await page.goto(path)
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1)
        await checkAccessibility(page)
      })
    }
    expect(errors).toEqual([])
  })
}

test("skip link, короткий экран и фокус внутри мобильного меню", async ({
  page,
}) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await page.goto("/")
  await page.keyboard.press("Tab")
  const skip = page.getByRole("link", { name: "Перейти к содержимому" })
  await expect(skip).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.locator("#main")).toBeFocused()
  const trigger = page.getByRole("button", { name: "Открыть меню" })
  await trigger.click()
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await checkAccessibility(page)
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab")
    expect(
      await dialog.evaluate((node) => node.contains(document.activeElement))
    ).toBe(true)
  }
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("форма, Select и ошибки доступны с клавиатуры при reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto("/contacts")
  const select = page.getByRole("combobox", { name: "Направление" })
  await select.focus()
  await page.keyboard.press("ArrowDown")
  await expect(page.getByRole("listbox")).toBeVisible()
  await checkAccessibility(page)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  const duration = await page
    .locator('[data-slot="select-content"]')
    .evaluate((node) =>
      Math.max(
        ...getComputedStyle(node).animationDuration.split(",").map(parseFloat)
      )
    )
  expect(duration).toBeLessThanOrEqual(0.00001)
  await page.keyboard.press("Escape")
  await expect(select).toBeFocused()
  await page.keyboard.press("Tab")
  await expect(page.getByLabel("Бюджет · необязательно")).toBeFocused()
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(page.getByLabel("Ваше имя", { exact: true })).toBeFocused()
  await checkAccessibility(page)
})

test("ошибка сервера сохраняет поля и фокус, повторная отправка показывает успех", async ({
  page,
}) => {
  let attempts = 0
  await page.route("**/api/leads", (route) => {
    attempts++
    return route.fulfill(
      attempts === 1
        ? {
            status: 503,
            json: {
              ok: false,
              error: {
                code: "unavailable",
                message: "Сервис временно недоступен. Попробуйте ещё раз.",
              },
              requestId: "refinement-test",
            },
          }
        : { status: 201, json: { ok: true, leadId: "refinement-test" } }
    )
  })
  await page.goto("/contacts?service=websites")
  await page.getByLabel("Ваше имя", { exact: true }).fill("Анна")
  await page.getByLabel("Email", { exact: true }).fill("anna@example.com")
  await page
    .getByLabel("Что хотите сделать?", { exact: true })
    .fill("Нужен сайт для нового проекта.")
  await page.getByRole("checkbox").check()
  const submit = page.getByRole("button", {
    name: "Отправить заявку",
    exact: true,
  })
  await submit.click()
  const alert = page
    .getByRole("form", { name: "Заявка на проект" })
    .getByRole("alert")
  await expect(alert).toContainText("Сервис временно недоступен")
  await expect(alert.locator("..")).toBeFocused()
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "anna@example.com"
  )
  await checkAccessibility(page)
  await submit.click()
  await expect(
    page.getByText("Спасибо. Заявка у нас.", { exact: true })
  ).toBeVisible()
  await checkAccessibility(page)
  await page.getByRole("button", { name: "Отправить ещё одну заявку" }).click()
  await expect(page.getByLabel("Ваше имя", { exact: true })).toHaveValue("")
  await expect(page.getByLabel("Ваше имя", { exact: true })).toBeFocused()
})

test("загрузка контактов показывает skeleton, затем доступную форму", async ({
  page,
}) => {
  const prefetched = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/contacts" &&
      response.request().headers()["next-router-prefetch"] === "1" &&
      !response.request().headers()["next-router-segment-prefetch"]
  )
  await page.goto("/")
  await prefetched
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route("**/contacts?*", async (route) => {
    const headers = route.request().headers()
    if (headers.rsc === "1" && headers["next-router-prefetch"] !== "1")
      await gate
    await route.continue()
  })
  try {
    await page
      .getByRole("link", { name: "Обсудить проект", exact: true })
      .first()
      .click()
    await expect(page.getByRole("status")).toHaveText("Загружаем форму…")
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Начнём с вашей задачи."
    )
    await checkAccessibility(page)
  } finally {
    release()
  }
  await expect(
    page.getByRole("combobox", { name: "Направление" })
  ).toBeVisible()
  await expect(page.getByText("Загружаем форму…", { exact: true })).toHaveCount(
    0
  )
})

test("SEO: уникальные заголовки, canonical без query и изображения для соцсетей", async ({
  page,
  request,
}) => {
  const titles = new Set<string>()
  for (const path of routes) {
    await page.goto(path === "/contacts" ? "/contacts?service=telegram" : path)
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    const url = new URL((await canonical.getAttribute("href"))!)
    expect(url.origin).toBe(new URL(page.url()).origin)
    expect(url.pathname).toBe(path)
    expect(url.search).toBe("")
    const title = await page.title()
    expect(titles.has(title)).toBe(false)
    titles.add(title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S+/
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https?:\/\//
    )
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      "content",
      /^https?:\/\//
    )
    for (const selector of [
      'meta[property="og:image"]',
      'meta[name="twitter:image"]',
    ]) {
      const imageUrl = await page.locator(selector).getAttribute("content")
      expect(new URL(imageUrl!).origin).toBe(url.origin)
    }
    const socialUrl = await page
      .locator('meta[property="og:url"]')
      .getAttribute("content")
    expect(new URL(socialUrl!).href).toBe(url.href)
    if (path.startsWith("/legal/") || path === "/projects/pulsar-cloud") {
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/
      )
    }
  }
  const sitemap = await (await request.get("/sitemap.xml")).text()
  expect(sitemap).not.toContain("/legal/")
  expect(sitemap).not.toContain("/projects/pulsar-cloud")
  const image = await request.get("/opengraph-image")
  expect(image.headers()["content-type"]).toBe("image/png")
  const png = await image.body()
  expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630])
})

test("неизвестные адреса возвращают 404, noindex и рабочий путь на главную", async ({
  page,
}) => {
  for (const path of [
    "/missing-page",
    "/services/missing-service",
    "/legal/missing-document",
  ]) {
    const response = await page.goto(path)
    expect(response?.status()).toBe(404)
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
    await checkAccessibility(page)
    await page.getByRole("link", { name: "На главную", exact: true }).click()
    await expect(page).toHaveURL("/")
  }
})
