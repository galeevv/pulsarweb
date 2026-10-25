import { expect, test } from "@playwright/test"

test("четыре продукта, отдельное сопровождение и совместимость старых ссылок", async ({
  page,
  request,
}) => {
  await page.goto("/")
  await expect(page.locator("#services a")).toHaveCount(4)
  await expect(
    page.locator('#services a[href="/services/ecommerce"]')
  ).toBeVisible()
  await expect(page.locator("#why-pulsarweb")).toContainText(
    "Инфраструктура и запуск включены"
  )
  for (const [legacy, current] of [
    ["websites", "landing-pages"],
    ["desktop", "other"],
    ["web-systems", "other"],
  ]) {
    await page.goto(`/start?service=${legacy}`)
    await expect(page.getByLabel("Задача и желаемый результат")).toBeVisible()
    await page.getByRole("button", { name: "Назад", exact: true }).click()
    await expect(
      page.getByRole("button", {
        name:
          current === "landing-pages" ? "Лендинг под рекламу" : "Другой проект",
        exact: true,
      })
    ).toHaveAttribute("aria-pressed", "true")
  }
  for (const [legacy, current] of [
    ["websites", "landing-pages"],
    ["infrastructure", ""],
  ]) {
    const response = await request.get(`/services/${legacy}`, {
      maxRedirects: 0,
    })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toBe(
      `/services${current ? `/${current}` : ""}`
    )
  }
  for (const legacy of ["desktop", "web-systems"]) {
    await page.goto(`/services/${legacy}`)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/
    )
    await expect(page.locator('main a[href*="service=other"]')).toHaveCount(2)
  }
})

test("мобильная навигация поддерживает клавиатуру и переход к контактам", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  const trigger = page.getByRole("button", {
    name: "Открыть меню",
    exact: true,
  })
  await trigger.focus()
  await page.keyboard.press("Enter")
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(trigger).toBeFocused()

  await trigger.click()
  await page
    .getByRole("navigation", { name: "Мобильная навигация" })
    .getByRole("link", { name: "Контакты", exact: true })
    .click()
  await expect(page).toHaveURL(/\/contacts$/)
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Начнём с вашей задачи."
  )
})

for (const width of [320, 768, 1024, 1440, 1920]) {
  test(`маркетинговые страницы помещаются на экране ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 })
    for (const path of [
      "/",
      "/services",
      "/services/ecommerce",
      "/projects",
      "/projects/pulsar-cloud",
      "/about",
      "/contacts",
      "/start",
      "/legal/privacy",
      "/legal/personal-data-consent",
      "/legal/cookies",
    ]) {
      await page.goto(path)
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth
      )
      expect(overflow, `${path} must not overflow at ${width}px`).toBe(false)
    }
  })
}

test("каждая услуга ведёт к форме с выбранным направлением, FAQ доступен с клавиатуры", async ({
  page,
}) => {
  for (const slug of [
    "landing-pages",
    "corporate-websites",
    "ecommerce",
    "telegram",
    "other",
    "support",
  ]) {
    await page.goto("/services")
    const service = page.locator(`main a[href="/services/${slug}"]`)
    await service.click()
    await expect(page).toHaveURL(`/services/${slug}`)
    const faq = page.locator("main button[aria-expanded]").first()
    await faq.focus()
    await page.keyboard.press("Enter")
    await expect(faq).toHaveAttribute("aria-expanded", "true")
    const callsToAction = page.locator(`main a[href^="/start"]`)
    await expect(callsToAction).toHaveCount(2)
    await callsToAction.last().click()
    await expect(page).toHaveURL(/\/start\?/)
    await expect(
      page.getByLabel(
        slug === "support"
          ? "Задачи по сопровождению"
          : "Задача и желаемый результат",
        { exact: true }
      )
    ).toBeVisible()
  }
})

test("юридические черновики имеют содержание, noindex и путь обратно к форме", async ({
  page,
}) => {
  for (const slug of ["privacy", "personal-data-consent", "cookies"]) {
    await page.goto(`/legal/${slug}`)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/
    )
    await expect(page.getByRole("note")).toContainText("Документ не утверждён")
    await page
      .getByRole("navigation", { name: "Содержание документа" })
      .getByRole("link")
      .last()
      .click()
    await expect(page).toHaveURL(/#legal-section-\d+$/)
    await page.getByRole("link", { name: "Вернуться к форме" }).click()
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Что хотите создать?"
    )
  }
})
