import { useEffect, useRef, useState } from 'react'

/** Pixel size of the hero art; every layer below is drawn in this space. */
const ART_W = 2382
const ART_H = 1868
const BASE = '/brand/hero/layers/'

/**
 * Hero art with the green waves rising slowly up the diagonal while the
 * leaves stay still. The illustration is split into layers (see
 * public/brand/hero/layers/):
 * - plate.webp: the soft white/pale wash behind everything (static raster).
 * - scene.json: the green wave bands traced from the artwork as polygons and
 *   the thin current lines, with their colours.
 * - cutout.webp: the leaves, sprouts, arrow and bar charts, keyed out of the
 *   original with transparency and drawn on top so they stay perfectly still.
 */
type Scene = {
  /** Cutout placement in art space: x0, y0, x1, y1. */
  cut: [number, number, number, number]
  /**
   * Back to front. `c` flat colour, `g` per-channel plane [c0, cx, cy], `p` closed
   * polygons as flat x,y lists, `s` how soft this layer's edge is in the original (art px).
   */
  layers: { c: number[]; g: number[][]; p: number[][]; s: number }[]
  lines: { c: number[]; p: number[] }[]
}

/** Seconds per seamless loop; each harmonic completes a whole number of cycles in it. */
const LOOP = 22
/** A swell travelling up the diagonal: wavelength (art px), cycles per loop, amplitude (art px). */
const HARMONICS = [
  { wavelength: 950, cycles: 1, amp: 94, phase: 0 },
  { wavelength: 560, cycles: 2, amp: 39, phase: 2.1 },
  { wavelength: 350, cycles: 3, amp: 18, phase: 4.4 },
]
/** Direction the bands rise in, ~32 degrees above the horizontal. */
const THETA = 0.55
const COS = Math.cos(THETA)
const SIN = Math.sin(THETA)
const TAU = Math.PI * 2
/** Repaint at ~30 fps at most: plenty for a slow swell, half the work of 60. */
const MIN_FRAME_MS = 30

/**
 * Smooth displacement field for layer `k` of `n` at time `t`. Crests travel
 * towards the top-right at ~45-50 art px/s (20-24 css px/s on a laptop); points also slide a little along
 * the band in quadrature, so the surface rolls upward instead of just
 * bobbing. Front layers swing wider and their crests run faster, which reads
 * as depth. Every term is periodic in LOOP.
 */
function displace(x: number, y: number, t: number, k: number, n: number, out: [number, number]) {
  const u = x * COS - y * SIN
  const v = x * SIN + y * COS
  const depth = n <= 1 ? 1 : k / (n - 1)
  let normal = 0
  let along = 0
  for (const h of HARMONICS) {
    const wavelength = h.wavelength * (1 + 0.25 * depth)
    const phase = TAU * (u / wavelength - (h.cycles * t) / LOOP) + h.phase + k * 0.45
    normal += h.amp * Math.sin(phase)
    along += 0.4 * h.amp * Math.cos(phase)
  }
  const gain = (0.7 + 0.5 * depth) * (1 + 0.15 * Math.sin(TAU * (v / 900 + t / LOOP) + k))
  // A slower bulge that drifts across the bands, so crests vary along each edge instead of repeating.
  const bulge = 14 * Math.sin(TAU * (v / 760 - t / LOOP) + 1.3 + k * 0.7) * Math.sin(TAU * (u / 1500 - t / LOOP) + k)
  normal = normal * gain + bulge + 5 * Math.sin(TAU * (t / LOOP) + k * 0.9)
  along *= gain
  out[0] = normal * SIN + along * COS
  out[1] = normal * COS - along * SIN
}

