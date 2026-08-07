"use client";

import Lenis from "lenis";
import { useEffect } from "react";

const HEADER_OFFSET_GAP = 8;

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      syncTouch: false,
    });

    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const origin = event.target;
      if (!(origin instanceof Element)) return;

      const anchor = origin.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.length <= 1) return;

      const id = decodeURIComponent(href.slice(1));
      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();
      event.stopPropagation();

      const header = document.querySelector("header");
      const offset = (header?.offsetHeight ?? 64) + HEADER_OFFSET_GAP;

      lenis.scrollTo(destination, { offset: -offset });

      if (href !== window.location.hash) {
        history.pushState(null, "", href);
      }
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
    };
  }, []);

  return null;
}
