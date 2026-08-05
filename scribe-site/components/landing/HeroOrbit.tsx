import { GlobeCanvas } from "./GlobeCanvas";

export function HeroOrbit() {
  return (
    <div className="relative w-full max-w-[400px] lg:-translate-y-7 lg:max-w-[519px]">
      <div
        data-orbit-stage
        className="relative aspect-[519/555] w-full overflow-visible"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pixel-edge dither assets must bypass optimizer re-encoding */}
        <img
          src="/art/dither/hero-sphere-1x.png"
          srcSet="/art/dither/hero-sphere-1x.png 1x, /art/dither/hero-sphere-2x.png 2x"
          width={519}
          height={555}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full [:has(~canvas[data-active=true])]:invisible"
        />

        <svg
          viewBox="0 0 600 640"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full overflow-visible [:has(~canvas[data-active=true])]:hidden"
        >
          <g className="ring-tilt-a">
            <ellipse
              cx="300"
              cy="310"
              rx="268"
              ry="98"
              transform="rotate(-16 300 310)"
              fill="none"
              stroke="var(--scribe-cobalt)"
              strokeWidth="7"
            />
          </g>
          <g className="ring-tilt-b">
            <ellipse
              cx="300"
              cy="310"
              rx="212"
              ry="150"
              transform="rotate(24 300 310)"
              fill="none"
              stroke="var(--scribe-cobalt)"
              strokeOpacity="0.55"
              strokeWidth="4"
            />
          </g>

          {/* the article, quietly orbiting the website world */}
          <g className="orbit-sat-page">
            <rect
              x="-17"
              y="-22"
              width="34"
              height="44"
              fill="var(--scribe-paper)"
              stroke="var(--scribe-ink)"
              strokeWidth="3"
            />
            <path
              d="M-10 -12 h20 M-10 -4 h20 M-10 4 h13"
              stroke="var(--scribe-cobalt)"
              strokeWidth="2.5"
            />
          </g>

          {/* tiny technical satellite */}
          <rect
            className="orbit-sat-box"
            x="-6"
            y="-6"
            width="12"
            height="12"
            fill="var(--scribe-ink)"
          />
        </svg>

        <GlobeCanvas />
      </div>

    </div>
  );
}
