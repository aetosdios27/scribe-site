"use client";

import { useSyncExternalStore } from "react";
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

const subscribeClient = () => () => {};

export function DitherField({
  variant,
  geometry = "flow",
  className,
}: DitherFieldProps) {
  const isClient = useSyncExternalStore(
    subscribeClient,
    () => true,
    () => false,
  );

  const backgroundColor = variant === "paper" ? PAPER : COBALT;
  const waveColor = variant === "paper" ? COBALT : PAPER;

  return (
    <div className={className} aria-hidden="true">
      {/* mount on client load (not on scroll) and keep animating so the
          dither is warm the moment it enters the viewport */}
      {isClient ? (
        <Dither
          backgroundColor={[...backgroundColor]}
          waveColor={[...waveColor]}
          enableMouseInteraction={false}
          frameloop="always"
          {...GEOMETRY[geometry]}
        />
      ) : null}
    </div>
  );
}