/** Closed Catmull-Rom spline through the points (flat x,y), each displaced by the field. */
function closedSpline(path: Path2D, pts: number[], t: number, k: number, n: number, scratch: Float64Array, d: [number, number]) {
  const count = pts.length / 2
  for (let i = 0; i < count; i++) {
    displace(pts[i * 2], pts[i * 2 + 1], t, k, n, d)
    scratch[i * 2] = pts[i * 2] + d[0]
    scratch[i * 2 + 1] = pts[i * 2 + 1] + d[1]
  }
  path.moveTo(scratch[0], scratch[1])
  for (let i = 0; i < count; i++) {
    const p0 = ((i - 1 + count) % count) * 2
    const p1 = i * 2
    const p2 = ((i + 1) % count) * 2
    const p3 = ((i + 2) % count) * 2
    path.bezierCurveTo(
      scratch[p1] + (scratch[p2] - scratch[p0]) / 6,
      scratch[p1 + 1] + (scratch[p2 + 1] - scratch[p0 + 1]) / 6,
      scratch[p2] - (scratch[p3] - scratch[p1]) / 6,
      scratch[p2 + 1] - (scratch[p3 + 1] - scratch[p1 + 1]) / 6,
      scratch[p2],
      scratch[p2 + 1],
    )
  }
  path.closePath()
}

/** Open Catmull-Rom spline for the thin current lines; they ride on the back layer's field. */
function openSpline(path: Path2D, pts: number[], t: number, n: number, scratch: Float64Array, d: [number, number]) {
  const count = pts.length / 2
  for (let i = 0; i < count; i++) {
    displace(pts[i * 2], pts[i * 2 + 1], t, 0, n, d)
    scratch[i * 2] = pts[i * 2] + d[0] * 0.8
    scratch[i * 2 + 1] = pts[i * 2 + 1] + d[1] * 0.8
  }
  path.moveTo(scratch[0], scratch[1])
  for (let i = 0; i < count - 1; i++) {
    const p0 = Math.max(i - 1, 0) * 2
    const p1 = i * 2
    const p2 = (i + 1) * 2
    const p3 = Math.min(i + 2, count - 1) * 2
    path.bezierCurveTo(
      scratch[p1] + (scratch[p2] - scratch[p0]) / 6,
      scratch[p1 + 1] + (scratch[p2 + 1] - scratch[p0 + 1]) / 6,
      scratch[p2] - (scratch[p3] - scratch[p1]) / 6,
      scratch[p2 + 1] - (scratch[p3 + 1] - scratch[p1 + 1]) / 6,
      scratch[p2],
      scratch[p2 + 1],
    )
  }
}

const rgb = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

/**
 * The fitted colour plane of a layer as a linear gradient along its steepest
 * direction, shifted by (dx, dy) so the shading travels with the band.
 */
function layerGradient(ctx: CanvasRenderingContext2D, g: number[][], dx: number, dy: number) {
  const gx = 0.3 * g[0][1] + 0.59 * g[1][1] + 0.11 * g[2][1]
  const gy = 0.3 * g[0][2] + 0.59 * g[1][2] + 0.11 * g[2][2]
  const len = Math.hypot(gx, gy)
  if (len < 1e-6) return rgb(g.map((ch) => Math.round(ch[0])))
  const cx = ART_W * 0.7
  const cy = ART_H * 0.7
  const ex = (gx / len) * 1400
  const ey = (gy / len) * 1400
  const at = (x: number, y: number) => g.map((ch) => Math.round(Math.min(255, Math.max(0, ch[0] + ch[1] * x + ch[2] * y))))
  const grad = ctx.createLinearGradient(cx - ex + dx, cy - ey + dy, cx + ex + dx, cy + ey + dy)
  grad.addColorStop(0, rgb(at(cx - ex, cy - ey)))
  grad.addColorStop(1, rgb(at(cx + ex, cy + ey)))
  return grad
}

function loadImage(src: string) {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  return img.decode().then(() => img)
}

/**
 * Resample a raster to the exact device size it will be drawn at, halving in
 * steps first so a big downscale stays smooth (a single bilinear drawImage
 * at ~0.5x aliases the leaf edges).
 */
