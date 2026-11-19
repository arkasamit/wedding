"use client";

import { useContext, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { EntranceOpened } from "./entrance-state";

const revealRatio = 0.23;
const portraitRevealRatio = 0.45;

export function Cinema({ intensity }: { intensity: number }) {
  const opened = useContext(EntranceOpened);
  useEffect(() => {
    if (!opened || intensity <= 0 || !("IntersectionObserver" in window)) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      desktop: "(min-width: 900px) and (pointer: fine)",
      touch: "(pointer: coarse)",
    }, ({ conditions }) => {
      if (!conditions?.motion) return;
      const pending = new Map<Element, { reveal: () => void; image?: HTMLImageElement }>();
      const inView = new Set<Element>();
      const cleanups: (() => void)[] = [];
      const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const threshold = entry.target.classList.contains("portrait-entry") ? portraitRevealRatio : revealRatio;
          if (entry.intersectionRatio >= threshold) {
            inView.add(entry.target);
            reveal(entry.target);
          } else {
            inView.delete(entry.target);
          }
        }
      }, { threshold: [revealRatio, portraitRevealRatio], rootMargin: "0px 0px -12px 0px" });

      function reveal(target: Element) {
        const effect = pending.get(target);
        if (!effect || !inView.has(target) || effect.image?.complete === false) return;
        pending.delete(target);
        inView.delete(target);
        observer.unobserve(target);
        effect.reveal();
      }

      function watch(target: Element, run: () => void, image?: HTMLImageElement) {
        pending.set(target, { reveal: run, image });
        observer.observe(target);
        if (image && !image.complete) {
          const ready = () => reveal(target);
          image.addEventListener("load", ready, { once: true });
          image.addEventListener("error", ready, { once: true });
          cleanups.push(() => {
            image.removeEventListener("load", ready);
            image.removeEventListener("error", ready);
          });
        }
      }

      function animateClass(target: Element, name: string, image?: HTMLImageElement) {
        watch(target, () => target.classList.add(name), image);
        cleanups.push(() => target.classList.remove(name));
      }

      const desktop = conditions.desktop;
      const distance = intensity * (desktop ? 26 : 5);
      for (const scene of document.querySelectorAll("[data-scene]")) {
        const artwork = scene.querySelectorAll(".sprig, .couple-seal, .scene-art");
        if (!artwork.length) continue;
        gsap.fromTo(artwork, { "--scene-drift": `${distance}px` }, {
          "--scene-drift": `${-distance}px`, ease: "none",
          scrollTrigger: { trigger: scene, start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }

      const cover = conditions.touch ? document.querySelector(".hero-photo") : null;
      if (cover) {
        gsap.fromTo(cover, { "--cover-scroll": "-2.5px" }, {
          "--cover-scroll": "2.5px", ease: "none",
          scrollTrigger: { trigger: cover, start: "top bottom", end: "bottom top", scrub: 0.9 },
        });
      }

      const portraits = document.querySelectorAll(".portrait-entry");
      const connection = document.querySelector(".portrait-connection");
      let arrivals = 0;
      for (const entry of portraits) {
        const plane = entry.querySelector<HTMLElement>(".portrait-plane");
        function onArrival(event: AnimationEvent) {
          if (event.target !== plane || event.animationName !== "portrait-arrival") return;
          plane?.removeEventListener("animationend", onArrival);
          arrivals++;
          if (arrivals === portraits.length && connection) animateClass(connection, "is-connection-drawn");
        }
        plane?.addEventListener("animationend", onArrival);
        cleanups.push(() => plane?.removeEventListener("animationend", onArrival));
        entry.classList.add("portrait-prepared");
        cleanups.push(() => entry.classList.remove("portrait-prepared"));
        animateClass(entry, "is-portrait-arriving", entry.querySelector("img") ?? undefined);
      }
      for (const copy of document.querySelectorAll(".portrait-copy")) {
        animateClass(copy, "is-portrait-named");
      }

      for (const linework of document.querySelectorAll(".ink-reveal")) {
        const ink = gsap.fromTo(linework.querySelectorAll("[data-ink]"),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: desktop ? 1.42 : 2, stagger: 0.03, ease: "sine.inOut", paused: true });
        watch(linework, () => ink.play());
      }

      for (const panel of document.querySelectorAll(".event-panel")) {
        const copy = panel.querySelector(".event-copy");
        if (!copy) continue;
        const x = desktop ? (panel.classList.contains("haldi") ? 18 : -18) : 0;
        const act = gsap.timeline({ paused: true, defaults: { ease: "sine.out" } })
          .from(copy, { x, y: desktop ? 0 : 4, opacity: 0.94, duration: 1, clearProps: "transform,opacity" })
          .fromTo(copy, { "--act-rule": 0 }, { "--act-rule": 1, duration: 1.05 }, 0.13);
        if (desktop) act.from(copy.children, { y: 6, stagger: 0.075, duration: 0.63, clearProps: "transform" }, 0.18);
        else act.timeScale(0.75);
        watch(copy, () => {
          panel.classList.add("is-staged");
          act.play();
        });
        cleanups.push(() => panel.classList.remove("is-staged"));
      }

      const finale = document.querySelector(".grand-finale");
      const closing = finale?.querySelector(".closing-card");
      if (finale && closing) {
        const finish = gsap.timeline({ paused: true })
          .fromTo(closing, { "--closing-ink": 0 }, { "--closing-ink": 1, duration: 1.42, ease: "sine.inOut" })
          .from(closing.querySelectorAll(".closing-lotus, .lamp"), {
            y: 7, scale: 0.9, opacity: 0.78, stagger: 0.14, duration: 1.25, ease: "sine.out",
            clearProps: "transform,opacity",
          }, 0);
        if (!desktop) finish.timeScale(0.75);
        watch(closing, () => {
          finale.classList.add("is-finale");
          finish.play();
        });
        cleanups.push(() => finale.classList.remove("is-finale"));
      }

      return () => {
        observer.disconnect();
        for (const clean of cleanups) clean();
      };
    });
    return () => media.revert();
  }, [intensity, opened]);

  return null;
}
