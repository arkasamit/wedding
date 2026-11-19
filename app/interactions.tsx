"use client";

import Image from "next/image";
import { Copy, Check, Heart } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Alpana } from "./art";
import type { Person } from "./wedding";

const portraitPetals = [3, 96, 9, 90, 14, 86];

function tiltPortrait(event: ReactPointerEvent<HTMLDivElement>) {
  if (event.pointerType !== "mouse") return;
  const region = event.currentTarget;
  const bounds = region.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, 2 * (event.clientX - bounds.left) / bounds.width - 1));
  const y = Math.max(-1, Math.min(1, 2 * (event.clientY - bounds.top) / bounds.height - 1));
  region.style.setProperty("--portrait-tilt-x", `${-y * 3.8}deg`);
  region.style.setProperty("--portrait-tilt-y", `${x * 4.6}deg`);
}

export function Portraits({ people }: { people: readonly [Person, Person] }) {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const connection = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState([false, false]);
  const source = hovered ?? selected ?? focused;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const svg = connection.current;
    const grid = svg?.closest(".portrait-grid");
    if (!svg || !grid || reducedMotion) return;
    const [groom, bride] = grid.querySelectorAll(".portrait-entry");
    const [groomFrame, brideFrame] = grid.querySelectorAll<SVGSVGElement>(".portrait-frame");
    function fitHeartToFrames() {
      if (!svg || !grid) return;
      const groomMatrix = groomFrame.getScreenCTM();
      const brideMatrix = brideFrame.getScreenCTM();
      if (!groomMatrix || !brideMatrix) return;
      // The two drawing origins sit on the outer strokes of the arched frames.
      const left = new DOMPoint(5, 175).matrixTransform(groomMatrix);
      const right = new DOMPoint(395, 175).matrixTransform(brideMatrix);
      const bounds = grid.getBoundingClientRect();
      const height = Math.min(groom.clientHeight, bride.clientHeight);
      svg.style.left = `${left.x - bounds.left}px`;
      svg.style.top = `${(left.y + right.y) / 2 - bounds.top - height * .36}px`;
      svg.style.width = `${right.x - left.x}px`;
      svg.style.height = `${height}px`;
    }
    const observer = new ResizeObserver(fitHeartToFrames);
    [grid, groom, bride].forEach(element => observer.observe(element));
    svg.addEventListener("animationstart", fitHeartToFrames);
    fitHeartToFrames();
    return () => {
      observer.disconnect();
      svg.removeEventListener("animationstart", fitHeartToFrames);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const photos = buttons.current;
    const observer = new IntersectionObserver((entries) => {
      setVisible((current) => {
        const next = [...current];
        for (const entry of entries) {
          const index = photos.findIndex((photo) => photo === entry.target);
          if (index >= 0) next[index] = entry.intersectionRatio >= 0.45;
        }
        return next;
      });
    }, { threshold: 0.45 });
    photos.forEach((button) => { if (button) observer.observe(button); });

    function dismiss(event: PointerEvent | MouseEvent) {
      if (!photos.some((button) => button?.contains(event.target as Node))) {
        setSelected(null);
        setHovered(null);
        setFocused(null);
      }
    }
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setHovered(null);
        setFocused(null);
        setSelected(null);
      }
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("click", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      observer.disconnect();
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("click", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, []);

  return <div className="portrait-grid">
    <svg ref={connection} className="portrait-connection" data-ambient="" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path pathLength="1" d="M0 36C0 -2 32 -13 50 25" />
      <path pathLength="1" d="M100 36C100 -2 68 -13 50 25" />
      <path pathLength="1" d="M0 36C0 61 27 80 50 99" />
      <path pathLength="1" d="M100 36C100 61 73 80 50 99" />
    </svg>
    {people.map((person, index) => {
      const { photo } = person;
      const active = source === index;
      const receivesHeart = source === 1 - index;
      return (
        <article key={person.role} className="portrait" data-portrait={index === 0 ? "left" : "right"}>
          <div
            className="portrait-entry"
            data-ambient=""
            onPointerMove={reducedMotion ? undefined : tiltPortrait}
            onPointerLeave={(event) => {
              event.currentTarget.style.removeProperty("--portrait-tilt-x");
              event.currentTarget.style.removeProperty("--portrait-tilt-y");
            }}
          >
            <div className="portrait-petals marigold-rain" aria-hidden="true">
              {portraitPetals.map((x, i) => <i key={x} style={{
                "--portrait-petal-x": `${x}%`,
                "--portrait-petal-delay": `${i * 150}ms`,
                "--portrait-petal-drift": `${i % 2 ? 12 : -12}px`,
              } as CSSProperties} />)}
            </div>
            <Alpana className="portrait-mandala" />
            <div className="portrait-plane">
              <button
                ref={(node) => { buttons.current[index] = node; }}
                className="portrait-button"
                data-active={active}
                data-heart={receivesHeart}
                type="button"
                aria-label={`${photo.alt}। অন্য ছবিতে হৃদয়ের চিহ্ন দেখান`}
                aria-pressed={selected === index}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(index); }}
                onPointerLeave={() => setHovered(null)}
                onFocus={(event) => { if (event.currentTarget.matches(":focus-visible")) setFocused(index); }}
                onBlur={() => setFocused(null)}
                onClick={() => {
                  setFocused(null);
                  setHovered(null);
                  setSelected((previous) => previous === index ? null : index);
                }}
                style={{ "--focal": photo.focal, "--mobile-focal": photo.mobileFocal } as CSSProperties}
              >
                <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 850px) 47vw, 400px" />
                <motion.span
                  className="heart-overlay"
                  aria-hidden="true"
                  initial={false}
                  animate={{ opacity: receivesHeart ? 1 : 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.44, ease: [0.22, 0.61, 0.36, 1] }}
                ><Heart /></motion.span>
                <span className="heart-feedback" aria-hidden="true" hidden={selected !== index || visible[1 - index]}><Heart size={22} /></span>
              </button>
              <svg className="portrait-frame" viewBox="0 0 400 485" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path pathLength="1" d="M200 5C90 5 5 52 5 119v354q0 7 7 7h376q7 0 7-7V119C395 52 310 5 200 5Z" />
                <path pathLength="1" d="M200 12C94 12 12 56 12 121v349q0 3 3 3h370q3 0 3-3V121C388 56 306 12 200 12Z" />
              </svg>
            </div>
          </div>
          <div className="portrait-copy">
            <p className="kicker">{person.role}</p>
            <h3>
              <span className="portrait-ink-name">{person.name.bn}</span>
              <svg className="portrait-name-flourish" viewBox="0 0 132 13" fill="none" aria-hidden="true">
                <path pathLength="1" d="M2 9c24-7 48-8 69-4 13 3 19 6 10 6-17 0-28-3-12-6 17-3 40-3 61 0" />
              </svg>
            </h3>
            <p>পিতা · {person.father.bn}</p>
            <p>মাতা · {person.mother.bn}</p>
          </div>
        </article>
      );
    })}
  </div>;
}

export function CopyAddress({ address }: { address: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "selected">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(address);
      setStatus("copied");
    } catch {
      const node = document.getElementById("venue-address");
      const selection = window.getSelection();
      if (!node || !selection) return;
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
      if (document.execCommand("copy")) {
        selection.removeAllRanges();
        setStatus("copied");
      } else {
        setStatus("selected");
      }
    }
  }

  return <>
    <button className="action action-outline" type="button" onClick={copy}>
      {status === "copied" ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
      ঠিকানা কপি করুন
    </button>
    <p className="copy-status" role="status">
      {status === "copied" && "ঠিকানা কপি করা হয়েছে"}
      {status === "selected" && "ঠিকানাটি নির্বাচন করা হয়েছে। এখান থেকে কপি করুন।"}
    </p>
  </>;
}
