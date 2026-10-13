import { randomUUID } from "node:crypto"
import type { Page } from "@playwright/test"
import { expect, test } from "./fixtures"

async function fillBrief(page: Page, contact = true) {
  await page.getByLabel("Ваше имя", { exact: true }).fill("Тестовый клиент")
  if (contact)
    await page.getByLabel("Email", { exact: true }).fill("e2e@example.com")
  await page.getByRole("combobox", { name: "Направление" }).click()
  await page
    .getByRole("option", { name: "Разработка сайтов", exact: true })
    .click()
  await page
    .getByLabel("Что хотите сделать?", { exact: true })
    .fill("Нужен корпоративный сайт с каталогом и формой обращения.")
  await page
    .getByRole("checkbox", {
      name: "Согласен на обработку персональных данных",
      exact: true,
    })
    .check()
}

test("посетитель переходит с главной и отправляет реальную заявку", async ({
  page,
  database,
}) => {
  await page.goto("/")
  await page
    .getByRole("link", { name: "Обсудить проект", exact: true })
    .first()
    .click()
  await expect(page).toHaveURL(/\/contacts$/)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Начнём с вашей задачи."
  )
  await fillBrief(page)

  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/leads") &&
      response.request().method() === "POST"
  )
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  const response = await saved
  expect(response.status()).toBe(201)
  expect(await response.json()).toMatchObject({
    ok: true,
    leadId: expect.any(String),
  })
  await expect(
    page.getByText("Спасибо. Заявка у нас.", { exact: true })
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Отправить заявку", exact: true })
  ).toHaveCount(0)
  expect(
    database
      .prepare(
        'SELECT name, email, notificationStatus, consentVersion FROM "Lead"'
      )
      .all()
  ).toEqual([
    {
      name: "Тестовый клиент",
      email: "e2e@example.com",
      notificationStatus: "skipped",
      consentVersion: "2026-10-06",
    },
  ])
  await page.getByRole("button", { name: "Отправить ещё одну заявку" }).click()
  await expect(page.getByLabel("Ваше имя", { exact: true })).toHaveValue("")
  await expect(page.getByLabel("Ваше имя", { exact: true })).toBeFocused()
  await expect(page.getByRole("checkbox")).not.toBeChecked()
})

test("юридические документы открываются отдельно и не стирают заполненную заявку", async ({
  page,
  database,
}) => {
  await page.goto("/contacts")
  await fillBrief(page)
  for (const href of ["/legal/privacy", "/legal/personal-data-consent"]) {
    const [document] = await Promise.all([
      page.waitForEvent("popup"),
      page.locator(`form a[href="${href}"]`).click(),
    ])
    await expect(document.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(document.getByRole("note")).toContainText(
      "Документ не утверждён"
    )
    await document.close()
    await expect(page.getByLabel("Ваше имя", { exact: true })).toHaveValue(
      "Тестовый клиент"
    )
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
      "e2e@example.com"
    )
    await expect(page.getByRole("checkbox")).toBeChecked()
  }
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(
    page.getByText("Спасибо. Заявка у нас.", { exact: true })
  ).toBeVisible()
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(1)
})

test("конкурентные HTTP-повторы сохраняют одну заявку, чужой Origin отклоняется", async ({
  request,
  database,
}) => {
  const data = {
    name: "Тест параллельной отправки",
    email: "parallel@example.com",
    service: "websites",
    message: "Нужен сайт для компании.",
    consent: true,
    submissionId: randomUUID(),
  }
  const rejected = await request.post("/api/leads", {
    data,
    headers: { Origin: "https://foreign.example" },
  })
  expect(rejected.status()).toBe(403)
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(0)
  const responses = await Promise.all(
    [0, 1].map(() =>
      request.post("/api/leads", {
        data,
        headers: { Origin: "http://127.0.0.1:3100" },
      })
    )
  )
  expect(responses.map((response) => response.status()).sort()).toEqual([
    200, 201,
  ])
  const bodies = await Promise.all(responses.map((response) => response.json()))
  expect(bodies[0]).toEqual(bodies[1])
  expect(
    database.prepare('SELECT id, notificationStatus FROM "Lead"').all()
  ).toEqual([{ id: bodies[0].leadId, notificationStatus: "skipped" }])
})

test("форма объясняет ошибки, фокусирует поле и требует один контакт", async ({
  page,
}) => {
  const requests: string[] = []
  page.on("request", (request) => {
    if (request.url().endsWith("/api/leads")) requests.push(request.url())
  })

  await page.goto("/contacts")
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(
    page.getByText("Укажите ваше имя", { exact: true })
  ).toBeVisible()
  await expect(page.getByLabel("Ваше имя", { exact: true })).toBeFocused()

  await fillBrief(page, false)
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(
    page.getByText(
      "Оставьте хотя бы один способ связи: email, телефон или Telegram",
      { exact: true }
    )
  ).toBeVisible()
  await expect(page.getByLabel("Email", { exact: true })).toBeFocused()
  expect(requests).toHaveLength(0)
})

