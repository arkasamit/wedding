"use client";

import { useContext, useEffect } from "react";
import { EntranceOpened } from "./entrance-state";

export function Ambience() {
  const opened = useContext(EntranceOpened);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const regions = document.querySelectorAll("[data-ambient]");
    const cover = opened ? document.querySelector<HTMLElement>(".hero-photo") : null;
    const motion = matchMedia("(prefers-reduced-motion: no-preference)");
    const mouse = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const visible = new Set<Element>();
    let frame = 0;

    function resetCover() {
      cancelAnimationFrame(frame);
      frame = 0;
      cover?.style.removeProperty("--cover-x");
      cover?.style.removeProperty("--cover-y");
    }

    function canMoveCover() {
      return cover && visible.has(cover) && motion.matches && mouse.matches && !document.hidden;
    }

    function sync() {
      for (const region of regions) {
        region.classList.toggle("ambient-playing", motion.matches && !document.hidden && visible.has(region));
      }
      if (!canMoveCover()) resetCover();
    }

    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) visible.add(target);
        else visible.delete(target);
      }
      sync();
    });
    regions.forEach((region) => observer.observe(region));
    if (cover) observer.observe(cover);

    let pointerX = 0;
    let pointerY = 0;
    function follow(event: PointerEvent) {
      if (event.pointerType !== "mouse" || !cover || !canMoveCover()) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const { left, top, width, height } = cover.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, 2 * (pointerX - left) / width - 1));
        const y = Math.max(-1, Math.min(1, 2 * (pointerY - top) / height - 1));
        cover.style.setProperty("--cover-x", `${x * 4}px`);
        cover.style.setProperty("--cover-y", `${y * 3}px`);
      });
    }

    cover?.addEventListener("pointermove", follow, { passive: true });
    cover?.addEventListener("pointerleave", resetCover);
    cover?.addEventListener("pointercancel", resetCover);
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    mouse.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      regions.forEach((region) => region.classList.remove("ambient-playing"));
      cover?.removeEventListener("pointermove", follow);
      cover?.removeEventListener("pointerleave", resetCover);
      cover?.removeEventListener("pointercancel", resetCover);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
      mouse.removeEventListener("change", sync);
      resetCover();
    };
  }, [opened]);

  return null;
}
