import { expect, test } from "./fixtures"
import { fillContacts, submitRequest, expectSuccess } from "./request-helpers"

test("direct first touch wins over later tags; a lost response emits success only after retry", async ({
  page,
  database,
}) => {
  await page.addInitScript(() => {
    const events: unknown[] = []
    Object.assign(window, { auditFunnelEvents: events })
    window.addEventListener("pulsarweb:analytics", (event) =>
      events.push((event as CustomEvent).detail)
    )
  })
  await page.goto("/")
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("pulsarweb:first-touch:v1"))
    )
    .not.toBeNull()
  await page.goto("/start?service=telegram&utm_source=later&utm_content=later")
  await page.route(
    "**/api/leads",
    async (route) => {
      expect((await route.fetch()).status()).toBe(201)
      await route.abort("failed")
    },
    { times: 1 }
  )
  await fillContacts(page)
  await submitRequest(page)
  await expect(page.locator("form").getByRole("alert")).toContainText(
    "Не удалось получить ответ"
  )
  const events = () =>
    page.evaluate(
      () =>
        (window as unknown as { auditFunnelEvents: { name: string }[] })
          .auditFunnelEvents
    )
  expect((await events()).map((event) => event.name)).toEqual([
    "start_opened",
    "start_begun",
  ])
  await submitRequest(page)
  await expectSuccess(page)
  expect((await events()).map((event) => event.name)).toEqual([
    "start_opened",
    "start_begun",
    "start_completed",
  ])
  expect(
    database
      .prepare("SELECT landingPage, utmSource, utmContent FROM Lead")
      .all()
  ).toEqual([{ landingPage: "/", utmSource: null, utmContent: null }])
})

test("first-touch UTM survives landing reload and navigation; submit stores it and emits the funnel", async ({
  page,
  database,
}) => {
  await page.addInitScript(() => {
    const events: unknown[] = []
    Object.assign(window, { auditFunnelEvents: events })
    window.addEventListener("pulsarweb:analytics", (event) => {
      events.push((event as CustomEvent).detail)
    })
  })
  await page.goto(
    "/services/landing-pages?utm_source=yandex&utm_medium=cpc&utm_campaign=launch&utm_content=ad1&utm_term=landing",
    {
      referer: "https://search.example/results?q=private",
    }
  )
  // Capture has run when the initial snapshot is visible in sessionStorage.
  await expect
    .poll(() =>
      page.evaluate(() => sessionStorage.getItem("pulsarweb:first-touch:v1"))
    )
    .not.toBeNull()
  await page.reload()
  await page
    .locator("main")
    .getByRole("link", { name: "Обсудить лендинг", exact: true })
    .click()
  await expect(page.getByLabel("Имя", { exact: true })).toBeVisible()
  await fillContacts(page)
  await submitRequest(page)
  await expectSuccess(page)
  expect(
    database
      .prepare(
        "SELECT landingPage, referrer, utmSource, utmMedium, utmCampaign, utmContent, utmTerm FROM Lead"
      )
      .get()
  ).toEqual({
    landingPage: "/services/landing-pages",
    referrer: "https://search.example/results",
    utmSource: "yandex",
    utmMedium: "cpc",
    utmCampaign: "launch",
    utmContent: "ad1",
    utmTerm: "landing",
  })
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { auditFunnelEvents: unknown[] })
          .auditFunnelEvents
    )
  ).toEqual([
    { name: "start_opened", service: "landing-pages" },
    { name: "start_begun", service: "landing-pages" },
    { name: "start_completed", service: "landing-pages" },
  ])
})

test("WebGL unavailable keeps every hero page and the real request flow usable on mobile", async ({
  page,
  database,
}) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.includes("webgl")) return null
      return Reflect.apply(original, this, [type, ...args])
    } as typeof original
  })
  for (const route of ["/", "/about", "/contacts", "/start"]) {
    await page.goto(route)
    await expect(page.locator("h1")).not.toHaveText(
      "Не удалось открыть страницу"
    )
    await expect(page.locator("[data-hero-fallback]")).toBeVisible()
    // The failed Canvas is removed by its local error boundary.
    await expect(page.locator(".hero-webgl-layer")).toHaveCount(0)
    await expect(page.locator("main")).toBeVisible()
  }
  await page
    .getByRole("button", { name: "Оставить заявку", exact: true })
    .click()
  await page
    .getByRole("button", { name: "Лендинг под рекламу", exact: true })
    .click()
  await page.getByRole("button", { name: "Далее", exact: true }).click()
  await fillContacts(page)
  await submitRequest(page)
  await expectSuccess(page)
  expect(database.prepare("SELECT COUNT(*) AS total FROM Lead").get()).toEqual({
    total: 1,
  })
})

test("a lost WebGL context falls back without replacing the page", async ({
  page,
}) => {
  await page.goto("/")
  await expect(page.locator('[data-ready="true"] canvas')).toBeVisible()
  await page.locator("canvas").evaluate((canvas) => {
    canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true }))
  })
  await expect(page.locator("canvas")).toHaveCount(0)
  await expect(page.locator("[data-hero-fallback]")).toBeVisible()
  await page
    .locator("main")
    .getByRole("link", { name: "Обсудить проект", exact: true })
    .first()
    .click()
  await expect(
    page.getByRole("button", { name: "Оставить заявку", exact: true })
  ).toBeVisible()
})

test("failed Three.js chunk leaves the page and CTA usable", async ({
  page,
}) => {
  let blocked = false
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch()
    // Identify the installed Three.js renderer chunk rather than a build hash.
    if ((await response.text()).includes("Error creating WebGL context")) {
      blocked = true
      await route.abort("failed")
    } else {
      await route.fulfill({ response })
    }
  })
  await page.goto("/")
  await expect.poll(() => blocked).toBe(true)
  await expect(page.locator(".hero-webgl-layer")).toHaveCount(0)
  await expect(page.locator("h1")).toHaveText(
    "Сайты, которые приносят заявки и продажи"
  )
  await page
    .locator("main")
    .getByRole("link", { name: "Обсудить проект", exact: true })
    .first()
    .click()
  await page
    .getByRole("button", { name: "Оставить заявку", exact: true })
    .click()
  await expect(
    page.getByRole("button", { name: "Далее", exact: true })
  ).toBeVisible()
})