test("повтор после потерянного ответа использует ту же сохранённую заявку", async ({
  page,
  database,
}) => {
  const submissionIds: string[] = []
  let originalLeadId: string | undefined
  let dropped = false

  await page.route("**/api/leads", async (route) => {
    const payload = route.request().postDataJSON() as { submissionId: string }
    submissionIds.push(payload.submissionId)
    if (!dropped) {
      dropped = true
      // The real endpoint saves the lead; only its delivery to the browser fails.
      const response = await route.fetch()
      expect(response.status()).toBe(201)
      const result = (await response.json()) as { ok: boolean; leadId: string }
      expect(result.ok).toBe(true)
      originalLeadId = result.leadId
      await route.abort("failed")
      return
    }
    await route.continue()
  })

  await page.goto("/contacts")
  await fillBrief(page)
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(
    page.getByText("Не получилось отправить", { exact: true })
  ).toBeVisible()
  await expect(page.getByLabel("Ваше имя", { exact: true })).toHaveValue(
    "Тестовый клиент"
  )

  const replay = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/leads") && response.status() === 200
  )
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  expect(await (await replay).json()).toEqual({
    ok: true,
    leadId: originalLeadId,
  })
  await expect(
    page.getByText("Спасибо. Заявка у нас.", { exact: true })
  ).toBeVisible()
  expect(submissionIds).toHaveLength(2)
  expect(submissionIds[0]).toBe(submissionIds[1])
  expect(database.prepare('SELECT id FROM "Lead"').all()).toEqual([
    { id: originalLeadId },
  ])
})

test("мобильная форма принимает только Telegram и сохраняет выбранное из ссылки направление", async ({
  page,
  database,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/contacts?service=telegram")
  await expect(
    page.getByRole("combobox", { name: "Направление" })
  ).toContainText("Telegram")
  await page.getByLabel("Ваше имя", { exact: true }).fill("Анна")
  await page.getByLabel("Telegram", { exact: true }).fill("@pulsar_client")
  await page
    .getByLabel("Что хотите сделать?", { exact: true })
    .fill("Нужен Telegram-бот для приёма заявок.")
  await page.getByRole("checkbox").check()
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(
    page.getByText("Спасибо. Заявка у нас.", { exact: true })
  ).toBeVisible()
  expect(
    database.prepare('SELECT email, phone, telegram, service FROM "Lead"').all()
  ).toEqual([
    {
      email: null,
      phone: null,
      telegram: "@pulsar_client",
      service: "telegram",
    },
  ])
})

test("пока запрос выполняется, форма блокирует повторную отправку", async ({
  page,
  database,
}) => {
  let release: (() => void) | undefined
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  let requests = 0
  await page.route("**/api/leads", async (route) => {
    requests++
    await gate
    await route.continue()
  })
  await page.goto("/contacts")
  await fillBrief(page)
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
  await expect(page.getByRole("button", { name: "Отправляем…" })).toBeDisabled()
  await expect(
    page.getByRole("status").filter({ hasText: "Отправляем заявку." })
  ).toHaveText("Отправляем заявку. Пожалуйста, подождите.")
  await expect(page.getByLabel("Ваше имя", { exact: true })).toBeDisabled()
  await expect(page.getByRole("checkbox")).toBeDisabled()
  await page
    .getByRole("form", { name: "Заявка на проект" })
    .evaluate((form) => (form as HTMLFormElement).requestSubmit())
  release?.()
  await expect(
    page.getByText("Спасибо. Заявка у нас.", { exact: true })
  ).toBeVisible()
  expect(requests).toBe(1)
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(1)
})

for (const status of [200, 503]) {
  test(`ответ ${status} с неверным контрактом не показывает ложный успех`, async ({
    page,
  }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({ status, json: { ok: true } })
    )
    await page.goto("/contacts")
    await fillBrief(page)
    await page
      .getByRole("button", { name: "Отправить заявку", exact: true })
      .click()
    await expect(
      page.getByText("Не получилось отправить", { exact: true })
    ).toBeVisible()
    await expect(
      page.getByText("Спасибо. Заявка у нас.", { exact: true })
    ).toHaveCount(0)
    await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
      "e2e@example.com"
    )
    await expect(
      page.getByRole("button", { name: "Отправить заявку", exact: true })
    ).toBeEnabled()
  })
}

test("API сам проверяет согласие, honeypot, повтор, конфликт и лимит запросов", async ({
  request,
  database,
}) => {
  const data = {
    name: "Тест API",
    phone: "+7 (999) 123-45-67",
    service: "websites",
    message: "Нужен новый сайт для нашей компании.",
    consent: true,
    submissionId: randomUUID(),
  }
  const post = (body: unknown) =>
    request.post("/api/leads", {
      data: body,
      headers: { Origin: "http://127.0.0.1:3100" },
    })
  const invalid = await post({ ...data, consent: false })
  expect(invalid.status()).toBe(422)
  expect((await invalid.json()).error.fieldErrors.consent).toHaveLength(1)
  expect((await post({ ...data, website: "spam" })).status()).toBe(400)
  const saved = await post(data)
  expect(saved.status()).toBe(201)
  const replay = await post(data)
  expect(replay.status()).toBe(200)
  expect(await replay.json()).toEqual(await saved.json())
  expect(
    (
      await post({
        ...data,
        message: "Другая задача с тем же идентификатором.",
      })
    ).status()
  ).toBe(409)
  const limited = await post({ ...data, submissionId: randomUUID() })
  expect(limited.status()).toBe(429)
  expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0)
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(1)
})
