import { randomUUID } from "node:crypto"
import { expect, test } from "./fixtures"
import {
  expectSuccess,
  fillContacts,
  nextStep,
  submitRequest,
} from "./request-helpers"

test("главная → магазин → Telegram → реальная заявка", async ({
  page,
  database,
}) => {
  await page.goto("/")
  await page
    .getByRole("link", { name: "Обсудить проект", exact: true })
    .first()
    .click()
  await expect(page).toHaveURL(/\/start$/)
  await expect(
    page.getByRole("button", { name: /Инфраструктура/ })
  ).toHaveCount(0)
  await page
    .getByRole("button", { name: "Интернет-магазин", exact: true })
    .click()
  await nextStep(page)
  await expect(page.getByRole("checkbox")).not.toBeChecked()
  await fillContacts(page)
  await expect(page.getByRole("region", { name: "Ваш проект" })).toHaveCount(0)
  const responsePromise = page.waitForResponse("**/api/leads")
  await submitRequest(page)
  const response = await responsePromise
  expect(response.status()).toBe(201)
  const result = await response.json()
  await expectSuccess(page)
  expect(
    database
      .prepare(
        'SELECT id, publicId, service, requestKind, status, message, budget, timeline, telegram, email, phone, consent, sourceUrl, notificationStatus FROM "Lead"'
      )
      .all()
  ).toEqual([
    {
      id: result.leadId,
      publicId: result.publicId,
      service: "ecommerce",
      requestKind: "PROJECT",
      status: "NEW",
      message: "",
      budget: null,
      timeline: null,
      telegram: "@pulsar_client",
      email: null,
      phone: null,
      consent: 1,
      sourceUrl: "/start",
      notificationStatus: "skipped",
    },
  ])
})

test("мобильное сопровождение пропускает выбор и сохраняет проект и UTM", async ({
  page,
  database,
}) => {
  await page.setViewportSize({ width: 320, height: 844 })
  await page.goto(
    "/start?service=support&source=%2Fservices%2Fsupport&utm_source=telegram&utm_medium=social&utm_campaign=launch"
  )
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Как с вами связаться?"
  )
  await fillContacts(page)
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true)
  await submitRequest(page)
  await expectSuccess(page)
  expect(
    database
      .prepare(
        'SELECT service, requestKind, projectReference, companyContext, budget, timeline, sourceUrl, utmSource, utmMedium, utmCampaign FROM "Lead"'
      )
      .all()
  ).toEqual([
    {
      service: "support",
      requestKind: "SUPPORT",
      projectReference: null,
      companyContext: null,
      budget: null,
      timeline: null,
      sourceUrl: "/services/support",
      utmSource: "telegram",
      utmMedium: "social",
      utmCampaign: "launch",
    },
  ])
})

test("возврат по шагам и legal сохраняют черновик, перезагрузка очищает", async ({
  page,
  database,
}) => {
  await page.goto("/start?service=websites")

  await fillContacts(page)
  await page.getByRole("button", { name: "Назад", exact: true }).click()
  await nextStep(page)
  await expect(page.getByLabel("Имя", { exact: true })).toHaveValue(
    "Тестовый клиент"
  )
  const [document] = await Promise.all([
    page.waitForEvent("popup"),
    page.getByRole("link", { name: "Условия обработки данных" }).click(),
  ])
  await expect(document.getByRole("heading", { level: 1 })).toBeVisible()
  await document.close()
  await expect(page.getByRole("checkbox")).toBeChecked()
  await submitRequest(page)
  await expectSuccess(page)
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(1)
  await page.reload()
  await expect(page.getByLabel("Имя", { exact: true })).toHaveValue("")
})

test("валидация шагов, контакт и согласие не отправляют ошибочную форму", async ({
  page,
}) => {
  const requests: string[] = []
  page.on("request", (request) => {
    if (request.url().endsWith("/api/leads")) requests.push(request.url())
  })
  await page.goto("/start?service=websites")

  await submitRequest(page)
  await expect(page.getByLabel("Имя", { exact: true })).toBeFocused()
  await fillContacts(page, false)
  await submitRequest(page)
  await expect(
    page.getByText("Укажите корректную почту или Telegram в формате @username")
  ).toBeVisible()
  await expect(
    page.getByLabel("Почта или Telegram", { exact: true })
  ).toBeFocused()
  await page
    .getByLabel("Почта или Telegram", { exact: true })
    .pressSequentially("pulsar_client")
  await expect(
    page.getByLabel("Почта или Telegram", { exact: true })
  ).toHaveValue("pulsar_client")
  await page.getByRole("checkbox").uncheck()
  await submitRequest(page)
  await expect(page.getByRole("checkbox")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  expect(requests).toHaveLength(0)
})

test("потерянный ответ повторяет сохранённую заявку без нового номера", async ({
  page,
  database,
}) => {
  const ids: string[] = []
  let saved: { ok: boolean; leadId: string; publicId: string } | undefined
  await page.route("**/api/leads", async (route) => {
    ids.push(route.request().postDataJSON().submissionId)
    if (!saved) {
      const response = await route.fetch()
      expect(response.status()).toBe(201)
      saved = await response.json()
      await route.abort("failed")
    } else await route.continue()
  })
  await page.goto("/start?service=websites")

  await fillContacts(page)
  await submitRequest(page)
  await expect(
    page.getByRole("form", { name: "Заявка на проект" }).getByRole("alert")
  ).toContainText("Не удалось получить ответ")
  const replay = page.waitForResponse("**/api/leads")
  await submitRequest(page)
  const response = await replay
  expect(response.status()).toBe(200)
  expect(await response.json()).toEqual(saved)
  await expectSuccess(page)
  expect(ids).toHaveLength(2)
  expect(ids[0]).toBe(ids[1])
  expect(database.prepare('SELECT id, publicId FROM "Lead"').all()).toEqual([
    { id: saved?.leadId, publicId: saved?.publicId },
  ])
})

test("pending блокирует повторную отправку и поля", async ({
  page,
  database,
}) => {
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  let requests = 0
  await page.route("**/api/leads", async (route) => {
    requests++
    await gate
    await route.continue()
  })
  await page.goto("/start?service=other")

  await fillContacts(page)
  await submitRequest(page)
  await expect(page.getByRole("button", { name: "Отправляем…" })).toBeDisabled()
  await expect(page.getByRole("status")).toContainText("Отправляем заявку")
  await expect(page.getByLabel("Имя", { exact: true })).toBeDisabled()
  await page
    .getByRole("form", { name: "Заявка на проект" })
    .evaluate((form) => (form as HTMLFormElement).requestSubmit())
  release()
  await expectSuccess(page)
  expect(requests).toBe(1)
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(1)
})

for (const status of [200, 503]) {
  test(`неверный контракт ответа ${status} не показывает ложный успех`, async ({
    page,
  }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({ status, json: { ok: true } })
    )
    await page.goto("/start?service=telegram")

    await fillContacts(page)
    await submitRequest(page)
    await expect(
      page.getByRole("form", { name: "Заявка на проект" }).getByRole("alert")
    ).toContainText("Не удалось получить ответ")
    await expect(page.getByLabel("Имя", { exact: true })).toHaveValue(
      "Тестовый клиент"
    )
    await expect(
      page.getByRole("button", { name: "Отправить заявку" })
    ).toBeEnabled()
  })
}

