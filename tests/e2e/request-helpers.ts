import { expect, type Page } from "@playwright/test"

export async function nextStep(page: Page) {
  await page.getByRole("button", { name: "Далее", exact: true }).click()
}

export async function fillContacts(page: Page, contact = true) {
  await page.getByLabel("Имя", { exact: true }).fill("Тестовый клиент")
  if (contact)
    await page
      .getByLabel("Почта или Telegram", { exact: true })
      .fill("Pulsar_Client")
  await page
    .getByRole("checkbox", {
      name: "Я соглашаюсь на обработку персональных данных.",
    })
    .check()
}

export async function submitRequest(page: Page) {
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click()
}

export async function expectSuccess(page: Page) {
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Заявка отправлена"
  )
  await expect(page.getByText(/^PW-\d+$/)).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Написать напрямую в Telegram" })
  ).toHaveAttribute("href", "https://t.me/galeev66")
}
