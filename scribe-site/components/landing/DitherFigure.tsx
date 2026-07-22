/* structural wrapper for phase-3 dithered artwork.

   plain <img> on purpose: the assets are precomputed lossless pixel-edge
   PNGs, and next/image re-encoding would smear the hard dither dots.
   1x/2x srcSet keeps them sharp on every density. */

export function DitherFigure({
  src1x,
  src2x,
  width,
  height,
  label,
  alt = "",
  priority = false,
  className = "",
  imgClassName = "",
}: {
  src1x: string;
  src2x: string;
  /** intrinsic 1x dimensions - reserve layout space, prevent cls */
  width: number;
  height: number;
  label?: string;
  /** decorative by default; bubbles carry their own real text */
  alt?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <figure className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element -- pixel-edge dither assets must bypass optimizer re-encoding */}
      <img
        src={src1x}
        srcSet={`${src1x} 1x, ${src2x} 2x`}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={imgClassName}
      />
      {label && (
        <figcaption className="mt-2 font-mono text-xs text-scribe-muted">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
