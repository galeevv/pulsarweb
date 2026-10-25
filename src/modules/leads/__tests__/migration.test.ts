import { readFileSync } from "node:fs"
import path from "node:path"
import Database from "better-sqlite3"
import { expect, it } from "vitest"

it("preserves legacy leads, consent and delivery data and continues public numbering", () => {
  const database = new Database(":memory:")
  const migration = (name: string) =>
    readFileSync(
      path.join(process.cwd(), "prisma/migrations", name, "migration.sql"),
      "utf8"
    )
  try {
    database.exec(migration("20261006000000_initial"))
    const insert = database.prepare(
      `INSERT INTO Lead (id, submissionId, payloadHash, name, email, service, message, consentVersion, createdAt, notificationStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    insert.run(
      "old-project",
      "old-submission-1",
      "hash-1",
      "Иван",
      "ivan@example.com",
      "websites",
      "Первоначальная задача",
      "2026-10-06",
      "2026-10-06T09:00:00.000Z",
      "sent"
    )
    insert.run(
      "old-support",
      "old-submission-2",
      "hash-2",
      "Анна",
      "anna@example.com",
      "support",
      "Сопровождение проекта",
      "2026-10-06",
      "2026-10-07T09:00:00.000Z",
      "failed"
    )
    const original = database
      .prepare(
        "SELECT id, submissionId, payloadHash, name, email, service, message, consentVersion, consentAt, createdAt, notificationStatus FROM Lead ORDER BY id"
      )
      .all()
    database.exec(migration("20261015000100_project_requests"))
    expect(
      database
        .prepare(
          "SELECT id, submissionId, payloadHash, name, email, service, message, consentVersion, consentAt, createdAt, notificationStatus FROM Lead ORDER BY id"
        )
        .all()
    ).toEqual(original)
    expect(
      database
        .prepare(
          "SELECT publicId, requestKind, status, consent, updatedAt = createdAt AS sameDate FROM Lead ORDER BY createdAt"
        )
        .all()
    ).toEqual([
      {
        publicId: "PW-1001",
        requestKind: "PROJECT",
        status: "NEW",
        consent: 1,
        sameDate: 1,
      },
      {
        publicId: "PW-1002",
        requestKind: "SUPPORT",
        status: "NEW",
        consent: 1,
        sameDate: 1,
      },
    ])
    expect(
      database
        .prepare(
          "UPDATE LeadSequence SET value = value + 1 WHERE id = 1 RETURNING value"
        )
        .get()
    ).toEqual({ value: 1003 })
  } finally {
    database.close()
  }
})
