"use client";

import { useEffect, useRef, useState } from "react";

export function ProductFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [canAutoPlay, setCanAutoPlay] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let visible = false;

    const syncPlayback = () => {
      setCanAutoPlay(visible);

      if (visible) {
        void video.play().catch(() => {
          setCanAutoPlay(false);
        });
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
        syncPlayback();
      },
      { threshold: 0.15 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, []);

  return (
    <section
      id="product"
      aria-labelledby="product-film-heading"
      className="product-film-section scroll-mt-16"
    >
      <div className="shell product-film-inner">
        <h2 id="product-film-heading" className="product-film-heading">
          Scribe, running on a real site.
        </h2>

        <div className="product-film-viewport">
          <div className="product-film-track">
            <video
              ref={videoRef}
              className="product-film-video"
              autoPlay={canAutoPlay}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/media/scribe-product-film-poster.webp"
              aria-label="Scribe CLI integration and Studio editing a real website"
            >
              <source
                src="/media/scribe-product-film.webm"
                type="video/webm"
              />
              <source src="/media/scribe-product-film.mp4" type="video/mp4" />
              <p>
                Your browser cannot play the Scribe product film. You can{" "}
                <a href="/media/scribe-product-film.mp4">
                  download the product film
                </a>
                .
              </p>
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

