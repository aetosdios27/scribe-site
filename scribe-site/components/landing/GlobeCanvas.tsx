"use client";

import { useEffect, useRef } from "react";

/* fig. 1 - publish orbit, flagship render.
   a dependency-free webgl2 fragment shader raycasts a terrain sphere and a
   wide flat ring system (with true front/back occlusion), then halftones the
   scene into screen-space cobalt circles at the same dot pitch as the static
   assets. original composition, one dot language, zero runtime deps.
   fallback chain: this canvas -> css orbit -> static dithered png. */

const VERT = `#version 300 es
layout(location=0) in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
out vec4 fragColor;

const vec3 COBALT = vec3(23.0, 59.0, 255.0) / 255.0;
const float CELL = 3.0;

float hash(vec3 p){
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x){
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p){
  float v = 0.0;
  float a = 0.5;
  for(int i = 0; i < 4; i++){
    v += a * noise(p);
    p = p * 2.13 + 11.7;
    a *= 0.5;
  }
  return v;
}

vec2 sphereHit(vec3 ro, vec3 rd, vec3 c, float r){
  vec3 oc = ro - c;
  float b = dot(oc, rd);
  float cc = dot(oc, oc) - r * r;
  float h = b * b - cc;
  if(h < 0.0) return vec2(-1.0);
  h = sqrt(h);
  return vec2(-b - h, -b + h);
}

float ign(vec2 p){
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main(){
  // lookat camera: slight elevation so the ring reads as a flat saturn band
  vec3 ro = vec3(0.0, 1.05, 3.4);
  vec3 fwd = normalize(vec3(0.0) - ro);
  vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 upv = cross(rgt, fwd);
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * 1.52;
  uv.y += 0.03;
  vec3 rd = normalize(uv.x * rgt + uv.y * upv + 1.9 * fwd);

  float spin = uTime * 0.12;
  mat2 rot = mat2(cos(spin), -sin(spin), sin(spin), cos(spin));
  vec3 L = normalize(vec3(-0.55, 0.75, 0.45));

  float ink = 0.0;
  float closest = 1e9;

  // the website world
  vec2 t = sphereHit(ro, rd, vec3(0.0), 1.0);
  if(t.x > 0.0){
    vec3 p = ro + rd * t.x;
    vec3 n = normalize(p);
    vec3 nr = n;
    nr.xz = rot * nr.xz;

    float terrain = fbm(nr * 2.6);
    float continents = smoothstep(0.35, 0.65, terrain);
    float diff = clamp(dot(n, L), 0.0, 1.0);

    // lit side nearly clean, terminator dense; terrain chews the light
    float s = (1.0 - diff) * 0.92;
    s += continents * 0.38 * (0.25 + diff);
    s += (fbm(nr * 7.0) - 0.5) * 0.18;
    ink = clamp(s, 0.0, 1.0);
    closest = t.x;
  }

  // tiny technical satellite
  float sa = uTime * 0.35;
  vec3 satC = vec3(cos(sa) * 1.7, 0.22, sin(sa) * 1.25);
  vec2 ts = sphereHit(ro, rd, satC, 0.07);
  if(ts.x > 0.0 && ts.x < closest){
    vec3 p = ro + rd * ts.x;
    float diff = clamp(dot(normalize(p - satC), L), 0.0, 1.0);
    ink = clamp((1.0 - diff) * 0.9 + 0.1, 0.0, 1.0);
    closest = ts.x;
  }

  // wide flat ring system on the equator plane; the sphere eclipses the far pass
  vec3 rn = vec3(0.0, 1.0, 0.0);
  float denom = dot(rd, rn);
  if(abs(denom) > 1e-4){
    float tr = -dot(ro, rn) / denom;
    if(tr > 0.0 && tr < closest){
      vec3 p = ro + rd * tr;
      float r = length(p.xz);
      if(r > 1.35 && r < 1.75){
        float edge = smoothstep(1.35, 1.43, r) * (1.0 - smoothstep(1.67, 1.75, r));
        // band structure with a quiet cassini-style gap
        float bands = 0.5 + 0.28 * sin(r * 26.0) + 0.22 * (fbm(p * 5.0) - 0.5);
        bands *= 1.0 - 0.65 * (1.0 - smoothstep(0.0, 0.03, abs(r - 1.55)));
        float shade = 0.5 + 0.5 * clamp(dot(normalize(vec3(p.x, 0.0, p.z)), L), 0.0, 1.0);
        ink = max(ink, clamp(bands * shade, 0.0, 1.0) * edge);
      }
    }
  }

  // halftone: circular cobalt dots that swell with ink, on a 3px grid
  vec2 cell = floor(gl_FragCoord.xy / CELL);
  vec2 fc = fract(gl_FragCoord.xy / CELL) - 0.5;
  float jitter = (ign(cell) - 0.5) * 0.22;
  float rad = clamp(ink + jitter, 0.0, 1.0) * 0.68;
  float dot = 1.0 - smoothstep(rad - 0.1, rad + 0.1, length(fc));
  dot = step(0.5, dot) * step(0.03, rad);

  fragColor = vec4(COBALT * dot, dot);
}
`;

export function GlobeCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "low-power",
    });
    if (!gl) return; // fallback tiers below stay visible

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas!.clientWidth * dpr);
      const h = Math.round(canvas!.clientHeight * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
    }

    function frame() {
      resize();
      const t = reduced.matches ? 0 : (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uTime, t);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (!reduced.matches && running && visible && !document.hidden) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    function play() {
      if (!running && visible && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }

    // reveal only once the first frame is guaranteed drawable
    resize();
    frame();
    canvas.dataset.active = "true";

    if (!reduced.matches) play();

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) frame();
    });
    ro.observe(canvas);

    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : play());
    const onReduced = () => {
      cancelAnimationFrame(raf);
      running = false;
      play();
    };
    document.addEventListener("visibilitychange", onVis);
    reduced.addEventListener("change", onReduced);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      reduced.removeEventListener("change", onReduced);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full opacity-0 data-[active=true]:opacity-100 ${className}`}
    />
  );
}