function prescale(img: HTMLImageElement, width: number, height: number): CanvasImageSource {
  let src: CanvasImageSource = img
  let w = img.naturalWidth
  let h = img.naturalHeight
  const target = Math.max(1, Math.round(width))
  while (w / 2 >= target * 1.05) {
    const half = document.createElement('canvas')
    half.width = Math.round(w / 2)
    half.height = Math.round(h / 2)
    const c = half.getContext('2d')
    if (!c) return src
    c.imageSmoothingQuality = 'high'
    c.drawImage(src, 0, 0, half.width, half.height)
    src = half
    w = half.width
    h = half.height
  }
  const out = document.createElement('canvas')
  out.width = target
  out.height = Math.max(1, Math.round(height))
  const c = out.getContext('2d')
  if (!c) return src
  c.imageSmoothingQuality = 'high'
  c.drawImage(src, 0, 0, out.width, out.height)
  return out
}

/**
 * Candidate B: the same illustration rebuilt as layers. The green wave bands
 * are vector shapes that rise along the diagonal while the leaves stay still
 * on top. Fills its parent frame like the other variants: contain fit,
 * anchored bottom-right in the 2382x1868 space. Pauses off-screen and in
 * hidden tabs; shows a still frame under prefers-reduced-motion.
 */
export function HeroArtLayers() {
  const frameRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    const frame = frameRef.current
    const canvas = canvasRef.current
    if (!frame || !canvas) return
    let cancelled = false
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) {
      queueMicrotask(() => {
        if (!cancelled) setStatus('failed')
      })
      return () => {
        cancelled = true
      }
    }
    let raf = 0
    let scene: Scene | null = null
    let plate: HTMLImageElement | null = null
    let cutout: HTMLImageElement | null = null
    let plateScaled: CanvasImageSource | null = null
    let cutoutScaled: CanvasImageSource | null = null
    let anchors: [number, number][] = []
    // The painting dissolves into white towards the top; the ribbons' upper reach gets the same treatment.
    const topFade = ctx.createLinearGradient(0, 500, 0, 900)
    topFade.addColorStop(0, 'rgba(255,255,255,0.3)')
    topFade.addColorStop(1, 'rgba(255,255,255,0)')
    let scratch = new Float64Array(0)
    const d: [number, number] = [0, 0]

    // Layout: contain fit, anchored bottom-right, device pixels capped at 2x
    // (lowered once if this machine cannot paint a frame within budget).
    let dprCap = 2
    let dpr = 1
    let scale = 1
    let ox = 0
    let oy = 0
    const layout = () => {
      const w = frame.clientWidth
      const h = frame.clientHeight
      dpr = Math.min(window.devicePixelRatio || 1, dprCap)
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      scale = Math.min(w / ART_W, h / ART_H)
      ox = w - ART_W * scale
      oy = h - ART_H * scale
      if (scene && plate && cutout) {
        const k = scale * dpr
        plateScaled = prescale(plate, ART_W * k, ART_H * k)
        cutoutScaled = prescale(cutout, (scene.cut[2] - scene.cut[0]) * k, (scene.cut[3] - scene.cut[1]) * k)
      }
    }

    const draw = (t: number) => {
      if (!scene || !plateScaled || !cutoutScaled) return
      const n = scene.layers.length
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy)
      ctx.drawImage(plateScaled, 0, 0, ART_W, ART_H)
      scene.layers.forEach((layer, k) => {
        const path = new Path2D()
        for (const poly of layer.p) closedSpline(path, poly, t, k, n, scratch, d)
        displace(anchors[k][0], anchors[k][1], t, k, n, d)
        const fill = layerGradient(ctx, layer.g, d[0], d[1])
        ctx.fillStyle = fill
        ctx.fill(path, 'evenodd')
        // Tone transitions inside a band are soft in the painting: feather the edge
        // with a translucent stroke (cheap, unlike a canvas blur filter).
        if (layer.s >= 4) {
          ctx.strokeStyle = fill
          ctx.globalAlpha = 0.35
          ctx.lineWidth = layer.s * 0.7
          ctx.stroke(path)
          ctx.globalAlpha = 1
        }
      })
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const line of scene.lines) {
        const path = new Path2D()
        openSpline(path, line.p, t, n, scratch, d)
        ctx.strokeStyle = rgb(line.c, 0.45)
        ctx.stroke(path)
      }
      ctx.fillStyle = topFade
      ctx.fillRect(0, 0, ART_W, 900)
      const [x0, y0, x1, y1] = scene.cut
      ctx.drawImage(cutoutScaled, x0, y0, x1 - x0, y1 - y0)
    }

    // Animation clock: only advances while the loop runs, so pauses never jump.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    let elapsed = 0
    let drawCost = 0
    let drawCount = 0
    let last: number | null = null
    let lastDraw = -Infinity
    const wantsMotion = () => visible && !document.hidden && !reduced.matches
    const tick = (now: number) => {
      raf = 0
      if (!wantsMotion()) {
        last = null
        return
      }
      if (last !== null) elapsed = (elapsed + Math.min(now - last, 100) / 1000) % LOOP
      last = now
      if (now - lastDraw >= MIN_FRAME_MS) {
        lastDraw = now
        const started = performance.now()
        draw(elapsed)
        // Slow paints (no GPU canvas, weak machine): trade resolution for smoothness once.
        drawCost += performance.now() - started
        if (++drawCount === 40) {
          if (drawCost / drawCount > 28 && dprCap > 1.25) {
            dprCap = 1.25
            layout()
          }
          drawCost = 0
          drawCount = dprCap > 1.25 ? 0 : -1e9
        }
      }
      raf = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (!scene) return
      if (wantsMotion()) {
        if (!raf) raf = requestAnimationFrame(tick)
      } else {
        if (raf) cancelAnimationFrame(raf)
        raf = 0
        last = null
        draw(reduced.matches ? 0 : elapsed)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting)
        sync()
      },
      { rootMargin: '10% 0px' },
    )
    observer.observe(frame)
    const resizer = new ResizeObserver(() => {
      layout()
      if (!raf) draw(reduced.matches ? 0 : elapsed)
    })
    resizer.observe(frame)
    document.addEventListener('visibilitychange', sync)
    reduced.addEventListener('change', sync)

    Promise.all([
      fetch(`${BASE}scene.json`).then((r) => {
        if (!r.ok) throw new Error(`scene ${r.status}`)
        return r.json() as Promise<Scene>
      }),
      loadImage(`${BASE}plate.webp`),
      loadImage(`${BASE}cutout.webp`),
    ])
      .then(([s, p, c]) => {
        if (cancelled) return
        scene = s
        plate = p
        cutout = c
        anchors = s.layers.map((layer) => {
          let sx = 0
          let sy = 0
          let count = 0
          for (const poly of layer.p) {
            for (let i = 0; i < poly.length; i += 2) {
              sx += poly[i]
              sy += poly[i + 1]
              count++
            }
          }
          return count ? [sx / count, sy / count] : [ART_W / 2, ART_H / 2]
        })
        const longest = Math.max(...s.layers.flatMap((l) => l.p.map((poly) => poly.length)), ...s.lines.map((l) => l.p.length))
        scratch = new Float64Array(longest)
        layout()
        draw(0)
        setStatus('ready')
        sync()
      })
      .catch(() => {
        if (!cancelled) setStatus('failed')
      })

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
      resizer.disconnect()
      document.removeEventListener('visibilitychange', sync)
      reduced.removeEventListener('change', sync)
    }
  }, [])

  return (
    <div ref={frameRef} className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${status === 'ready' ? 'opacity-100' : 'opacity-0'}`}
      />
      {status === 'failed' && (
        <img
          src="/brand/hero/hero-stream.webp"
          srcSet="/brand/hero/hero-stream-sm.webp 1200w, /brand/hero/hero-stream.webp 2382w"
          sizes="(min-width: 1024px) 80vw, 120vw"
          alt=""
          width={ART_W}
          height={ART_H}
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain object-right-bottom"
        />
      )}
    </div>
  )
}
