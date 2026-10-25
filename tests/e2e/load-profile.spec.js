import { test } from "@playwright/test"
import { writeFileSync } from "node:fs"

test("измерение влияния WebGL на первый экран", async ({ browser }) => {
  test.skip(
    !process.env.PROFILE_HOME && !process.env.PROFILE_REPEAT,
    "Opt-in performance measurement"
  )
  test.setTimeout(180_000)
  const results = []
  for (let run = 0; run < (process.env.PROFILE_REPEAT ? 1 : 3); run++) {
    for (const mode of process.env.PROFILE_REPEAT
      ? ["normal"]
      : ["normal", "no-webgl", "no-webgl-no-reveal"]) {
      const context = await browser.newContext({
        viewport: { width: 1671, height: 1244 },
      })
      await context.addInitScript(
        ({ mode }) => {
          const stats = {
            mode,
            longTasks: [],
            lcp: 0,
            frames: [],
            gl: {},
            renderer: "",
            firstDraw: 0,
          }
          window.__perf = stats
          new PerformanceObserver((list) =>
            list
              .getEntries()
              .forEach((e) =>
                stats.longTasks.push({
                  start: e.startTime,
                  duration: e.duration,
                })
              )
          ).observe({ type: "longtask", buffered: true })
          new PerformanceObserver((list) =>
            list.getEntries().forEach((e) => {
              stats.lcp = e.startTime
            })
          ).observe({ type: "largest-contentful-paint", buffered: true })
          let previous = 0
          function tick(now) {
            if (previous) stats.frames.push(now - previous)
            previous = now
            requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          const original = HTMLCanvasElement.prototype.getContext
          HTMLCanvasElement.prototype.getContext = function (type, ...args) {
            if (String(type).includes("webgl") && mode !== "normal") return null
            const start = performance.now()
            const result = original.call(this, type, ...args)
            if (String(type).includes("webgl") && result) {
              stats.gl.contextMs = performance.now() - start
              const ext = result.getExtension("WEBGL_debug_renderer_info")
              stats.renderer = ext
                ? result.getParameter(ext.UNMASKED_RENDERER_WEBGL)
                : "unknown"
              for (const method of [
                "compileShader",
                "linkProgram",
                "getShaderParameter",
                "getProgramParameter",
                "drawArrays",
              ]) {
                const fn = result[method].bind(result)
                stats.gl[method] = { ms: 0, count: 0, max: 0 }
                result[method] = (...values) => {
                  const before = performance.now()
                  const value = fn(...values)
                  const elapsed = performance.now() - before
                  const row = stats.gl[method]
                  row.ms += elapsed
                  row.count++
                  row.max = Math.max(row.max, elapsed)
                  if (method === "drawArrays" && !stats.firstDraw)
                    stats.firstDraw = performance.now()
                  return value
                }
              }
            }
            return result
          }
          if (mode === "no-webgl-no-reveal") {
            const animate = Element.prototype.animate
            Element.prototype.animate = function (...args) {
              const animation = animate.apply(this, args)
              animation.finish()
              return animation
            }
          }
        },
        { mode }
      )
      const page = await context.newPage()
      await page.goto("/", { waitUntil: "load" })
      await page.waitForTimeout(3500)
      results.push(
        await page.evaluate(() => {
          const s = window.__perf
          const nav = performance.getEntriesByType("navigation")[0]
          const frames = [...s.frames].sort((a, b) => a - b)
          return {
            mode: s.mode,
            ttfb: nav.responseStart,
            domReady: nav.domContentLoadedEventEnd,
            load: nav.loadEventEnd,
            fcp: performance.getEntriesByName("first-contentful-paint")[0]
              ?.startTime,
            lcp: s.lcp,
            longTaskMs: s.longTasks.reduce((n, e) => n + e.duration, 0),
            blockingMs: s.longTasks.reduce(
              (n, e) => n + Math.max(0, e.duration - 50),
              0
            ),
            maxTaskMs: Math.max(0, ...s.longTasks.map((e) => e.duration)),
            frameP95: frames[Math.floor(frames.length * 0.95)],
            firstDraw: s.firstDraw,
            gl: s.gl,
            renderer: s.renderer,
          }
        })
      )
      await context.close()
    }
  }
  writeFileSync(
    process.env.PROFILE_REPEAT
      ? "docs/home-load-cold-repeat.json"
      : "docs/home-load-measurements.json",
    JSON.stringify(results, null, 2)
  )
  console.log(JSON.stringify(results, null, 2))
})
