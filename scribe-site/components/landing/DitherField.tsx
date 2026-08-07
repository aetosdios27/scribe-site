"use client";

import { useRef } from "react";
import { useInView, useReducedMotion } from "motion/react";
import Dither from "@/components/reactbits/dither";

const PAPER = [0.9686, 0.9647, 0.9451] as const;
const COBALT = [0.0078, 0.2039, 0.9686] as const;

const GEOMETRY = {
  "flow-fine": {
    patternMode: 2,
    waveSpeed: 0.015,
    waveFrequency: 3.4,
    waveAmplitude: 0.5,
    colorNum: 6,
    pixelSize: 3,
    flowAngle: 0,
    verticalBias: 0.7,
    intensity: 0.8,
  },
  "flow-soft": {
    patternMode: 2,
    waveSpeed: 0.02,
    waveFrequency: 1.8,
    waveAmplitude: 0.5,
    colorNum: 5,
    pixelSize: 3,
    flowAngle: 0,
    verticalBias: 0,
    intensity: 0.45,
  },
  flow: {
    patternMode: 2,
    waveSpeed: 0.02,
    waveFrequency: 2.2,
    waveAmplitude: 0.55,
    colorNum: 6,
    pixelSize: 3,
    flowAngle: 0,
    verticalBias: 0.7,
    intensity: 1,
  },
} as const;

export type DitherGeometry = keyof typeof GEOMETRY;

export interface DitherFieldProps {
  variant: "paper" | "cobalt";
  geometry?: DitherGeometry;
  className?: string;
}

export function DitherField({
  variant,
  geometry = "flow",
  className,
}: DitherFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useInView(ref, { margin: "300px 0px", once: true });
  const visible = useInView(ref, { margin: "100px 0px" });
  const reducedMotion = useReducedMotion();

  const backgroundColor = variant === "paper" ? PAPER : COBALT;
  const waveColor = variant === "paper" ? COBALT : PAPER;

  return (
    <div ref={ref} className={className} aria-hidden="true">
      {mounted && !reducedMotion ? (
        <Dither
          backgroundColor={[...backgroundColor]}
          waveColor={[...waveColor]}
          enableMouseInteraction={false}
          frameloop={visible ? "always" : "never"}
          {...GEOMETRY[geometry]}
        />
      ) : null}
    </div>
  );
}