test("конкурентные HTTP-повторы сохраняют одну заявку, чужой Origin отклоняется", async ({
  request,
  database,
}) => {
  const data = {
    name: "Тест параллельной отправки",
    email: "parallel@example.com",
    service: "websites",
    description: "Нужен сайт для компании.",
    consent: true,
    submissionId: randomUUID(),
  }
  expect(
    (
      await request.post("/api/leads", {
        data,
        headers: { Origin: "https://foreign.example" },
      })
    ).status()
  ).toBe(403)
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
    database
      .prepare('SELECT id, publicId, notificationStatus FROM "Lead"')
      .all()
  ).toEqual([
    {
      id: bodies[0].leadId,
      publicId: bodies[0].publicId,
      notificationStatus: "skipped",
    },
  ])
})

test("API проверяет согласие, honeypot, повтор, конфликт и лимит", async ({
  request,
  database,
}) => {
  const data = {
    name: "Тест API",
    phone: "+7 (999) 123-45-67",
    service: "websites",
    description: "Нужен новый сайт для нашей компании.",
    consent: true,
    submissionId: randomUUID(),
  }
  const post = (body: unknown) =>
    request.post("/api/leads", {
      data: body,
      headers: { Origin: "http://127.0.0.1:3100" },
    })
  expect((await post({ ...data, consent: false })).status()).toBe(422)
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
        description: "Другая задача с тем же идентификатором.",
      })
    ).status()
  ).toBe(409)
  const limited = await post({ ...data, submissionId: randomUUID() })
  expect(limited.status()).toBe(429)
  expect(Number(limited.headers()["retry-after"])).toBeGreaterThan(0)
  expect(database.prepare('SELECT id FROM "Lead"').all()).toHaveLength(1)
})

test("выбор услуги и повторный возврат не вызывают ошибок DOM", async ({
  page,
}) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/start")
  await expect(page.locator("footer")).toHaveCount(0)
  await expect(
    page.getByRole("button", { name: "Сопровождение", exact: true })
  ).toHaveCount(0)
  await expect(page.getByText("Шаг 1 из 4")).toHaveCount(0)
  for (let attempt = 0; attempt < 3; attempt++) {
    await page
      .getByRole("button", { name: "Интернет-магазин", exact: true })
      .click()
    await nextStep(page)
    await page.getByRole("button", { name: "Назад", exact: true }).click()
    await expect(
      page.getByRole("heading", { name: "Что хотите создать?" })
    ).toBeVisible()
    // Clear the selection so each iteration starts in the same state.
    await page
      .getByRole("button", { name: "Интернет-магазин", exact: true })
      .click()
  }
  expect(errors).toEqual([])
})

test("единое поле сохраняет почту", async ({ page, database }) => {
  await page.goto("/start?service=ecommerce")
  await fillContacts(page, false)
  await page.getByLabel("Почта или Telegram").fill("client@example.com")
  await submitRequest(page)
  await expectSuccess(page)
  expect(
    database.prepare('SELECT email, telegram, message FROM "Lead"').get()
  ).toEqual({
    email: "client@example.com",
    telegram: null,
    message: "",
  })
})

test("пустые имя, контакт и согласие показывают ошибки одновременно", async ({
  page,
}) => {
  await page.goto("/start?service=ecommerce")
  await submitRequest(page)
  await expect(page.getByLabel("Имя", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  await expect(page.getByLabel("Почта или Telegram")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  await expect(page.getByRole("checkbox")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
  await page.getByLabel("Имя", { exact: true }).fill("Анна")
  await submitRequest(page)
  await expect(page.getByLabel("Почта или Telegram")).toBeFocused()
  await expect(page.getByRole("checkbox")).toHaveAttribute(
    "aria-invalid",
    "true"
  )
})
