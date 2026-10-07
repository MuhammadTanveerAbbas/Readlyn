import { FONT_FAMILIES } from '@/types/infographic'

/**
 * Canvas font loading.
 *
 * Fabric.js paints text into a <canvas> element. A <canvas> has no access to
 * the document's CSS, and `ctx.font` silently substitutes a default face for any
 * family that is not already resident in the browser. That means a webfont can
 * be fully loaded in the page and *still* render as a fallback inside the
 * canvas which shows up as infographics exported in the wrong typeface with
 * no error anywhere.
 *
 * `document.fonts.load()` is the only reliable way to force a webfont to
 * download and become measurable before we hand it to Fabric. We call it for
 * every family in FONT_FAMILIES at every weight the canvas can request, then
 * await the result before rendering or exporting.
 */

/**
 * Weights the infographic schema allows: 'normal' | 'bold' | '900'.
 *
 * Geist and Geist Mono are variable fonts, so each of these resolves to a real
 * axis position on the same file rather than pulling a separate static cut.
 */
const CANVAS_WEIGHTS = ['400', '500', '700', '900'] as const

let pending: Promise<void> | null = null

/**
 * Force every canvas font to load. Idempotent and safe to call concurrently
 * concurrent callers share one in-flight promise.
 *
 * No-ops outside the browser (SSR, unit tests) instead of throwing.
 */
export function ensureCanvasFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) {
    return Promise.resolve()
  }

  if (!pending) {
    const fontFace = document.fonts as FontFaceSet
    const requests: Promise<unknown>[] = []

    for (const family of FONT_FAMILIES) {
      for (const weight of CANVAS_WEIGHTS) {
        // Quote the family name: all four contain spaces.
        try {
          requests.push(fontFace.load(`${weight} 16px "${family}"`))
        } catch {
          // A single unsupported spec should not abort the whole preload.
        }
      }
    }

    pending = Promise.all(requests)
      .then(() => document.fonts.ready)
      .then(() => undefined)
      .catch(() => undefined)
  }

  return pending
}

/**
 * Test seam: drops the memoised preload so the next call re-runs it.
 */
export function resetCanvasFontCache(): void {
  pending = null
}
