"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MutableRefObject,
  type ReactNode,
} from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { cn } from "@/lib/utils"

export interface PrismaticSlatsProps {
  onReady?: () => void
  colors?: string[]
  backgroundColor?: string
  texture?: number
  angle?: number
  flutes?: number
  refraction?: number
  aberration?: number
  softness?: number
  wave?: number
  waveFrequency?: number
  drift?: number
  highlight?: number
  highlightSoftness?: number
  lightAngle?: number
  radius?: number
  momentum?: number
  swirl?: number
  intensity?: number
  trail?: number
  autoplay?: boolean
  interactive?: boolean
  grain?: number
  speed?: number
  paused?: boolean
  dpr?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

const DEFAULT_COLORS = ["#5227FF", "#FF9FFC"]
const PRESSURE_STEPS = 18

const gridVertex = `
varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform vec2 uTexel;

void main() {
  vUv = uv;
  vL = uv - vec2(uTexel.x, 0.0);
  vR = uv + vec2(uTexel.x, 0.0);
  vT = uv + vec2(0.0, uTexel.y);
  vB = uv - vec2(0.0, uTexel.y);
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`

const splatFragment = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uTarget;
uniform vec2 uFrom;
uniform vec2 uTo;
uniform vec3 uValue;
uniform float uRadius;
uniform float uAspect;

void main() {
  vec2 a = uFrom * vec2(uAspect, 1.0);
  vec2 b = uTo * vec2(uAspect, 1.0);
  vec2 p = vUv * vec2(uAspect, 1.0);
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  vec2 d = p - (a + ab * h);
  float g = exp(-dot(d, d) / max(uRadius * uRadius, 1e-6));
  gl_FragColor = vec4(texture2D(uTarget, vUv).xyz + uValue * g, 1.0);
}
`

const curlFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uVelocity;

void main() {
  float left = texture2D(uVelocity, vL).y;
  float right = texture2D(uVelocity, vR).y;
  float top = texture2D(uVelocity, vT).x;
  float bottom = texture2D(uVelocity, vB).x;
  gl_FragColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
}
`

const vorticityFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uStrength;
uniform float uDelta;

void main() {
  float left = texture2D(uCurl, vL).x;
  float right = texture2D(uCurl, vR).x;
  float top = texture2D(uCurl, vT).x;
  float bottom = texture2D(uCurl, vB).x;
  float center = texture2D(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(top) - abs(bottom), abs(right) - abs(left));
  force /= length(force) + 1e-4;
  force *= uStrength * center;
  force.y *= -1.0;
  vec2 velocity = texture2D(uVelocity, vUv).xy + force * uDelta;
  gl_FragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}
`

const divergenceFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uVelocity;

void main() {
  vec2 center = texture2D(uVelocity, vUv).xy;
  float left = vL.x < 0.0 ? -center.x : texture2D(uVelocity, vL).x;
  float right = vR.x > 1.0 ? -center.x : texture2D(uVelocity, vR).x;
  float top = vT.y > 1.0 ? -center.y : texture2D(uVelocity, vT).y;
  float bottom = vB.y < 0.0 ? -center.y : texture2D(uVelocity, vB).y;
  gl_FragColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}
`

const smoothFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uSource;
uniform float uAmount;

void main() {
  vec4 center = texture2D(uSource, vUv);
  vec4 around = (
    texture2D(uSource, vL) +
    texture2D(uSource, vR) +
    texture2D(uSource, vT) +
    texture2D(uSource, vB)
  ) * 0.25;
  gl_FragColor = mix(center, around, uAmount);
}
`

const fadeFragment = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uSource;
uniform float uKeep;

void main() {
  gl_FragColor = texture2D(uSource, vUv) * uKeep;
}
`

const pressureFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;

void main() {
  float left = texture2D(uPressure, vL).x;
  float right = texture2D(uPressure, vR).x;
  float top = texture2D(uPressure, vT).x;
  float bottom = texture2D(uPressure, vB).x;
  float divergence = texture2D(uDivergence, vUv).x;
  gl_FragColor = vec4((left + right + top + bottom - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`

const gradientFragment = `
precision highp float;

varying vec2 vUv;
varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;

uniform sampler2D uPressure;
uniform sampler2D uVelocity;

void main() {
  float left = texture2D(uPressure, vL).x;
  float right = texture2D(uPressure, vR).x;
  float top = texture2D(uPressure, vT).x;
  float bottom = texture2D(uPressure, vB).x;
  vec2 velocity = texture2D(uVelocity, vUv).xy - vec2(right - left, top - bottom);
  gl_FragColor = vec4(velocity, 0.0, 1.0);
}
`

const advectFragment = `
precision highp float;

varying vec2 vUv;

uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uGridTexel;
uniform float uDelta;
uniform float uFade;

void main() {
  vec2 from = vUv - uDelta * texture2D(uVelocity, vUv).xy * uGridTexel;
  gl_FragColor = texture2D(uSource, from) / (1.0 + uFade * uDelta);
}
`

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy * 2.0, 0.0, 1.0);
}
`

const fragmentShader = `
precision highp float;

#define TAU 6.28318530718

varying vec2 vUv;

uniform sampler2D uDye;
uniform vec2 uDyeTexel;
uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uBackground;
uniform vec3 uShade;
uniform float uTexture;
uniform float uTransparent;
uniform float uLightSurface;
uniform float uAngle;
uniform float uFlutes;
uniform float uRefraction;
uniform float uAberration;
uniform float uSoftness;
uniform float uWave;
uniform float uWaveFrequency;
uniform float uDrift;
uniform float uHighlight;
uniform float uHighlightSoftness;
uniform float uLightAngle;
uniform float uGrain;

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
}

float gradientNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(hash22(i), f);
  float b = dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec2 mirrorUv(vec2 uv) {
  vec2 m = mod(uv, 2.0);
  return 1.0 - abs(1.0 - m);
}

vec3 surface(vec2 uv, float aspect) {
  vec2 q = (uv - 0.5) * vec2(aspect, 1.0) * 1.7;
  float t = uTime * 0.08;
  float warp = gradientNoise(q * 0.9 + vec2(t, -t * 0.7));
  float swirl = gradientNoise(q * 1.6 + warp * 1.4 + vec2(-t * 0.6, t * 0.9) + 3.7);
  float blend = clamp(0.5 + swirl * 1.2, 0.0, 1.0);
  return mix(uBackground, uShade, blend * uTexture);
}

vec4 paint(vec2 uv) {
  vec2 at = mirrorUv(uv);
  vec2 o = uDyeTexel * 2.6;
  vec3 dye = texture2D(uDye, at).rgb * 0.4;
  dye += texture2D(uDye, at + vec2(o.x, o.y)).rgb * 0.15;
  dye += texture2D(uDye, at + vec2(-o.x, o.y)).rgb * 0.15;
  dye += texture2D(uDye, at + vec2(o.x, -o.y)).rgb * 0.15;
  dye += texture2D(uDye, at + vec2(-o.x, -o.y)).rgb * 0.15;
  dye = max(dye, 0.0);
  float amount = max(dye.r, max(dye.g, dye.b));
  float cover = 1.0 - exp(-amount * 2.4);
  vec3 hue = dye / max(amount, 1e-4);
  float dark = 1.0 - uLightSurface;
  hue = mix(hue, vec3(1.0), 0.34 * dark * smoothstep(0.4, 1.0, cover));
  return vec4(clamp(hue, 0.0, 1.0), cover);
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
  float c = cos(uAngle);
  float s = sin(uAngle);
  vec2 across = vec2(c, -s);
  vec2 along = vec2(s, c);
  float span = max(aspect, 1.0);
  float width = span / max(uFlutes, 1.0) * max(abs(c), 0.15);

  float travel = dot(p, along);
  float sway = uWave * width * 0.35 * sin((travel / span) * uWaveFrequency * TAU + uTime * 0.6);
  float position = (dot(p, across) + sway) / width + uTime * uDrift * 0.15;
  float f = fract(position) - 0.5;
  float power = mix(3.0, 1.0, clamp(uSoftness, 0.0, 1.0));
  float lens = sign(f) * pow(abs(f) * 2.0, power) * 0.5;

  float shift = -lens * uRefraction * width;
  float split = uAberration * 0.42 * width * lens;
  vec2 toUv = vec2(1.0 / aspect, 1.0);
  vec2 red = vUv + across * (shift + split) * toUv;
  vec2 green = vUv + across * shift * toUv;
  vec2 blue = vUv + across * (shift - split) * toUv;

  vec4 paintR = paint(red);
  vec4 paintG = paint(green);
  vec4 paintB = paint(blue);
  vec3 base = vec3(
    surface(red, aspect).r,
    surface(green, aspect).g,
    surface(blue, aspect).b
  );
  vec3 color = vec3(
    mix(base.r, paintR.r, paintR.a),
    mix(base.g, paintG.g, paintG.a),
    mix(base.b, paintB.b, paintB.a)
  );

  float light = sin(radians(uLightAngle)) * 0.5;
  float spread = mix(0.012, 0.16, clamp(uHighlightSoftness, 0.0, 1.0));
  float glint = exp(-pow((f - light * 0.97) / spread, 2.0));
  float cover = max(paintG.a, max(paintR.a, paintB.a));
  color += vec3(uHighlight) * glint * (0.05 + cover * 0.9) * (1.0 - uLightSurface);
  float seamShadow = 1.0 - smoothstep(0.0, 0.16, 0.5 - abs(f));
  float roll = 1.0 - 0.05 * lens * lens * 4.0 - 0.08 * seamShadow;
  color *= mix(1.0, roll, uLightSurface * (1.0 - cover * 0.6));

  float alpha = 1.0;
  if (uTransparent > 0.5) {
    alpha = clamp(max(cover, uHighlight * glint * 0.8), 0.0, 1.0);
  }
  vec4 encoded = linearToOutputTexel(vec4(max(color, 0.0), 1.0));
  float lum = dot(encoded.rgb, vec3(0.2126, 0.7152, 0.0722));
  float noise = hash21(gl_FragCoord.xy) - 0.5;
  encoded.rgb += noise * uGrain * 0.45 * pow(1.0 - clamp(lum, 0.0, 1.0), 2.0);
  gl_FragColor = vec4(encoded.rgb * alpha, alpha);
  float dither = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
  gl_FragColor.rgb += (dither - 0.5) / 255.0 * alpha;
}
`

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const isTransparent = (value: string) => {
  const normalized = value.trim().toLowerCase()
  if (normalized === "transparent") return true
  if (/^#[0-9a-f]{8}$/.test(normalized)) return normalized.endsWith("00")
  if (/^#[0-9a-f]{4}$/.test(normalized)) return normalized.endsWith("0")
  const alpha = normalized.match(
    /^(?:rgba?|hsla?)\(.*[,/]\s*(0|0?\.0+|0%)\s*\)$/
  )
  return alpha !== null
}

const readColor = (target: THREE.Color, value: string, fallback: string) => {
  const trimmed = value.trim()
  try {
    target.set(/^#[0-9a-f]{8}$/i.test(trimmed) ? trimmed.slice(0, 7) : trimmed)
  } catch {
    target.set(fallback)
  }
  return target
}

const toLch = (color: THREE.Color): [number, number, number] => {
  const l = Math.cbrt(
    0.4122214708 * color.r + 0.5363325363 * color.g + 0.0514459929 * color.b
  )
  const m = Math.cbrt(
    0.2119034982 * color.r + 0.6806995451 * color.g + 0.1073969566 * color.b
  )
  const s = Math.cbrt(
    0.0883024619 * color.r + 0.2817188376 * color.g + 0.6299787005 * color.b
  )
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const b = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return [lightness, Math.hypot(a, b), Math.atan2(b, a)]
}

const blendLch = (
  target: THREE.Color,
  from: THREE.Color,
  to: THREE.Color,
  amount: number
) => {
  const [l1, c1, h1] = toLch(from)
  const [l2, c2, h2] = toLch(to)
  let turn = h2 - h1
  if (turn > Math.PI) turn -= Math.PI * 2
  if (turn < -Math.PI) turn += Math.PI * 2
  const lightness = l1 + (l2 - l1) * amount
  const chroma = c1 + (c2 - c1) * amount
  const hue = h1 + turn * amount
  const a = chroma * Math.cos(hue)
  const b = chroma * Math.sin(hue)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return target.setRGB(
    Math.max(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, 0),
    Math.max(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, 0),
    Math.max(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s, 0)
  )
}

const subscribeToDpr = (notify: () => void) => {
  const media = window.matchMedia("(min-resolution: 2dppx)")
  media.addEventListener("change", notify)
  window.addEventListener("resize", notify)
  return () => {
    media.removeEventListener("change", notify)
    window.removeEventListener("resize", notify)
  }
}

const readDpr = () =>
  typeof window === "undefined" ? 1 : window.devicePixelRatio || 1

const subscribeToMotion = (notify: () => void) => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)")
  media.addEventListener("change", notify)
  return () => media.removeEventListener("change", notify)
}

const readMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches

interface PointerInput {
  x: number
  y: number
  inside: boolean
  moved: number
}

interface SlatsSettings {
  colors: string[]
  backgroundColor: string
  texture: number
  angle: number
  flutes: number
  refraction: number
  aberration: number
  softness: number
  wave: number
  waveFrequency: number
  drift: number
  highlight: number
  highlightSoftness: number
  lightAngle: number
  radius: number
  momentum: number
  swirl: number
  intensity: number
  trail: number
  autoplay: boolean
  interactive: boolean
  grain: number
  speed: number
  paused: boolean
  reduced: boolean
}

interface SlatsSceneProps {
  onReady?: () => void
  settings: SlatsSettings
  pointerRef: MutableRefObject<PointerInput>
  wakeRef: MutableRefObject<(() => void) | null>
}

interface Field {
  read: THREE.WebGLRenderTarget
  write: THREE.WebGLRenderTarget
}

interface Fluid {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  quad: THREE.Mesh
  passes: Record<
    | "splat"
    | "curl"
    | "vorticity"
    | "smooth"
    | "divergence"
    | "fade"
    | "pressure"
    | "gradient"
    | "advect",
    THREE.ShaderMaterial
  >
  velocity: Field
  pressure: Field
  dye: Field
  divergence: THREE.WebGLRenderTarget
  curl: THREE.WebGLRenderTarget
  gridTexel: THREE.Vector2
  dyeTexel: THREE.Vector2
}

interface Motion {
  time: number
  lastX: number
  lastY: number
  hasLast: boolean
  idle: number
  lastMoved: number
  wander: number
  colors: THREE.Color[]
  flow: THREE.Color
  mix: THREE.Color
}

const createTarget = (width: number, height: number) =>
  new THREE.WebGLRenderTarget(width, height, {
    type: THREE.HalfFloatType,
    format: THREE.RGBAFormat,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    depthBuffer: false,
    stencilBuffer: false,
    wrapS: THREE.ClampToEdgeWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  })

const createField = (width: number, height: number): Field => ({
  read: createTarget(width, height),
  write: createTarget(width, height),
})

const swap = (field: Field) => {
  const next = field.read
  field.read = field.write
  field.write = next
}

const createPass = (
  fragment: string,
  uniforms: Record<string, THREE.IUniform>
) =>
  new THREE.ShaderMaterial({
    vertexShader: gridVertex,
    fragmentShader: fragment,
    uniforms: { uTexel: { value: new THREE.Vector2() }, ...uniforms },
    depthTest: false,
    depthWrite: false,
  })

const createFluid = (
  gridWidth: number,
  gridHeight: number,
  dyeWidth: number,
  dyeHeight: number
): Fluid => {
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const passes = {
    splat: createPass(splatFragment, {
      uTarget: { value: null },
      uFrom: { value: new THREE.Vector2() },
      uTo: { value: new THREE.Vector2() },
      uValue: { value: new THREE.Vector3() },
      uRadius: { value: 0.05 },
      uAspect: { value: 1 },
    }),
    curl: createPass(curlFragment, { uVelocity: { value: null } }),
    vorticity: createPass(vorticityFragment, {
      uVelocity: { value: null },
      uCurl: { value: null },
      uStrength: { value: 20 },
      uDelta: { value: 0 },
    }),
    smooth: createPass(smoothFragment, {
      uSource: { value: null },
      uAmount: { value: 0.5 },
    }),
    divergence: createPass(divergenceFragment, { uVelocity: { value: null } }),
    fade: createPass(fadeFragment, {
      uSource: { value: null },
      uKeep: { value: 0.8 },
    }),
    pressure: createPass(pressureFragment, {
      uPressure: { value: null },
      uDivergence: { value: null },
    }),
    gradient: createPass(gradientFragment, {
      uPressure: { value: null },
      uVelocity: { value: null },
    }),
    advect: createPass(advectFragment, {
      uVelocity: { value: null },
      uSource: { value: null },
      uGridTexel: { value: new THREE.Vector2() },
      uDelta: { value: 0 },
      uFade: { value: 1 },
    }),
  }
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), passes.splat)
  quad.frustumCulled = false
  scene.add(quad)
  return {
    scene,
    camera,
    quad,
    passes,
    velocity: createField(gridWidth, gridHeight),
    pressure: createField(gridWidth, gridHeight),
    dye: createField(dyeWidth, dyeHeight),
    divergence: createTarget(gridWidth, gridHeight),
    curl: createTarget(gridWidth, gridHeight),
    gridTexel: new THREE.Vector2(1 / gridWidth, 1 / gridHeight),
    dyeTexel: new THREE.Vector2(1 / dyeWidth, 1 / dyeHeight),
  }
}

const disposeFluid = (fluid: Fluid) => {
  for (const field of [fluid.velocity, fluid.pressure, fluid.dye]) {
    field.read.dispose()
    field.write.dispose()
  }
  fluid.divergence.dispose()
  fluid.curl.dispose()
  for (const pass of Object.values(fluid.passes)) pass.dispose()
  fluid.quad.geometry.dispose()
}

const createUniforms = () => ({
  uDye: { value: null as THREE.Texture | null },
  uDyeTexel: { value: new THREE.Vector2(1 / 512, 1 / 512) },
  uResolution: { value: new THREE.Vector2(1, 1) },
  uTime: { value: 0 },
  uBackground: { value: new THREE.Color() },
  uShade: { value: new THREE.Color() },
  uTexture: { value: 0.6 },
  uTransparent: { value: 0 },
  uLightSurface: { value: 0 },
  uAngle: { value: 0 },
  uFlutes: { value: 8 },
  uRefraction: { value: 4 },
  uAberration: { value: 0.61 },
  uSoftness: { value: 0.5 },
  uWave: { value: 0.06 },
  uWaveFrequency: { value: 1.5 },
  uDrift: { value: 0 },
  uHighlight: { value: 0.12 },
  uHighlightSoftness: { value: 0.3 },
  uLightAngle: { value: -90 },
  uGrain: { value: 0.05 },
})

type SlatsUniforms = ReturnType<typeof createUniforms>

const SlatsScene = ({
  settings,
  pointerRef,
  wakeRef,
  onReady,
}: SlatsSceneProps) => {
  const readyFrame = useRef<number | null>(null)
  const readySent = useRef(false)
  useEffect(
    () => () => {
      if (readyFrame.current !== null) cancelAnimationFrame(readyFrame.current)
      readySent.current = false
    },
    []
  )
  const { gl, size, invalidate } = useThree()
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const fluidRef = useRef<Fluid | null>(null)
  const motionRef = useRef<Motion>({
    time: 0,
    lastX: 0.5,
    lastY: 0.5,
    hasLast: false,
    idle: 10,
    lastMoved: 0,
    wander: 0,
    colors: DEFAULT_COLORS.map((value) => new THREE.Color(value)),
    flow: new THREE.Color(DEFAULT_COLORS[0]),
    mix: new THREE.Color(),
  })
  const uniforms = useMemo(() => createUniforms(), [])
  const colorKey = settings.colors.join("|")
  const { backgroundColor } = settings
  const aspect = size.width / Math.max(size.height, 1)
  const gridHeight = 128
  const gridWidth = Math.max(16, Math.round(gridHeight * aspect))
  const dyeHeight = 288
  const dyeWidth = Math.max(64, Math.round(dyeHeight * aspect))

  useEffect(() => {
    const fluid = createFluid(gridWidth, gridHeight, dyeWidth, dyeHeight)
    fluidRef.current = fluid
    return () => {
      fluidRef.current = null
      disposeFluid(fluid)
    }
  }, [gridWidth, gridHeight, dyeWidth, dyeHeight])

  useEffect(() => {
    wakeRef.current = invalidate
    return () => {
      wakeRef.current = null
    }
  }, [invalidate, wakeRef])

  useEffect(() => {
    const material = materialRef.current
    if (!material) return
    const values = material.uniforms as unknown as SlatsUniforms
    const motion = motionRef.current
    const palette = colorKey ? colorKey.split("|") : DEFAULT_COLORS
    for (let i = 0; i < 2; i++) {
      readColor(
        motion.colors[i],
        palette[Math.min(i, palette.length - 1)] ?? DEFAULT_COLORS[i],
        DEFAULT_COLORS[i]
      )
    }
    blendLch(motion.flow, motion.colors[0], motion.colors[1], 0.5)
    const transparent = isTransparent(backgroundColor)
    readColor(
      values.uBackground.value,
      transparent ? "#000000" : backgroundColor,
      "#000000"
    )
    const light =
      values.uBackground.value.r * 0.2126 +
        values.uBackground.value.g * 0.7152 +
        values.uBackground.value.b * 0.0722 >
      0.4
    values.uShade.value
      .copy(values.uBackground.value)
      .lerp(
        light ? new THREE.Color(0, 0, 0) : new THREE.Color(1, 1, 1),
        light ? 0.05 : 0.0035
      )
    values.uTransparent.value = transparent ? 1 : 0
    values.uLightSurface.value = light && !transparent ? 1 : 0
    invalidate()
  }, [colorKey, backgroundColor, invalidate])

  useEffect(() => {
    invalidate()
  }, [settings, size, invalidate])

  useFrame((state, delta) => {
    const material = materialRef.current
    const fluid = fluidRef.current
    if (!material || !fluid) return
    const values = material.uniforms as unknown as SlatsUniforms
    const motion = motionRef.current
    const s = settings
    const input = pointerRef.current
    const dt = Math.min(Math.max(delta, 0), 0.033)
    const animate = !s.paused && !s.reduced && s.speed > 0
    const step = animate ? dt * s.speed : 0
    const flowDt = s.paused ? 0 : dt
    motion.time += step

    let active = false
    let gain = 1
    let targetX = motion.lastX
    let targetY = motion.lastY
    if (s.interactive && input.inside && input.moved !== motion.lastMoved) {
      motion.lastMoved = input.moved
      motion.idle = 0
      targetX = input.x
      targetY = input.y
      active = true
      if (!motion.hasLast) {
        motion.lastX = targetX
        motion.lastY = targetY
        motion.hasLast = true
      }
    } else {
      motion.idle += dt
    }
    if (!active && s.autoplay && animate && motion.idle > 1.6) {
      motion.wander += step
      const w = motion.wander * 0.32
      targetX = 0.5 + 0.34 * Math.sin(w * 1.3 + 0.4) + 0.08 * Math.sin(w * 3.1)
      targetY = 0.5 + 0.3 * Math.sin(w * 0.9 + 1.7) + 0.07 * Math.cos(w * 2.3)
      gain = 0.75
      active = true
      if (!motion.hasLast) {
        motion.lastX = targetX
        motion.lastY = targetY
        motion.hasLast = true
      }
    }

    const gpu = gl
    const previousTarget = gpu.getRenderTarget()
    const run = (
      pass: THREE.ShaderMaterial,
      target: THREE.WebGLRenderTarget,
      texel: THREE.Vector2
    ) => {
      fluid.quad.material = pass
      pass.uniforms.uTexel.value.copy(texel)
      gpu.setRenderTarget(target)
      gpu.render(fluid.scene, fluid.camera)
    }
    const { passes } = fluid

    if (active && flowDt > 0) {
      const dx = targetX - motion.lastX
      const dy = targetY - motion.lastY
      const distance = Math.hypot(dx * aspect, dy)
      if (distance > 0.0004) {
        const vx = (dx * aspect) / flowDt
        const vy = dy / flowDt
        const speed = Math.hypot(vx, vy)
        const ux = vx / Math.max(speed, 1e-5)
        const uy = vy / Math.max(speed, 1e-5)
        const lean = clamp(0.5 + (ux + uy) * 0.3536, 0, 1)
        blendLch(motion.mix, motion.colors[0], motion.colors[1], lean)
        motion.flow.lerp(motion.mix, 1 - Math.exp(-flowDt / 0.14))

        const radius = clamp(s.radius, 0.2, 12) * 0.012
        const splat = passes.splat.uniforms
        splat.uAspect.value = aspect
        splat.uRadius.value = radius
        splat.uFrom.value.set(motion.lastX, motion.lastY)
        splat.uTo.value.set(targetX, targetY)

        const couple = 0.06 + clamp(s.momentum, 0, 60) * 0.009
        splat.uRadius.value = radius * 2.2
        splat.uTarget.value = fluid.velocity.read.texture
        splat.uValue.value.set(
          clamp(dx / flowDt, -12, 12) * gridWidth * couple,
          clamp(dy / flowDt, -12, 12) * gridHeight * couple,
          0
        )
        run(passes.splat, fluid.velocity.write, fluid.gridTexel)
        swap(fluid.velocity)
        splat.uRadius.value = radius

        const amount =
          clamp(s.intensity, 0, 3) * gain * clamp(distance * 12, 0.035, 0.3)
        splat.uTarget.value = fluid.dye.read.texture
        splat.uValue.value.set(
          motion.flow.r * amount,
          motion.flow.g * amount,
          motion.flow.b * amount
        )
        run(passes.splat, fluid.dye.write, fluid.dyeTexel)
        swap(fluid.dye)
      }
    }
    if (active) {
      motion.lastX = targetX
      motion.lastY = targetY
    }

    if (flowDt > 0) {
      const curlStrength = clamp(s.swirl, 0, 60)
      if (curlStrength > 0) {
        passes.curl.uniforms.uVelocity.value = fluid.velocity.read.texture
        run(passes.curl, fluid.curl, fluid.gridTexel)

        const vorticity = passes.vorticity.uniforms
        vorticity.uVelocity.value = fluid.velocity.read.texture
        vorticity.uCurl.value = fluid.curl.texture
        vorticity.uStrength.value = curlStrength
        vorticity.uDelta.value = flowDt
        run(passes.vorticity, fluid.velocity.write, fluid.gridTexel)
        swap(fluid.velocity)
      }

      passes.smooth.uniforms.uAmount.value = 0.85
      for (let i = 0; i < 2; i++) {
        passes.smooth.uniforms.uSource.value = fluid.velocity.read.texture
        run(passes.smooth, fluid.velocity.write, fluid.gridTexel)
        swap(fluid.velocity)
      }

      if (curlStrength > 0) {
        passes.divergence.uniforms.uVelocity.value = fluid.velocity.read.texture
        run(passes.divergence, fluid.divergence, fluid.gridTexel)

        passes.fade.uniforms.uSource.value = fluid.pressure.read.texture
        passes.fade.uniforms.uKeep.value = 0.8
        run(passes.fade, fluid.pressure.write, fluid.gridTexel)
        swap(fluid.pressure)

        passes.pressure.uniforms.uDivergence.value = fluid.divergence.texture
        for (let i = 0; i < PRESSURE_STEPS; i++) {
          passes.pressure.uniforms.uPressure.value = fluid.pressure.read.texture
          run(passes.pressure, fluid.pressure.write, fluid.gridTexel)
          swap(fluid.pressure)
        }

        const gradient = passes.gradient.uniforms
        gradient.uPressure.value = fluid.pressure.read.texture
        gradient.uVelocity.value = fluid.velocity.read.texture
        run(passes.gradient, fluid.velocity.write, fluid.gridTexel)
        swap(fluid.velocity)
      }

      const momentum = clamp(s.momentum, 0, 60)
      const advect = passes.advect.uniforms
      advect.uGridTexel.value.copy(fluid.gridTexel)
      advect.uDelta.value = flowDt
      advect.uVelocity.value = fluid.velocity.read.texture
      advect.uSource.value = fluid.velocity.read.texture
      advect.uFade.value = 3.2 / (0.4 + momentum * 0.09)
      run(passes.advect, fluid.velocity.write, fluid.gridTexel)
      swap(fluid.velocity)

      advect.uVelocity.value = fluid.velocity.read.texture
      advect.uSource.value = fluid.dye.read.texture
      advect.uFade.value = 3 / clamp(s.trail, 0.05, 10)
      run(passes.advect, fluid.dye.write, fluid.dyeTexel)
      swap(fluid.dye)
    }

    gpu.setRenderTarget(previousTarget)

    values.uDye.value = fluid.dye.read.texture
    values.uDyeTexel.value.copy(fluid.dyeTexel)
    values.uResolution.value.set(
      size.width * state.viewport.dpr,
      size.height * state.viewport.dpr
    )
    values.uTime.value = motion.time
    values.uTexture.value = clamp(s.texture, 0, 1)
    values.uAngle.value = (clamp(s.angle, -360, 360) * Math.PI) / 180
    values.uFlutes.value = clamp(s.flutes, 1, 60)
    values.uRefraction.value = clamp(s.refraction, 0, 12)
    values.uAberration.value = clamp(s.aberration, 0, 3)
    values.uSoftness.value = clamp(s.softness, 0, 1)
    values.uWave.value = clamp(s.wave, 0, 0.5)
    values.uWaveFrequency.value = clamp(s.waveFrequency, 0, 12)
    values.uDrift.value = clamp(s.drift, -5, 5)
    values.uHighlight.value = clamp(s.highlight, 0, 2)
    values.uHighlightSoftness.value = clamp(s.highlightSoftness, 0, 1)
    values.uLightAngle.value = clamp(s.lightAngle, -180, 180)
    values.uGrain.value = clamp(s.grain, 0, 1)
  })

  return (
    <mesh
      frustumCulled={false}
      onAfterRender={() => {
        if (readySent.current) return
        readySent.current = true
        readyFrame.current = requestAnimationFrame(() => onReady?.())
      }}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
        transparent
        premultipliedAlpha
      />
    </mesh>
  )
}

export const PrismaticSlats = ({
  onReady,
  colors = DEFAULT_COLORS,
  backgroundColor = "#050505",
  texture = 0.6,
  angle = 28,
  flutes = 8,
  refraction = 4,
  aberration = 0.61,
  softness = 0.5,
  wave = 0.06,
  waveFrequency = 1.5,
  drift = 0,
  highlight = 0.12,
  highlightSoftness = 0.3,
  lightAngle = -90,
  radius = 6.5,
  momentum = 13,
  swirl = 0,
  intensity = 1,
  trail = 1,
  autoplay = true,
  interactive = true,
  grain = 0.05,
  speed = 1,
  paused = false,
  dpr = 1.5,
  className,
  style,
  children,
}: PrismaticSlatsProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const pointerRef = useRef<PointerInput>({
    x: 0.5,
    y: 0.5,
    inside: false,
    moved: 0,
  })
  const wakeRef = useRef<(() => void) | null>(null)
  const [visible, setVisible] = useState(true)
  const reducedMotion = useSyncExternalStore(
    subscribeToMotion,
    readMotion,
    () => false
  )
  const deviceDpr = useSyncExternalStore(subscribeToDpr, readDpr, () => 1)
  const pixelRatio = Math.min(deviceDpr, Math.max(dpr, 0.5))
  const transparent = isTransparent(backgroundColor)

  const settings: SlatsSettings = {
    colors,
    backgroundColor,
    texture,
    angle,
    flutes,
    refraction,
    aberration,
    softness,
    wave,
    waveFrequency,
    drift,
    highlight,
    highlightSoftness,
    lightAngle,
    radius,
    momentum,
    swirl,
    intensity,
    trail,
    autoplay,
    interactive,
    grain,
    speed,
    paused,
    reduced: reducedMotion,
  }

  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "80px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node) return
    const move = (event: PointerEvent) => {
      const box = node.getBoundingClientRect()
      const state = pointerRef.current
      state.x = (event.clientX - box.left) / Math.max(box.width, 1)
      state.y = 1 - (event.clientY - box.top) / Math.max(box.height, 1)
      state.inside = true
      state.moved += 1
      wakeRef.current?.()
    }
    const leave = (event: PointerEvent) => {
      if (event.type === "pointerup" && event.pointerType === "mouse") return
      pointerRef.current.inside = false
      wakeRef.current?.()
    }
    node.addEventListener("pointermove", move, { passive: true })
    node.addEventListener("pointerdown", move, { passive: true })
    node.addEventListener("pointerleave", leave, { passive: true })
    node.addEventListener("pointercancel", leave, { passive: true })
    node.addEventListener("pointerup", leave, { passive: true })
    return () => {
      node.removeEventListener("pointermove", move)
      node.removeEventListener("pointerdown", move)
      node.removeEventListener("pointerleave", leave)
      node.removeEventListener("pointercancel", leave)
      node.removeEventListener("pointerup", leave)
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate overflow-hidden", className)}
      style={{
        backgroundColor: transparent ? undefined : backgroundColor,
        ...style,
      }}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Canvas
          orthographic
          dpr={pixelRatio}
          frameloop={
            !visible ? "never" : reducedMotion || paused ? "demand" : "always"
          }
          gl={{
            antialias: false,
            alpha: true,
            premultipliedAlpha: true,
            powerPreference: "high-performance",
          }}
          style={{ pointerEvents: "none" }}
        >
          <SlatsScene
            onReady={onReady}
            settings={settings}
            pointerRef={pointerRef}
            wakeRef={wakeRef}
          />
        </Canvas>
      </div>
      {children ? (
        <div className="relative z-10 h-full w-full">{children}</div>
      ) : null}
    </div>
  )
}

export default PrismaticSlats
