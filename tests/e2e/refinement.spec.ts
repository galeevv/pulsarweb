import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"
import {
  expectSuccess,
  fillContacts,
  nextStep,
  submitRequest,
} from "./request-helpers"

const routes = [
  "/",
  "/services",
  "/services/landing-pages",
  "/services/corporate-websites",
  "/services/ecommerce",
  "/services/web-systems",
  "/services/telegram",
  "/services/desktop",
  "/services/other",
  "/services/support",
  "/projects",
  "/projects/pulsar-cloud",
  "/about",
  "/contacts",
  "/start",
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

test("wizard доступен с клавиатуры на 320px на всех шагах", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto("/start")
  const service = page.getByRole("button", {
    name: "Лендинг под рекламу",
    exact: true,
  })
  await service.focus()
  await page.keyboard.press("Space")
  await expect(service).toHaveAttribute("aria-pressed", "true")
  await checkAccessibility(page)
  await nextStep(page)
  await nextStep(page)
  await expect(page.getByLabel("Задача и желаемый результат")).toBeFocused()
  await checkAccessibility(page)
  await page
    .getByLabel("Задача и желаемый результат")
    .fill("Нужен новый сайт для компании с каталогом услуг.")
  await nextStep(page)
  await checkAccessibility(page)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  await nextStep(page)
  await submitRequest(page)
  await expect(page.getByLabel("Имя", { exact: true })).toBeFocused()
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
        : {
            status: 201,
            json: { ok: true, leadId: "refinement-test", publicId: "PW-1042" },
          }
    )
  })
  await page.goto("/start?service=websites")

  await fillContacts(page)
  await submitRequest(page)
  const alert = page
    .getByRole("form", { name: "Заявка на проект" })
    .getByRole("alert")
  await expect(alert).toContainText("Сервис временно недоступен")
  await expect(alert).toBeFocused()
  await expect(page.getByLabel("Имя", { exact: true })).toHaveValue(
    "Тестовый клиент"
  )
  await checkAccessibility(page)
  await submitRequest(page)
  await expectSuccess(page)
  await checkAccessibility(page)
})

test("query выбирает услугу, неизвестный тип возвращает к выбору", async ({
  page,
}) => {
  for (const query of [
    "?service=infrastructure",
    "?service=wrong",
    "?service=websites&service=support",
  ]) {
    await page.goto("/start" + query)
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Что хотите создать?"
    )
  }
  await page.goto("/contacts?service=telegram")
  await expect(page).toHaveURL(/\/start\?service=telegram/)
  await expect(page.getByLabel("Задача и желаемый результат")).toBeVisible()
})

test("SEO: уникальные заголовки, canonical без query и изображения для соцсетей", async ({
  page,
  request,
}) => {
  const titles = new Set<string>()
  for (const path of routes) {
    await page.goto(path === "/start" ? "/start?service=telegram" : path)
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
