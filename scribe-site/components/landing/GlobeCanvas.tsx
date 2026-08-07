"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/* fig. 1 - publish orbit, flagship render.
   a dependency-free webgl2 fragment shader raycasts a terrain sphere and a
   thin solid ring system with true faces, edges, shadows, and occlusion, then
   halftones the scene into screen-space cobalt circles at the same dot pitch
   as the static assets. original composition, one dot language, zero runtime
   deps.
   fallback chain: this canvas -> css orbit -> static dithered png. */

const VERT = `#version 300 es
layout(location=0) in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform vec2 uOffset;
uniform float uTime;
out vec4 fragColor;

const vec3 COBALT = vec3(2.0, 52.0, 247.0) / 255.0;
const float CELL = 3.0;
const float RING_INNER = 1.20;
const float RING_OUTER = 1.34;
const float RING_HALF_HEIGHT = 0.016;
const float RING_TILT = -0.16;
const float ORBIT_INNER = 1.465;
const float ORBIT_OUTER = 1.495;
const float ORBIT_HALF_HEIGHT = 0.006;
const float ORBIT_TILT = 0.68;
const float ORBIT_RADIUS = 1.48;
const float SATELLITE_RADIUS = 0.07;

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

vec3 annulusLocal(vec3 p, float tilt){
  float c = cos(tilt);
  float s = sin(tilt);
  return vec3(c * p.x + s * p.y, -s * p.x + c * p.y, p.z);
}

vec3 orbitWorld(vec3 p, float tilt){
  float c = cos(tilt);
  float s = sin(tilt);
  return vec3(c * p.x - s * p.y, s * p.x + c * p.y, p.z);
}

// Nearest hit on a closed annular solid: two faces plus inner/outer walls.
vec4 annulusHit(
  vec3 roWorld,
  vec3 rdWorld,
  float tilt,
  float innerRadius,
  float outerRadius,
  float halfHeight
){
  vec3 ro = annulusLocal(roWorld, tilt);
  vec3 rd = annulusLocal(rdWorld, tilt);
  float best = 1e9;
  vec3 normal = vec3(0.0);

  if(abs(rd.y) > 1e-5){
    for(int side = -1; side <= 1; side += 2){
      float faceY = float(side) * halfHeight;
      float t = (faceY - ro.y) / rd.y;
      vec3 p = ro + rd * t;
      float radius = length(p.xz);
      if(t > 0.0 && t < best && radius > innerRadius && radius < outerRadius){
        best = t;
        normal = vec3(0.0, float(side), 0.0);
      }
    }
  }

  float a = dot(rd.xz, rd.xz);
  float b = dot(ro.xz, rd.xz);
  if(a > 1e-6){
    for(int wall = 0; wall < 2; wall++){
      float radius = wall == 0 ? innerRadius : outerRadius;
      float h = b * b - a * (dot(ro.xz, ro.xz) - radius * radius);
      if(h < 0.0) continue;
      vec2 roots = (-b + vec2(-sqrt(h), sqrt(h))) / a;
      for(int root = 0; root < 2; root++){
        float t = roots[root];
        vec3 p = ro + rd * t;
        if(t > 0.0 && t < best && abs(p.y) <= halfHeight){
          best = t;
          float direction = wall == 0 ? -1.0 : 1.0;
          vec2 radialNormal = normalize(p.xz) * direction;
          normal = vec3(radialNormal.x, 0.0, radialNormal.y);
        }
      }
    }
  }

  if(best == 1e9) return vec4(-1.0);
  return vec4(best, normalize(orbitWorld(normal, tilt)));
}

float ringShadow(vec3 p, vec3 lightDirection, float tilt){
  vec3 ro = annulusLocal(p + lightDirection * 0.012, tilt);
  vec3 rd = annulusLocal(lightDirection, tilt);
  if(abs(rd.y) < 1e-5) return 0.0;
  float t = -ro.y / rd.y;
  if(t <= 0.0) return 0.0;
  float radius = length((ro + rd * t).xz);
  float inner = smoothstep(RING_INNER - 0.025, RING_INNER + 0.025, radius);
  float outer = 1.0 - smoothstep(RING_OUTER - 0.025, RING_OUTER + 0.025, radius);
  return inner * outer;
}

float ign(vec2 p){
  return fract(52.9829189 * fract(0.06711056 * p.x + 0.00583715 * p.y));
}

void main(){
  vec2 sceneCoord = gl_FragCoord.xy - uOffset;

  // lookat camera: slight elevation so the ring reads as a flat saturn band
  vec3 ro = vec3(0.0, 1.05, 3.4);
  vec3 fwd = normalize(vec3(0.0) - ro);
  vec3 rgt = normalize(cross(fwd, vec3(0.0, 1.0, 0.0)));
  vec3 upv = cross(rgt, fwd);
  vec2 uv = (sceneCoord - 0.5 * uRes) / uRes.y * 1.52;
  uv.y += 0.03;
  vec3 rd = normalize(uv.x * rgt + uv.y * upv + 1.9 * fwd);

  float spin = uTime * 0.12;
  mat2 rot = mat2(cos(spin), -sin(spin), sin(spin), cos(spin));
  vec3 L = normalize(vec3(-0.55, 0.75, 0.45));
  float ringTilt = RING_TILT + sin(uTime * 0.16) * 0.035;
  float orbitTilt = ORBIT_TILT + sin(uTime * 0.11 + 1.7) * 0.025;

  float ink = 0.0;
  float coverage = 0.0;
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
    float shadow = ringShadow(p, L, ringTilt);

    // lit side nearly clean, terminator dense; terrain chews the light
    float s = (1.0 - diff) * 0.92;
    s += continents * 0.38 * (0.25 + diff);
    s += (fbm(nr * 7.0) - 0.5) * 0.18;
    s += shadow * 0.28;
    ink = clamp(s, 0.0, 1.0);
    coverage = 1.0;
    closest = t.x;
  }

  // tiny technical satellite
  float sa = uTime * 0.35;
  vec3 satC = orbitWorld(
    vec3(cos(sa) * ORBIT_RADIUS, 0.0, sin(sa) * ORBIT_RADIUS),
    orbitTilt
  );
  vec2 ts = sphereHit(ro, rd, satC, SATELLITE_RADIUS);
  if(ts.x > 0.0 && ts.x < closest){
    vec3 p = ro + rd * ts.x;
    float diff = clamp(dot(normalize(p - satC), L), 0.0, 1.0);
    ink = clamp((1.0 - diff) * 0.9 + 0.1, 0.0, 1.0);
    coverage = 1.0;
    closest = ts.x;
  }

  // Paper-thin Saturn ring: noisy faces, restrained edge ink, real occlusion.
  vec4 ring = annulusHit(
    ro,
    rd,
    ringTilt,
    RING_INNER,
    RING_OUTER,
    RING_HALF_HEIGHT
  );
  if(ring.x > 0.0 && ring.x < closest){
    vec3 p = ro + rd * ring.x;
    vec3 localPoint = annulusLocal(p, ringTilt);
    vec3 normal = ring.yzw;
    float radius = length(localPoint.xz);
    float face = smoothstep(
      0.35,
      0.8,
      abs(annulusLocal(normal, ringTilt).y)
    );
    float diffuse = 0.34 + 0.66 * abs(dot(normal, L));
    float bands = 0.50 + 0.28 * sin(radius * 30.0);
    bands += 0.20 * (fbm(localPoint * 5.0) - 0.5);
    float angularFlow =
      0.08 * sin(atan(localPoint.z, localPoint.x) * 12.0 - uTime * 0.55);
    bands += angularFlow;
    float gap = smoothstep(
      0.018,
      0.042,
      abs(radius - 0.5 * (RING_INNER + RING_OUTER))
    );
    float edgeInk = mix(0.28, 0.52, diffuse);
    float faceInk = bands * gap * diffuse;

    vec2 globeBlock = sphereHit(
      p + L * 0.012,
      L,
      vec3(0.0),
      1.0
    );
    float globeShadow = step(0.0, globeBlock.x);
    ink = clamp(mix(edgeInk, faceInk, face) + globeShadow * 0.12, 0.0, 1.0);
    coverage = 1.0;
    closest = ring.x;
  }

  // A second, finer orbital trace crosses the Saturn ring at about 48 degrees.
  // It shares the same depth test, so the far pass disappears behind the globe.
  vec4 orbit = annulusHit(
    ro,
    rd,
    orbitTilt,
    ORBIT_INNER,
    ORBIT_OUTER,
    ORBIT_HALF_HEIGHT
  );
  if(orbit.x > 0.0 && orbit.x < closest){
    vec3 p = ro + rd * orbit.x;
    vec3 localPoint = annulusLocal(p, orbitTilt);
    vec3 normal = orbit.yzw;
    float face = smoothstep(
      0.35,
      0.8,
      abs(annulusLocal(normal, orbitTilt).y)
    );
    float diffuse = 0.42 + 0.58 * abs(dot(normal, L));
    float orbitAngle = atan(localPoint.z, localPoint.x);
    float traceNoise =
      0.80 + 0.20 * sin(orbitAngle * 10.0 - uTime * 0.72);
    float wallInk = mix(0.22, 0.38, diffuse);
    float faceInk = mix(0.38, 0.58, diffuse) * traceNoise;
    ink = clamp(mix(wallInk, faceInk, face), 0.0, 1.0);
    coverage = 1.0;
    closest = orbit.x;
  }

  // halftone: circular cobalt dots that swell with ink, on a 3px grid
  vec2 cell = floor(sceneCoord / CELL);
  vec2 fc = fract(sceneCoord / CELL) - 0.5;
  float jitter = (ign(cell) - 0.5) * 0.22;
  float rad = clamp(ink + jitter, 0.0, 1.0) * 0.68 * coverage;
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
    const uOffset = gl.getUniformLocation(prog, "uOffset");
    const uTime = gl.getUniformLocation(prog, "uTime");

    let raf = 0;
    let running = false;
    let visible = true;
    const start = performance.now();

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasRect = canvas!.getBoundingClientRect();
      const stageRect = canvas!.parentElement!.getBoundingClientRect();
      const w = Math.round(canvasRect.width * dpr);
      const h = Math.round(canvasRect.height * dpr);
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w;
        canvas!.height = h;
        gl!.viewport(0, 0, w, h);
      }
      return {
        sceneWidth: stageRect.width * dpr,
        sceneHeight: stageRect.height * dpr,
        offsetX: (stageRect.left - canvasRect.left) * dpr,
        offsetY: (canvasRect.bottom - stageRect.bottom) * dpr,
      };
    }

    function frame() {
      const size = resize();
      const t = (performance.now() - start) / 1000;
      gl!.uniform2f(uRes, size.sceneWidth, size.sceneHeight);
      gl!.uniform2f(uOffset, size.offsetX, size.offsetY);
      gl!.uniform1f(uTime, t);
      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
      if (running && visible && !document.hidden) {
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

    play();

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

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        play();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
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
      className={`pointer-events-none absolute bg-transparent opacity-0 data-[active=true]:opacity-100 ${className}`}
      style={{
        "--orbit-overscan": "min(9%, var(--scribe-gutter))",
        top: "calc(-1 * var(--orbit-overscan))",
        left: "calc(-1 * var(--orbit-overscan))",
        width:
          "calc(100% + var(--orbit-overscan) + var(--orbit-overscan))",
        height:
          "calc(100% + var(--orbit-overscan) + var(--orbit-overscan))",
      } as CSSProperties}
    />
  );
}
